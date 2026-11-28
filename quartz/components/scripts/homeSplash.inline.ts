// Redraws the doodle as a field of monospace characters, after the ASCII ghost on
// ghostty.org: a dense `$` body with an `@` rim and soft `·~ox` edges, the whole
// figure floating and turning slowly, re-rasterized frame by frame like a filmed
// animation.
//
// Clicking the art spins it up. Ghostty's own ghost has a hidden switch that jumps its
// playback from 30 to 240fps; here a click does the same (8× speed, easing back), and
// pokes the glyphs around the click: they shove outward and spring back like jelly.

const EDGE_RAMP = " ·~ox=+*%"
const SKIN_RAMP = "  ··~~o"
const SCRAMBLE = "01<>/\\{}[]=+*#%$&"
const FRAME_MS = 1000 / 30
const LOOP_MS = 6000 // one turn of the figure and two bobs
const LOOP_FRAMES = 90 // distinct poses rasterized (and cached) per loop
const INTRO_MS = 2600
const SCRAMBLE_MS = 800 // how long each cell flickers before settling
const SPIN_BOOST = 7 // extra speed at the peak of a click: 1 + 7 = 8×, Ghostty's 30 → 240fps
const SPIN_DECAY_MS = 450 // time constant of the ease back to normal speed
const POKE_RADIUS = 9 // reach of a poke, in rows (a Gaussian falloff, not a hard edge)
const POKE_PUSH = 2.2 // peak shove at the centre of a poke, in rows
const POKE_HZ = 3 // wobble frequency of the spring-back
const POKE_DECAY_MS = 260 // time constant of the wobble dying out
const POKE_LIFE_MS = 1400 // drop a poke once its wobble is invisible
const MAX_POKES = 4
// Phones report a devicePixelRatio of 3, which makes the canvas 9× the pixels of its CSS
// size. The glyphs are 5–8px halftone dots, so 2× is already sharp and cuts the fill
// work by more than half on those screens.
const MAX_DPR = 2

interface Poke {
  x: number // origin, in cells
  y: number
  born: number // performance.now() of the click
}

interface Pose {
  ink: Uint8Array // 0–255 coverage by the doodle's strokes
  inside: Uint8Array // 1 when enclosed by the face outline
}

const pick = (ramp: string, value: number) =>
  ramp[Math.max(0, Math.min(ramp.length - 1, Math.floor(value * ramp.length)))]

document.addEventListener("nav", () => {
  const splash = document.querySelector<HTMLElement>("[data-splash]")
  const canvas = splash?.querySelector<HTMLCanvasElement>("[data-splash-canvas]")
  const doodle = splash?.querySelector<SVGSVGElement>("[data-splash-doodle]")
  const ctx = canvas?.getContext("2d")
  if (!splash || !canvas || !doodle || !ctx) return

  // Keep the name and navigation hidden until their webfonts settle. Using
  // visibility (not display) still triggers font loading and preserves layout.
  // Reveal the fallback if font loading fails, or if Font Loading API is missing.
  const revealTypography = () => splash.classList.add("splash-typography-ready")
  if (document.fonts) {
    void document.fonts.ready.then(revealTypography, revealTypography)
  } else {
    revealTypography()
  }

  const [vbX, vbY, vbW, vbH] = doodle.getAttribute("viewBox")!.split(" ").map(Number)
  const paths = Array.from(doodle.querySelectorAll("path"), (p) => new Path2D(p.getAttribute("d")!))
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

  let width = 0
  let height = 0
  let cols = 0
  let rows = 0
  let cellW = 0
  let cellH = 0
  let fontSize = 0
  let poses = new Map<number, Pose>()
  let seeds = new Float32Array(0)
  let reveal = new Float32Array(0) // ms after start when each cell settles on its glyph
  let raster: HTMLCanvasElement | null = null
  let rctx: CanvasRenderingContext2D | null = null
  let colors = { ink: "", accent: "", field: "" }
  let warmTimer = 0
  let pokes: Poke[] = []
  // 1 for each cell that got a glyph in the last drawn frame. Clicks only count on these,
  // so the gaps between characters and the empty canvas around the figure stay inert.
  let drawn = new Uint8Array(0)
  // The pose is an accumulated phase (0–1 around the loop) rather than a function of the
  // clock, so the speed can change mid-turn without the figure jumping to another pose.
  let phase = 0
  let spin = 0 // 0 = normal speed, 1 = full click boost; decays toward 0
  let lastDraw = 0
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
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1)
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    width = rect.width
    height = rect.height

    // Small glyphs so the doodle reads as a halftone print rather than chunky text.
    fontSize = Math.max(5, Math.min(8, Math.min(width, height) / 95))
    cellW = fontSize * 0.62
    cellH = fontSize * 1.1
    cols = Math.floor(width / cellW)
    rows = Math.floor(height / cellH)

    raster = document.createElement("canvas")
    raster.width = cols * 4
    raster.height = rows * 4
    rctx = raster.getContext("2d", { willReadFrequently: true })
    poses = new Map()

    // The glyphs decode into place from the center outward, with some jitter.
    const cx = cols / 2
    const cy = rows / 2
    const maxDist = Math.hypot(cx, cy)
    seeds = new Float32Array(cols * rows)
    reveal = new Float32Array(cols * rows)
    drawn = new Uint8Array(cols * rows)
    for (let i = 0; i < seeds.length; i++) {
      seeds[i] = Math.random()
      const dist = Math.hypot(((i % cols) - cx) * 0.55, Math.floor(i / cols) - cy) / maxDist
      reveal[i] = (dist * 0.7 + seeds[i] * 0.3) * INTRO_MS
    }
  }

  // Rasterizes the doodle in one pose of the loop: bobbing, swaying, and narrowing as
  // it turns away, the way the ghost does across its frames.
  const rasterize = (phase: number): Pose => {
    const S = 4
    const turn = phase * Math.PI * 2
    const n = cols * rows
    const r = rctx!
    r.setTransform(1, 0, 0, 1, 0, 0)
    r.clearRect(0, 0, raster!.width, raster!.height)
    const scale = Math.min(width / vbW, height / vbH) * 0.86
    r.setTransform(S / cellW, 0, 0, S / cellH, 0, 0)
    r.translate(width / 2, height / 2 + Math.sin(turn * 2) * height * 0.018)
    r.rotate(Math.sin(turn) * 0.05)
    r.scale(scale * (0.9 + 0.1 * Math.cos(turn)), scale)
    r.translate(-vbX - vbW / 2, -vbY - vbH / 2)
    paths.forEach((path) => r.fill(path))
    const alpha = r.getImageData(0, 0, raster!.width, raster!.height).data

    const ink = new Uint8Array(n)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let sum = 0
        for (let sy = 0; sy < S; sy++) {
          for (let sx = 0; sx < S; sx++) {
            sum += alpha[((y * S + sy) * raster!.width + x * S + sx) * 4 + 3]
          }
        }
        ink[y * cols + x] = sum / (S * S)
      }
    }

    // Flood-fill the empty cells reachable from the border; whatever is left is inside the face.
    const outside = new Uint8Array(n)
    const queue: number[] = []
    const visit = (i: number) => {
      if (!outside[i] && ink[i] < 20) {
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
    const inside = new Uint8Array(n)
    for (let i = 0; i < n; i++) inside[i] = !outside[i] && ink[i] < 20 ? 1 : 0

    return { ink, inside }
  }

  const poseAt = (index: number) => {
    let pose = poses.get(index)
    if (!pose) {
      pose = rasterize(index / LOOP_FRAMES)
      poses.set(index, pose)
    }
    return pose
  }

  // Rasterizing a pose (fill + getImageData readback + flood fill) is the most expensive
  // step. Left lazy, a click's 8× spin needs a fresh pose almost every frame until the loop
  // has been seen once, which is what made early taps stutter on phones. Instead, fill the
  // cache in the background, one pose per idle slot, so the spin only ever reads it.
  // Older iOS Safari has no requestIdleCallback; a short timeout is a fine stand-in.
  const hasIdle = typeof window.requestIdleCallback === "function"
  const idle = (fn: () => void) =>
    hasIdle ? window.requestIdleCallback(fn, { timeout: 200 }) : window.setTimeout(fn, 32)
  const cancelIdle = (id: number) =>
    hasIdle ? window.cancelIdleCallback(id) : window.clearTimeout(id)
  const warmPoses = () => {
    cancelIdle(warmTimer)
    if (reduceMotion.matches || cols === 0) return
    let next = 0
    const step = () => {
      while (next < LOOP_FRAMES && poses.has(next)) next++
      if (next >= LOOP_FRAMES) return
      poseAt(next)
      warmTimer = idle(step)
    }
    warmTimer = idle(step)
  }

  const draw = (now: number) => {
    if (!rctx || cols === 0) return
    const still = reduceMotion.matches
    const elapsed = still ? Infinity : now - start
    const t = still ? 0 : now / 1000

    // Clamp the step so a frame after a long pause (hidden tab) doesn't lurch the figure.
    const dt = lastDraw ? Math.min(100, now - lastDraw) : 0
    lastDraw = now
    spin *= Math.exp(-dt / SPIN_DECAY_MS)
    if (spin < 0.001) spin = 0
    phase = (phase + (dt / LOOP_MS) * (1 + SPIN_BOOST * spin)) % 1
    let index = still ? 0 : Math.floor(phase * LOOP_FRAMES) % LOOP_FRAMES
    // While spun up, never stall a frame rasterizing: if the background warm-up hasn't
    // reached this pose yet, reuse the nearest earlier one. At 8× speed the swap is invisible.
    if (spin > 0 && !poses.has(index)) {
      for (let back = 1; back < LOOP_FRAMES; back++) {
        const candidate = (index - back + LOOP_FRAMES) % LOOP_FRAMES
        if (poses.has(candidate)) {
          index = candidate
          break
        }
      }
    }
    const { ink, inside } = poseAt(index)

    // Each live poke as a spring: `wave` swings outward, overshoots inward and settles;
    // `heat` is the plain fade, used to flash the shoved glyphs in the accent colour.
    pokes = pokes.filter((p) => now - p.born < POKE_LIFE_MS)
    const springs = pokes.map((p) => {
      const age = now - p.born
      const fade = Math.exp(-age / POKE_DECAY_MS)
      return {
        x: p.x * cellW,
        y: p.y * cellH,
        wave: Math.sin((age / 1000) * POKE_HZ * Math.PI * 2) * fade,
        heat: fade,
      }
    })
    const radius = POKE_RADIUS * cellH
    const push = POKE_PUSH * cellH
    // A soft light that swings across the face as the figure turns.
    const light = Math.sin((index / LOOP_FRAMES) * Math.PI * 2)

    // Beyond 3 radii the Gaussian falloff is under 0.0002, so those cells skip the maths.
    const reach = radius * 3

    // Canvas state changes aren't free, so only touch fillStyle/globalAlpha when they differ.
    let fill = ""
    let alpha = -1

    ctx.clearRect(0, 0, width, height)
    drawn.fill(0)
    ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`
    ctx.textBaseline = "top"

    for (let i = 0; i < ink.length; i++) {
      const cover = ink[i] / 255
      const isInside = inside[i] === 1
      if (cover < 0.04 && !isInside) continue
      const x = i % cols
      const y = Math.floor(i / cols)

      // Shove this glyph away from any nearby poke, in pixels.
      let offX = 0
      let offY = 0
      let heat = 0
      for (const s of springs) {
        const dx = x * cellW - s.x
        const dy = y * cellH - s.y
        if (dx > reach || dx < -reach || dy > reach || dy < -reach) continue
        const d = Math.hypot(dx, dy)
        if (d < 0.5) continue // the clicked glyph itself has no direction to move in
        const falloff = Math.exp(-((d / radius) ** 2))
        const amount = push * falloff * s.wave
        offX += (dx / d) * amount
        offY += (dy / d) * amount
        heat = Math.max(heat, falloff * s.heat)
      }

      let glyph: string
      let color: string
      let opacity: number

      if (cover >= 0.04) {
        if (cover >= 0.6) {
          // Solid body: `$` inside the strokes, `@` where they meet the paper.
          const rim =
            (x > 0 && ink[i - 1] < 90) ||
            (x < cols - 1 && ink[i + 1] < 90) ||
            (y > 0 && ink[i - cols] < 90) ||
            (y < rows - 1 && ink[i + cols] < 90)
          glyph = rim ? "@" : "$"
        } else {
          glyph = pick(EDGE_RAMP, cover / 0.6)
        }
        color = colors.ink
        opacity = 0.55 + cover * 0.3
      } else {
        const shade =
          0.5 +
          0.3 * light * ((x - cols / 2) / (cols / 4)) +
          0.2 * Math.sin(x * 0.21 + y * 0.37 + t * 0.9)
        glyph = pick(SKIN_RAMP, Math.min(1, shade * 0.85))
        color = colors.field
        opacity = 0.3
      }

      if (heat > 0.45) {
        color = colors.accent
        opacity = Math.max(opacity, 0.7)
      }

      if (elapsed < reveal[i]) {
        if (elapsed < reveal[i] - SCRAMBLE_MS) continue
        glyph = SCRAMBLE[Math.floor((seeds[i] * 97 + now / 60) % SCRAMBLE.length)]
        color = colors.accent
        opacity = 0.6
      }

      if (glyph === " ") continue
      drawn[i] = 1
      // Quantize opacity (to 5% steps) so neighbouring glyphs usually share one alpha.
      const a = Math.round(opacity * 20) / 20
      if (a !== alpha) ctx.globalAlpha = alpha = a
      if (color !== fill) ctx.fillStyle = fill = color
      ctx.fillText(glyph, x * cellW + offX, y * cellH + offY)
    }
    ctx.globalAlpha = 1
  }

  const loop = (now: number) => {
    frame = requestAnimationFrame(loop)
    // rAF timestamps jitter by a fraction of a millisecond, so a strict `< FRAME_MS` check
    // drops frames that arrive at 33.2ms: 60Hz screens stutter between 30 and 20fps, and
    // 30Hz ones (iOS Low Power Mode) fall toward 15fps. Allow a fifth of a frame of slack.
    if (now - lastFrame < FRAME_MS * 0.8) return
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
    warmPoses()
    run()
  }
  const onTheme = () => {
    readColors()
    run()
  }
  // The grid cell under the pointer, and whether a glyph is drawn there.
  const hit = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / cellW
    const y = (event.clientY - rect.top) / cellH
    const col = Math.floor(x)
    const row = Math.floor(y)
    const onGlyph =
      col >= 0 && col < cols && row >= 0 && row < rows && drawn[row * cols + col] === 1
    return { x, y, onGlyph }
  }

  const onClick = (event: MouseEvent) => {
    // The spin and poke are pure motion, so they stay off for reduced-motion users.
    if (reduceMotion.matches || cols === 0) return
    const { x, y, onGlyph } = hit(event)
    if (!onGlyph) return
    pokes = [...pokes, { x, y, born: performance.now() }].slice(-MAX_POKES)
    spin = 1
  }
  const onPointerMove = (event: PointerEvent) => {
    // Only the cursor changes on hover; the art itself reacts to clicks alone.
    const clickable = !reduceMotion.matches && cols > 0 && hit(event).onGlyph
    canvas.style.cursor = clickable ? "pointer" : ""
  }

  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(canvas)
  document.addEventListener("themechange", onTheme)
  document.addEventListener("visibilitychange", run)
  reduceMotion.addEventListener("change", run)
  canvas.addEventListener("click", onClick)
  canvas.addEventListener("pointermove", onPointerMove)

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

  if (document.fonts) {
    void document.fonts.ready.then(run, run)
  }
  run()
  warmPoses()

  window.addCleanup(() => {
    cancelAnimationFrame(frame)
    cancelIdle(warmTimer)
    window.clearInterval(clockTimer)
    resizeObserver.disconnect()
    document.removeEventListener("themechange", onTheme)
    document.removeEventListener("visibilitychange", run)
    reduceMotion.removeEventListener("change", run)
    canvas.removeEventListener("click", onClick)
    canvas.removeEventListener("pointermove", onPointerMove)
  })
})
