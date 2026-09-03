import type { ContentDetails } from "../../plugins/emitters/contentIndex"
import {
  SimulationNodeDatum,
  SimulationLinkDatum,
  Simulation,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  forceRadial,
  zoomIdentity,
  select,
  drag,
  zoom,
} from "d3"
import { Text, Graphics, Application, Container, Circle } from "pixi.js"
import { Group as TweenGroup, Tween as Tweened } from "@tweenjs/tween.js"
import { registerEscapeHandler, removeAllChildren } from "./util"
import { FullSlug, SimpleSlug, getFullSlug, resolveRelative, simplifySlug } from "../../util/path"
import { D3Config } from "../Graph"

type GraphicsInfo = {
  color: string
  gfx: Graphics
  alpha: number
  active: boolean
}

type NodeData = {
  id: SimpleSlug
  text: string
  tags: string[]
} & SimulationNodeDatum

type SimpleLinkData = {
  source: SimpleSlug
  target: SimpleSlug
}

type LinkData = {
  source: NodeData
  target: NodeData
} & SimulationLinkDatum<NodeData>

type LinkRenderData = GraphicsInfo & {
  simulationData: LinkData
}

type NodeRenderData = GraphicsInfo & {
  simulationData: NodeData
  label: Text
}

type LabelBounds = {
  left: number
  right: number
  top: number
  bottom: number
}

const localStorageKey = "graph-visited"
function getVisited(): Set<SimpleSlug> {
  return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"))
}

function addToVisited(slug: SimpleSlug) {
  const visited = getVisited()
  visited.add(slug)
  localStorage.setItem(localStorageKey, JSON.stringify([...visited]))
}

type TweenNode = {
  update: (time: number) => void
  stop: () => void
}

function getGraphDimensions(graph: HTMLElement) {
  const parent = graph.parentElement
  const graphRect = graph.getBoundingClientRect()
  const parentRect = parent?.getBoundingClientRect()
  const isGlobalGraph = graph.classList.contains("global-graph-container")

  return {
    width: Math.max(
      Math.round(graphRect.width),
      isGlobalGraph ? 0 : Math.round(parentRect?.width ?? 0),
    ),
    height: Math.max(
      Math.round(graphRect.height),
      isGlobalGraph ? 0 : Math.round(parentRect?.height ?? 0),
      250,
    ),
  }
}

async function renderGraph(graph: HTMLElement, fullSlug: FullSlug) {
  const slug = simplifySlug(fullSlug)
  const visited = getVisited()
  removeAllChildren(graph)

  let {
    drag: enableDrag,
    zoom: enableZoom,
    depth,
    scale,
    repelForce,
    centerForce,
    linkDistance,
    fontSize,
    opacityScale,
    removeSlugs,
    removeTags,
    showTags,
    focusOnHover,
    enableRadial,
    labelOpacity = 0,
    graphLabels = {},
  } = JSON.parse(graph.dataset["cfg"]!) as D3Config

  const hiddenSlugs = new Set(removeSlugs.map((slug) => simplifySlug(slug as FullSlug)))
  const data: Map<SimpleSlug, ContentDetails> = new Map(
    Object.entries<ContentDetails>(await fetchData)
      .map(([k, v]) => [simplifySlug(k as FullSlug), v] as const)
      .filter(([slug]) => !hiddenSlugs.has(slug)),
  )
  const links: SimpleLinkData[] = []
  const tags: SimpleSlug[] = []
  const validLinks = new Set(data.keys())

  const tweens = new Map<string, TweenNode>()
  for (const [source, details] of data.entries()) {
    const outgoing = details.links ?? []

    for (const dest of outgoing) {
      if (validLinks.has(dest)) {
        links.push({ source: source, target: dest })
      }
    }

    if (showTags) {
      const localTags = details.tags
        .filter((tag) => !removeTags.includes(tag))
        .map((tag) => simplifySlug(("tags/" + tag) as FullSlug))

      tags.push(...localTags.filter((tag) => !tags.includes(tag)))

      for (const tag of localTags) {
        links.push({ source: source, target: tag })
      }
    }
  }

  const neighbourhood = new Set<SimpleSlug>()
  const wl: (SimpleSlug | "__SENTINEL")[] = validLinks.has(slug) ? [slug, "__SENTINEL"] : []
  if (depth >= 0) {
    while (depth >= 0 && wl.length > 0) {
      // compute neighbours
      const cur = wl.shift()!
      if (cur === "__SENTINEL") {
        depth--
        wl.push("__SENTINEL")
      } else {
        neighbourhood.add(cur)
        const outgoing = links.filter((l) => l.source === cur)
        const incoming = links.filter((l) => l.target === cur)
        wl.push(...outgoing.map((l) => l.target), ...incoming.map((l) => l.source))
      }
    }
  } else {
    validLinks.forEach((id) => neighbourhood.add(id))
    if (showTags) tags.forEach((tag) => neighbourhood.add(tag))
  }

  const nodes = [...neighbourhood].map((url) => {
    const details = data.get(url)
    const text = url.startsWith("tags/")
      ? "#" + url.substring(5)
      : (graphLabels[url] ?? details?.title ?? url)
    return {
      id: url,
      text,
      tags: data.get(url)?.tags ?? [],
    }
  })
  const graphData: { nodes: NodeData[]; links: LinkData[] } = {
    nodes,
    links: links
      .filter((l) => neighbourhood.has(l.source) && neighbourhood.has(l.target))
      .map((l) => ({
        source: nodes.find((n) => n.id === l.source)!,
        target: nodes.find((n) => n.id === l.target)!,
      })),
  }

  const { width, height } = getGraphDimensions(graph)

  // we virtualize the simulation and use pixi to actually render it
  const simulation: Simulation<NodeData, LinkData> = forceSimulation<NodeData>(graphData.nodes)
    .force("charge", forceManyBody().strength(-100 * repelForce))
    .force("center", forceCenter().strength(centerForce))
    .force("link", forceLink(graphData.links).distance(linkDistance))
    .force("collide", forceCollide<NodeData>((n) => nodeRadius(n)).iterations(3))

  const radius = (Math.min(width, height) / 2) * 0.42
  if (enableRadial) simulation.force("radial", forceRadial(radius).strength(0.2))

  // Resolve the initial layout before the canvas is shown so labels begin in
  // their final above/below position instead of visibly flipping as it settles.
  simulation.stop()
  const initialTicks = Math.ceil(
    Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()),
  )
  simulation.tick(initialTicks)

  // precompute style prop strings as pixi doesn't support css variables
  const cssVars = [
    "--secondary",
    "--tertiary",
    "--gray",
    "--light",
    "--lightgray",
    "--dark",
    "--darkgray",
    "--bodyFont",
  ] as const
  const computedStyleMap = cssVars.reduce(
    (acc, key) => {
      acc[key] = getComputedStyle(document.documentElement).getPropertyValue(key)
      return acc
    },
    {} as Record<(typeof cssVars)[number], string>,
  )

  // calculate color
  const color = (d: NodeData) => {
    const isCurrent = d.id === slug
    if (isCurrent) {
      return computedStyleMap["--secondary"]
    } else if (visited.has(d.id) || d.id.startsWith("tags/")) {
      return computedStyleMap["--tertiary"]
    } else {
      return computedStyleMap["--gray"]
    }
  }

  function nodeRadius(d: NodeData) {
    const numLinks = graphData.links.filter(
      (l) => l.source.id === d.id || l.target.id === d.id,
    ).length
    return 2 + Math.sqrt(numLinks)
  }

  let hoveredNodeId: string | null = null
  let pinnedTagNodeId: string | null = null
  let hoveredNeighbours: Set<string> = new Set()
  const linkRenderData: LinkRenderData[] = []
  const nodeRenderData: NodeRenderData[] = []
  function updateHoverInfo(newHoveredId: string | null) {
    hoveredNodeId = newHoveredId

    if (newHoveredId === null) {
      hoveredNeighbours = new Set()
      for (const n of nodeRenderData) {
        n.active = false
      }

      for (const l of linkRenderData) {
        l.active = false
      }
    } else {
      hoveredNeighbours = new Set()
      for (const l of linkRenderData) {
        const linkData = l.simulationData
        if (linkData.source.id === newHoveredId || linkData.target.id === newHoveredId) {
          hoveredNeighbours.add(linkData.source.id)
          hoveredNeighbours.add(linkData.target.id)
        }

        l.active = linkData.source.id === newHoveredId || linkData.target.id === newHoveredId
      }

      for (const n of nodeRenderData) {
        n.active = hoveredNeighbours.has(n.simulationData.id)
      }
    }
  }

  let dragStartTime = 0
  let dragging = false

  function renderLinks() {
    tweens.get("link")?.stop()
    const tweenGroup = new TweenGroup()

    for (const l of linkRenderData) {
      let alpha = 1

      // if we are hovering over a node, we want to highlight the immediate neighbours
      // with full alpha and the rest with default alpha
      if (hoveredNodeId) {
        alpha = l.active ? 1 : 0.2
      }

      l.color = l.active ? computedStyleMap["--gray"] : computedStyleMap["--lightgray"]
      tweenGroup.add(new Tweened<LinkRenderData>(l).to({ alpha }, 200))
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("link", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderLabels() {
    tweens.get("label")?.stop()
    const tweenGroup = new TweenGroup()

    const defaultScale = 1 / scale
    const activeScale = defaultScale * 1.1
    const focusedTagId = hoveredNodeId?.startsWith("tags/") ? hoveredNodeId : null
    for (const n of nodeRenderData) {
      const nodeId = n.simulationData.id

      if (hoveredNodeId === nodeId) {
        tweenGroup.add(
          new Tweened<Text>(n.label).to(
            {
              alpha: 1,
              scale: { x: activeScale, y: activeScale },
            },
            100,
          ),
        )
      } else {
        const isTagNode = nodeId.startsWith("tags/")
        const isConnectedToFocusedTag = focusedTagId !== null && n.active
        tweenGroup.add(
          new Tweened<Text>(n.label).to(
            {
              alpha: isConnectedToFocusedTag ? 0.15 : isTagNode ? 0 : labelOpacity,
              scale: { x: defaultScale, y: defaultScale },
            },
            100,
          ),
        )
      }
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("label", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderNodes() {
    tweens.get("hover")?.stop()

    const tweenGroup = new TweenGroup()
    for (const n of nodeRenderData) {
      let alpha = 1

      // if we are hovering over a node, we want to highlight the immediate neighbours
      if (hoveredNodeId !== null && focusOnHover) {
        alpha = n.active ? 1 : 0.2
      }

      tweenGroup.add(new Tweened<Graphics>(n.gfx, tweenGroup).to({ alpha }, 200))
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("hover", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderPixiFromD3() {
    renderNodes()
    renderLinks()
    renderLabels()
  }

  function activateNode(node: NodeData, pointerType?: string) {
    if (node.id.startsWith("tags/")) {
      if (pointerType === "touch" || pointerType === "pen") {
        pinnedTagNodeId = node.id
        updateHoverInfo(node.id)
        renderPixiFromD3()
      }
      return
    }

    const target = resolveRelative(fullSlug, node.id)
    window.spaNavigate(new URL(target, window.location.toString()))
  }

  function placeLabel(node: NodeRenderData, placedLabels: LabelBounds[]) {
    const { simulationData, label } = node
    if (simulationData.id.startsWith("tags/")) return

    const x = simulationData.x! + width / 2
    const y = simulationData.y! + height / 2
    const labelWidth = label.width
    const labelHeight = label.height
    const gap = labelHeight * 0.2

    const boundsFor = (below: boolean): LabelBounds => ({
      left: x - labelWidth / 2,
      right: x + labelWidth / 2,
      top: below ? y + gap : y - gap - labelHeight,
      bottom: below ? y + gap + labelHeight : y - gap,
    })

    const overlapScore = (bounds: LabelBounds) => {
      let score = 0
      for (const other of nodeRenderData) {
        if (other === node) continue
        const otherX = other.simulationData.x! + width / 2
        const otherY = other.simulationData.y! + height / 2
        const padding = nodeRadius(other.simulationData) + 2
        if (
          otherX + padding >= bounds.left &&
          otherX - padding <= bounds.right &&
          otherY + padding >= bounds.top &&
          otherY - padding <= bounds.bottom
        ) {
          score += 2
        }
      }

      for (const placed of placedLabels) {
        if (
          bounds.left < placed.right &&
          bounds.right > placed.left &&
          bounds.top < placed.bottom &&
          bounds.bottom > placed.top
        ) {
          score += 1
        }
      }
      return score
    }

    const above = boundsFor(false)
    const below = boundsFor(true)
    const useBelow = overlapScore(below) < overlapScore(above)
    label.anchor.set(0.5, useBelow ? -0.2 : 1.2)
    placedLabels.push(useBelow ? below : above)
  }

  tweens.forEach((tween) => tween.stop())
  tweens.clear()

  const app = new Application()
  await app.init({
    width,
    height,
    antialias: true,
    autoStart: false,
    autoDensity: true,
    backgroundAlpha: 0,
    preference: "webgpu",
    resolution: window.devicePixelRatio,
    eventMode: "static",
  })
  graph.appendChild(app.canvas)

  const stage = app.stage
  stage.interactive = false

  const labelsContainer = new Container<Text>({ zIndex: 3, isRenderGroup: true })
  const nodesContainer = new Container<Graphics>({ zIndex: 2, isRenderGroup: true })
  const linkContainer = new Container<Graphics>({ zIndex: 1, isRenderGroup: true })
  stage.addChild(nodesContainer, labelsContainer, linkContainer)

  for (const n of graphData.nodes) {
    const nodeId = n.id
    const isTagNode = nodeId.startsWith("tags/")

    const label = new Text({
      interactive: false,
      eventMode: "none",
      text: n.text,
      alpha: isTagNode ? 0 : labelOpacity,
      anchor: { x: 0.5, y: isTagNode ? -0.35 : 1.2 },
      style: {
        fontSize: fontSize * 15,
        fill: computedStyleMap["--dark"],
        fontFamily: computedStyleMap["--bodyFont"],
      },
      resolution: window.devicePixelRatio * 4,
    })
    label.scale.set(1 / scale)

    let oldLabelOpacity = isTagNode ? 0 : labelOpacity
    const gfx = new Graphics({
      interactive: true,
      label: nodeId,
      eventMode: "static",
      hitArea: new Circle(0, 0, nodeRadius(n)),
      cursor: "pointer",
    })
      .circle(0, 0, nodeRadius(n))
      .fill({ color: isTagNode ? computedStyleMap["--light"] : color(n) })
      .on("pointerover", (e) => {
        updateHoverInfo(e.target.label)
        oldLabelOpacity = label.alpha
        if (!dragging) {
          renderPixiFromD3()
        }
      })
      .on("pointerleave", () => {
        updateHoverInfo(pinnedTagNodeId)
        if (pinnedTagNodeId !== nodeId) {
          label.alpha = oldLabelOpacity
        }
        if (!dragging) {
          renderPixiFromD3()
        }
      })

    if (isTagNode) {
      gfx.stroke({ width: 2, color: computedStyleMap["--tertiary"] })
    }

    nodesContainer.addChild(gfx)
    labelsContainer.addChild(label)

    const nodeRenderDatum: NodeRenderData = {
      simulationData: n,
      gfx,
      label,
      color: color(n),
      alpha: 1,
      active: false,
    }

    nodeRenderData.push(nodeRenderDatum)
  }

  for (const l of graphData.links) {
    const gfx = new Graphics({ interactive: false, eventMode: "none" })
    linkContainer.addChild(gfx)

    const linkRenderDatum: LinkRenderData = {
      simulationData: l,
      gfx,
      color: computedStyleMap["--lightgray"],
      alpha: 1,
      active: false,
    }

    linkRenderData.push(linkRenderDatum)
  }

  let currentTransform = zoomIdentity
  const clearPinnedTagOnTouch = (event: PointerEvent) => {
    if ((event.pointerType !== "touch" && event.pointerType !== "pen") || !pinnedTagNodeId) {
      return
    }

    pinnedTagNodeId = null
    updateHoverInfo(null)
    renderPixiFromD3()
  }
  app.canvas.addEventListener("pointerdown", clearPinnedTagOnTouch)

  if (enableDrag) {
    select<HTMLCanvasElement, NodeData | undefined>(app.canvas).call(
      drag<HTMLCanvasElement, NodeData | undefined>()
        .container(() => app.canvas)
        .subject(() => graphData.nodes.find((n) => n.id === hoveredNodeId))
        .on("start", function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(1).restart()
          event.subject.fx = event.subject.x
          event.subject.fy = event.subject.y
          event.subject.__initialDragPos = {
            x: event.subject.x,
            y: event.subject.y,
            fx: event.subject.fx,
            fy: event.subject.fy,
          }
          dragStartTime = Date.now()
          dragging = true
        })
        .on("drag", function dragged(event) {
          const initPos = event.subject.__initialDragPos
          event.subject.fx = initPos.x + (event.x - initPos.x) / currentTransform.k
          event.subject.fy = initPos.y + (event.y - initPos.y) / currentTransform.k
        })
        .on("end", function dragended(event) {
          if (!event.active) simulation.alphaTarget(0)
          event.subject.fx = null
          event.subject.fy = null
          dragging = false

          // if the time between mousedown and mouseup is short, we consider it a click
          if (Date.now() - dragStartTime < 500) {
            const node = graphData.nodes.find((n) => n.id === event.subject.id) as NodeData
            activateNode(node, event.sourceEvent?.pointerType)
          }
        }),
    )
  } else {
    for (const node of nodeRenderData) {
      node.gfx.on("click", (event) => {
        activateNode(node.simulationData, event.pointerType)
      })
    }
  }

  if (enableZoom) {
    select<HTMLCanvasElement, NodeData>(app.canvas).call(
      zoom<HTMLCanvasElement, NodeData>()
        .filter((event) => {
          const defaultAllowed = (!event.ctrlKey || event.type === "wheel") && !event.button
          const pointerIsOverCanvas = event.type !== "wheel" || app.canvas.matches(":hover")
          return defaultAllowed && pointerIsOverCanvas
        })
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.25, 4])
        .on("zoom", ({ transform }) => {
          currentTransform = transform
          stage.scale.set(transform.k, transform.k)
          stage.position.set(transform.x, transform.y)

          // zoom adjusts opacity of labels too
          const scale = transform.k * opacityScale
          const zoomLabelOpacity = Math.max((scale - 1) / 3.75, 0)
          const activeNodes = nodeRenderData.filter((n) => n.active).flatMap((n) => n.label)

          for (const node of nodeRenderData) {
            if (!activeNodes.includes(node.label)) {
              const isTagNode = node.simulationData.id.startsWith("tags/")
              node.label.alpha = isTagNode ? 0 : Math.max(labelOpacity, zoomLabelOpacity)
            }
          }
        }),
    )
  }

  let stopAnimation = false
  function animate(time: number) {
    if (stopAnimation) return
    const placedLabels: LabelBounds[] = []
    for (const n of nodeRenderData) {
      const { x, y } = n.simulationData
      if (!x || !y) continue
      n.gfx.position.set(x + width / 2, y + height / 2)
      if (n.label) {
        placeLabel(n, placedLabels)
        n.label.position.set(x + width / 2, y + height / 2)
      }
    }

    for (const l of linkRenderData) {
      const linkData = l.simulationData
      l.gfx.clear()
      l.gfx.moveTo(linkData.source.x! + width / 2, linkData.source.y! + height / 2)
      l.gfx
        .lineTo(linkData.target.x! + width / 2, linkData.target.y! + height / 2)
        .stroke({ alpha: l.alpha, width: 1, color: l.color })
    }

    tweens.forEach((t) => t.update(time))
    app.renderer.render(stage)
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
  return () => {
    stopAnimation = true
    app.canvas.removeEventListener("pointerdown", clearPinnedTagOnTouch)
    app.destroy()
  }
}

async function mountGraph(graph: HTMLElement, fullSlug: FullSlug) {
  let cleanup = () => {}
  let isRendering = false
  let pendingRender = false
  let lastWidth = 0
  let lastHeight = 0

  const render = async (force = false) => {
    if (isRendering) {
      pendingRender = true
      return
    }

    const { width, height } = getGraphDimensions(graph)
    if (!force && width === lastWidth && height === lastHeight) {
      return
    }

    isRendering = true
    cleanup()

    try {
      cleanup = await renderGraph(graph, fullSlug)
      lastWidth = width
      lastHeight = height
    } finally {
      isRendering = false
      if (pendingRender) {
        pendingRender = false
        void render()
      }
    }
  }

  await render(true)

  const resizeObserver = new ResizeObserver(() => {
    void render()
  })

  resizeObserver.observe(graph)
  if (graph.parentElement) {
    resizeObserver.observe(graph.parentElement)
  }

  return () => {
    resizeObserver.disconnect()
    cleanup()
  }
}

let localGraphCleanups: (() => void)[] = []
let globalGraphCleanups: (() => void)[] = []

function cleanupLocalGraphs() {
  for (const cleanup of localGraphCleanups) {
    cleanup()
  }
  localGraphCleanups = []
}

function cleanupGlobalGraphs() {
  for (const cleanup of globalGraphCleanups) {
    cleanup()
  }
  globalGraphCleanups = []
}

document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
  const slug = e.detail.url
  addToVisited(simplifySlug(slug))

  async function renderLocalGraph() {
    cleanupLocalGraphs()
    const localGraphContainers = document.getElementsByClassName("graph-container")
    for (const container of localGraphContainers) {
      localGraphCleanups.push(await mountGraph(container as HTMLElement, slug))
    }
  }

  await renderLocalGraph()
  const handleThemeChange = () => {
    void renderLocalGraph()
  }

  document.addEventListener("themechange", handleThemeChange)
  window.addCleanup(() => {
    document.removeEventListener("themechange", handleThemeChange)
  })

  const containers = [...document.getElementsByClassName("global-graph-outer")] as HTMLElement[]
  const containerIcons = [...document.getElementsByClassName("global-graph-icon")] as HTMLElement[]
  let returnFocus: HTMLElement | null = null
  let hideGraphTimer: number | undefined

  function setTriggerExpanded(expanded: boolean) {
    for (const icon of containerIcons) {
      icon.setAttribute("aria-expanded", String(expanded))
    }
  }

  async function renderGlobalGraph() {
    window.clearTimeout(hideGraphTimer)
    cleanupGlobalGraphs()
    document.documentElement.classList.add("graph-modal-open")
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const slug = getFullSlug(window)
    for (const container of containers) {
      container.classList.add("active")
      const sidebar = container.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = "1"
      }

      const graphContainer = container.querySelector(".global-graph-container") as HTMLElement
      const closeButton = container.querySelector(".global-graph-close") as HTMLButtonElement | null
      closeButton?.focus()
      if (graphContainer) {
        globalGraphCleanups.push(await mountGraph(graphContainer, slug))
      }
    }
    setTriggerExpanded(true)
  }

  function hideGlobalGraph() {
    for (const container of containers) {
      container.classList.remove("active")
    }
    setTriggerExpanded(false)

    const exitDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 240
    window.clearTimeout(hideGraphTimer)
    hideGraphTimer = window.setTimeout(() => {
      cleanupGlobalGraphs()
      document.documentElement.classList.remove("graph-modal-open")
      for (const container of containers) {
        const sidebar = container.closest(".sidebar") as HTMLElement
        if (sidebar) {
          sidebar.style.zIndex = ""
        }
      }
      returnFocus?.focus()
      returnFocus = null
    }, exitDuration)
  }

  async function shortcutHandler(e: HTMLElementEventMap["keydown"]) {
    if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault()
      const anyGlobalGraphOpen = containers.some((container) =>
        container.classList.contains("active"),
      )
      anyGlobalGraphOpen ? hideGlobalGraph() : renderGlobalGraph()
    }
  }

  containers.forEach((container) => registerEscapeHandler(container, hideGlobalGraph))

  const closeButtons = document.getElementsByClassName("global-graph-close")
  Array.from(closeButtons).forEach((button) => {
    button.addEventListener("click", hideGlobalGraph)
    window.addCleanup(() => button.removeEventListener("click", hideGlobalGraph))
  })

  containerIcons.forEach((icon) => {
    icon.addEventListener("click", renderGlobalGraph)
    window.addCleanup(() => icon.removeEventListener("click", renderGlobalGraph))
  })

  document.addEventListener("keydown", shortcutHandler)
  window.addCleanup(() => {
    window.clearTimeout(hideGraphTimer)
    document.documentElement.classList.remove("graph-modal-open")
    document.removeEventListener("keydown", shortcutHandler)
    cleanupLocalGraphs()
    cleanupGlobalGraphs()
  })
})
