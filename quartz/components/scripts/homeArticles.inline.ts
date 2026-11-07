// Keeps the graph sketch beside the Articles title gently alive so it reads as something to
// tap: nodes sway on layered waves, connected nodes sway together like they're on springs,
// and the graph eases away from the pointer on hover. Lines follow the nodes they connect.

const SWAY_X = 6
const SWAY_Y = 4
const POINTER_RADIUS = 34
const POINTER_PUSH = 10
const EDGE = 3

document.addEventListener("nav", () => {
  const svg = document.querySelector<SVGSVGElement>("[data-article-graph]")
  if (!svg) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const [, , width, height] = svg.getAttribute("viewBox")!.split(" ").map(Number)
  const circles = Array.from(svg.querySelectorAll<SVGCircleElement>("circle[data-node]"))
  const lines = Array.from(svg.querySelectorAll<SVGLineElement>("line[data-a]"))
  const ends = lines.map((line) => [Number(line.dataset.a), Number(line.dataset.b)] as const)

  const neighbours = circles.map(() => [] as number[])
  ends.forEach(([a, b]) => {
    neighbours[a].push(b)
    neighbours[b].push(a)
  })

  const nodes = circles.map((circle) => {
    const x = Number(circle.getAttribute("cx"))
    const y = Number(circle.getAttribute("cy"))
    // Two incommensurate waves per axis, so the sway never settles into an obvious loop.
    const wave = () => ({ speed: 0.7 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2 })
    return { x, y, wx: [wave(), wave()], wy: [wave(), wave()], push: { x: 0, y: 0 } }
  })
  const raw = nodes.map(() => ({ x: 0, y: 0 }))
  const position = nodes.map(({ x, y }) => ({ x, y }))
  let pointer: { x: number; y: number } | null = null
  let frame = 0

  const sway = (waves: { speed: number; phase: number }[], t: number) =>
    (Math.sin(t * waves[0].speed + waves[0].phase) +
      0.5 * Math.sin(t * waves[1].speed * 1.7 + waves[1].phase)) /
    1.5

  const draw = (now: number) => {
    const t = now / 1000
    nodes.forEach((node, i) => {
      raw[i].x = SWAY_X * sway(node.wx, t)
      raw[i].y = SWAY_Y * sway(node.wy, t)
    })

    nodes.forEach((node, i) => {
      // Blend each node's sway with its neighbours' so clusters move as one.
      const links = neighbours[i]
      let ox = raw[i].x
      let oy = raw[i].y
      if (links.length) {
        const avgX = links.reduce((sum, j) => sum + raw[j].x, 0) / links.length
        const avgY = links.reduce((sum, j) => sum + raw[j].y, 0) / links.length
        ox = 0.55 * ox + 0.45 * avgX
        oy = 0.55 * oy + 0.45 * avgY
      }

      // Ease toward a push away from the pointer, and back again when it leaves.
      let targetX = 0
      let targetY = 0
      if (pointer) {
        const dx = node.x - pointer.x
        const dy = node.y - pointer.y
        const distance = Math.hypot(dx, dy) || 1
        const strength = Math.max(0, 1 - distance / POINTER_RADIUS) * POINTER_PUSH
        targetX = (dx / distance) * strength
        targetY = (dy / distance) * strength
      }
      node.push.x += (targetX - node.push.x) * 0.12
      node.push.y += (targetY - node.push.y) * 0.12

      position[i].x = Math.min(width - EDGE, Math.max(EDGE, node.x + ox + node.push.x))
      position[i].y = Math.min(height - EDGE, Math.max(EDGE, node.y + oy + node.push.y))
      circles[i].setAttribute("cx", position[i].x.toFixed(2))
      circles[i].setAttribute("cy", position[i].y.toFixed(2))
    })

    lines.forEach((line, k) => {
      const a = position[ends[k][0]]
      const b = position[ends[k][1]]
      line.setAttribute("x1", a.x.toFixed(2))
      line.setAttribute("y1", a.y.toFixed(2))
      line.setAttribute("x2", b.x.toFixed(2))
      line.setAttribute("y2", b.y.toFixed(2))
    })
    frame = requestAnimationFrame(draw)
  }

  const run = () => {
    cancelAnimationFrame(frame)
    if (!reduceMotion.matches && !document.hidden) frame = requestAnimationFrame(draw)
  }

  const onPointerMove = (event: PointerEvent) => {
    const rect = svg.getBoundingClientRect()
    pointer = {
      x: ((event.clientX - rect.left) / rect.width) * width,
      y: ((event.clientY - rect.top) / rect.height) * height,
    }
  }
  const onPointerLeave = () => {
    pointer = null
  }

  svg.addEventListener("pointermove", onPointerMove)
  svg.addEventListener("pointerleave", onPointerLeave)
  document.addEventListener("visibilitychange", run)
  reduceMotion.addEventListener("change", run)
  run()

  window.addCleanup(() => {
    cancelAnimationFrame(frame)
    svg.removeEventListener("pointermove", onPointerMove)
    svg.removeEventListener("pointerleave", onPointerLeave)
    document.removeEventListener("visibilitychange", run)
    reduceMotion.removeEventListener("change", run)
  })
})
