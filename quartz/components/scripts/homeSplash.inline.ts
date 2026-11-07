// Redraws the doodle as a field of monospace characters, in the spirit of the
// ASCII ghost on ghostty.org: the glyphs decode into place, a band of light
// sweeps across the ink, and the inside of the face ripples softly.

const INK_RAMP = " .:-=+*#%"
const FIELD_RAMP = "  ..··::--~"
const SCRAMBLE = "01<>/\\{}[]=+*#%$&"
const FRAME_MS = 1000 / 30
const INTRO_MS = 1400

interface Cell {
  ink: number // 0–1 coverage by the doodle's strokes
  inside: boolean // enclosed by the face outline
  reveal: number // ms after start when the cell settles on its final glyph
  seed: number
}

const pick = (ramp: string, value: number) =>
  ramp[Math.max(0, Math.min(ramp.length - 1, Math.floor(value * ramp.length)))]

document.addEventListener("nav", () => {
  const splash = document.querySelector<HTMLElement>("[data-splash]")
  const canvas = splash?.querySelector<HTMLCanvasElement>("[data-splash-canvas]")
  const doodle = splash?.querySelector<SVGSVGElement>("[data-splash-doodle]")
  const ctx = canvas?.getContext("2d")
  if (!splash || !canvas || !doodle || !ctx) return

  const [vbX, vbY, vbW, vbH] = doodle.getAttribute("viewBox")!.split(" ").map(Number)
  const paths = Array.from(doodle.querySelectorAll("path"), (p) => new Path2D(p.getAttribute("d")!))
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

  let cols = 0
  let rows = 0
  let cellW = 0
  let cellH = 0
  let fontSize = 0
  let cells: Cell[] = []
  let colors = { ink: "", accent: "", field: "" }
  let pointer: { x: number; y: number } | null = null
  let start = performance.now()
  let lastFrame = 0
  let frame = 0

  const readColors = () => {
    const style = getComputedStyle(document.documentElement)
    colors = {
      ink: style.getPropertyValue("--dark").trim(),
      accent: style.getPropertyValue("--secondary").trim(),
      field: style.getPropertyValue("--gray").trim(),
    }
  }

  const layout = () => {
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Small glyphs so the doodle reads as a halftone print rather than chunky text.
    fontSize = Math.max(5, Math.min(8, Math.min(rect.width, rect.height) / 95))
    cellW = fontSize * 0.62
    cellH = fontSize * 1.1
    cols = Math.floor(rect.width / cellW)
    rows = Math.floor(rect.height / cellH)

    // Rasterize the doodle at 4×4 samples per character cell.
    const S = 4
    const raster = document.createElement("canvas")
    raster.width = cols * S
    raster.height = rows * S
    const rctx = raster.getContext("2d", { willReadFrequently: true })!
    const scale = Math.min(rect.width / vbW, rect.height / vbH) * 0.9
    const offsetX = (rect.width - vbW * scale) / 2
    const offsetY = (rect.height - vbH * scale) / 2
    rctx.setTransform(S / cellW, 0, 0, S / cellH, 0, 0)
    rctx.translate(offsetX, offsetY)
    rctx.scale(scale, scale)
    rctx.translate(-vbX, -vbY)
    paths.forEach((path) => rctx.fill(path))
    const alpha = rctx.getImageData(0, 0, raster.width, raster.height).data

    const ink = new Float32Array(cols * rows)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let sum = 0
        for (let sy = 0; sy < S; sy++) {
          for (let sx = 0; sx < S; sx++) {
            sum += alpha[((y * S + sy) * raster.width + x * S + sx) * 4 + 3]
          }
        }
        ink[y * cols + x] = sum / (S * S * 255)
      }
    }

    // Flood-fill the empty cells reachable from the border; whatever is left is inside the face.
    const outside = new Uint8Array(cols * rows)
    const queue: number[] = []
    const visit = (i: number) => {
      if (!outside[i] && ink[i] < 0.08) {
        outside[i] = 1
        queue.push(i)
      }
    }
    for (let x = 0; x < cols; x++) {
      visit(x)
      visit((rows - 1) * cols + x)
    }
    for (let y = 0; y < rows; y++) {
      visit(y * cols)
      visit(y * cols + cols - 1)
    }
    while (queue.length) {
      const i = queue.pop()!
      const x = i % cols
      if (x > 0) visit(i - 1)
      if (x < cols - 1) visit(i + 1)
      if (i >= cols) visit(i - cols)
      if (i < (rows - 1) * cols) visit(i + cols)
    }

    const cx = cols / 2
    const cy = rows / 2
    const maxDist = Math.hypot(cx, cy)
    cells = Array.from(ink, (value, i) => {
      const x = i % cols
      const y = Math.floor(i / cols)
      const seed = Math.random()
      const dist = Math.hypot((x - cx) * 0.55, y - cy) / maxDist
      return {
        ink: value,
        inside: !outside[i] && value < 0.08,
        reveal: (dist * 0.7 + seed * 0.3) * INTRO_MS,
        seed,
      }
    })
  }

  const draw = (now: number) => {
    const elapsed = reduceMotion.matches ? Infinity : now - start
    const t = reduceMotion.matches ? 0 : now / 1000
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`
    ctx.textBaseline = "top"

    // A diagonal band of light that sweeps across the doodle every few seconds.
    const sweep = ((t / 4.5) % 1.6) - 0.3

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (cell.ink < 0.04 && !cell.inside) continue
      const x = i % cols
      const y = Math.floor(i / cols)

      let near = 0
      if (pointer) {
        const d = Math.hypot((x - pointer.x) * 0.55, y - pointer.y)
        near = Math.max(0, 1 - d / 12)
      }

      let glyph: string
      let color: string
      let opacity: number

      if (cell.ink >= 0.04) {
        const band = Math.max(0, 1 - Math.abs((x / cols + y / rows) / 2 - sweep) / 0.08)
        const lift = Math.max(band, near)
        glyph = pick(INK_RAMP, Math.min(1, cell.ink * 1.15 + lift * 0.45))
        color = lift > 0.35 ? colors.accent : colors.ink
        opacity = 0.45 + cell.ink * 0.3
      } else {
        const wave =
          0.5 +
          0.25 * Math.sin(x * 0.32 + y * 0.18 - t * 1.6) +
          0.25 * Math.sin(y * 0.41 - x * 0.12 + t * 1.1 + cell.seed)
        glyph = pick(FIELD_RAMP, Math.min(1, wave * 0.9 + near * 0.6))
        color = near > 0.2 ? colors.accent : colors.field
        opacity = 0.35 + near * 0.5
      }

      if (elapsed < cell.reveal) {
        if (elapsed < cell.reveal - 450) continue
        glyph = SCRAMBLE[Math.floor((cell.seed * 97 + now / 60) % SCRAMBLE.length)]
        color = colors.accent
        opacity = 0.6
      }

      if (glyph === " ") continue
      ctx.globalAlpha = opacity
      ctx.fillStyle = color
      ctx.fillText(glyph, x * cellW, y * cellH)
    }
    ctx.globalAlpha = 1
  }

  const loop = (now: number) => {
    frame = requestAnimationFrame(loop)
    if (now - lastFrame < FRAME_MS) return
    lastFrame = now
    draw(now)
  }

  const run = () => {
    cancelAnimationFrame(frame)
    if (reduceMotion.matches || document.hidden) {
      draw(performance.now())
    } else {
      frame = requestAnimationFrame(loop)
    }
  }

  const onResize = () => {
    layout()
    run()
  }
  const onTheme = () => {
    readColors()
    run()
  }
  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    pointer = { x: (event.clientX - rect.left) / cellW, y: (event.clientY - rect.top) / cellH }
  }
  const onPointerLeave = () => {
    pointer = null
  }

  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(canvas)
  document.addEventListener("themechange", onTheme)
  document.addEventListener("visibilitychange", run)
  reduceMotion.addEventListener("change", run)
  splash.addEventListener("pointermove", onPointerMove)
  splash.addEventListener("pointerleave", onPointerLeave)

  const clock = splash.querySelector<HTMLElement>("[data-splash-clock]")
  const tokyoTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
  })
  const tick = () => {
    if (clock) clock.textContent = `${tokyoTime.format(new Date())} JST`
  }
  tick()
  const clockTimer = window.setInterval(tick, 15_000)

  readColors()
  layout()
  start = performance.now()
  splash.classList.add("splash-ready")
  document.fonts?.ready.then(run)
  run()

  window.addCleanup(() => {
    cancelAnimationFrame(frame)
    window.clearInterval(clockTimer)
    resizeObserver.disconnect()
    document.removeEventListener("themechange", onTheme)
    document.removeEventListener("visibilitychange", run)
    reduceMotion.removeEventListener("change", run)
    splash.removeEventListener("pointermove", onPointerMove)
    splash.removeEventListener("pointerleave", onPointerLeave)
  })
})
