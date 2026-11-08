// Redraws the doodle as a field of monospace characters, after the ASCII ghost on
// ghostty.org: a dense `$` body with an `@` rim and soft `·~ox` edges, the whole
// figure floating and turning slowly, re-rasterized frame by frame like a filmed
// animation.

const EDGE_RAMP = " ·~ox=+*%"
const SKIN_RAMP = "  ··~~o"
const SCRAMBLE = "01<>/\\{}[]=+*#%$&"
const FRAME_MS = 1000 / 30
const LOOP_MS = 6000 // one turn of the figure and two bobs
const LOOP_FRAMES = 90 // distinct poses rasterized (and cached) per loop
const INTRO_MS = 2600
const SCRAMBLE_MS = 800 // how long each cell flickers before settling

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

  const draw = (now: number) => {
    if (!rctx || cols === 0) return
    const still = reduceMotion.matches
    const elapsed = still ? Infinity : now - start
    const t = still ? 0 : now / 1000
    const index = still ? 0 : Math.floor(((now - start) / LOOP_MS) * LOOP_FRAMES) % LOOP_FRAMES
    const { ink, inside } = poseAt(index)
    // A soft light that swings across the face as the figure turns.
    const light = Math.sin((index / LOOP_FRAMES) * Math.PI * 2)

    ctx.clearRect(0, 0, width, height)
    ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`
    ctx.textBaseline = "top"

    for (let i = 0; i < ink.length; i++) {
      const cover = ink[i] / 255
      const isInside = inside[i] === 1
      if (cover < 0.04 && !isInside) continue
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
        color = near > 0.35 ? colors.accent : colors.ink
        opacity = 0.55 + cover * 0.3
      } else {
        const shade =
          0.5 +
          0.3 * light * ((x - cols / 2) / (cols / 4)) +
          0.2 * Math.sin(x * 0.21 + y * 0.37 + t * 0.9)
        glyph = pick(SKIN_RAMP, Math.min(1, shade * 0.85 + near * 0.6))
        color = near > 0.2 ? colors.accent : colors.field
        opacity = 0.3 + near * 0.5
      }

      if (elapsed < reveal[i]) {
        if (elapsed < reveal[i] - SCRAMBLE_MS) continue
        glyph = SCRAMBLE[Math.floor((seeds[i] * 97 + now / 60) % SCRAMBLE.length)]
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
    // Hover is a mouse effect; ignore touch and pen so taps on phones leave the art alone.
    if (event.pointerType !== "mouse") return
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

  // Current conditions from Open-Meteo (free, no key), mapped from WMO weather codes to
  // the icons rendered in the markup. On failure the icon simply stays hidden.
  const weather = splash.querySelector<HTMLElement>("[data-splash-weather]")
  type Label = Record<string, string>
  const weatherKind = (code: number, isDay: boolean): [string, Label] => {
    if (code === 0)
      return [
        isDay ? "clear" : "clear-night",
        { en: "Clear", ja: "晴れ", zh: "晴", pt: "Céu limpo" },
      ]
    if (code <= 2)
      return [
        isDay ? "partly" : "partly-night",
        { en: "Partly cloudy", ja: "晴れ時々曇り", zh: "晴時多雲", pt: "Parcialmente nublado" },
      ]
    if (code === 3) return ["cloudy", { en: "Cloudy", ja: "曇り", zh: "陰天", pt: "Nublado" }]
    if (code === 45 || code === 48) return ["fog", { en: "Fog", ja: "霧", zh: "霧", pt: "Neblina" }]
    if (code >= 51 && code <= 57)
      return ["drizzle", { en: "Drizzle", ja: "霧雨", zh: "毛毛雨", pt: "Garoa" }]
    if ((code >= 71 && code <= 77) || code === 85 || code === 86)
      return ["snow", { en: "Snow", ja: "雪", zh: "下雪", pt: "Neve" }]
    if (code >= 95)
      return ["storm", { en: "Thunderstorm", ja: "雷雨", zh: "雷雨", pt: "Tempestade" }]
    return ["rain", { en: "Rain", ja: "雨", zh: "下雨", pt: "Chuva" }]
  }
  const updateWeather = async () => {
    if (!weather) return
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current=weather_code,is_day",
      )
      if (!res.ok) return
      const { current } = await res.json()
      const [icon, label] = weatherKind(current.weather_code, current.is_day === 1)
      weather.querySelectorAll<SVGElement>("[data-weather-icon]").forEach((svg) => {
        svg.toggleAttribute("hidden", svg.dataset.weatherIcon !== icon)
      })
      // data-l10n lets the language picker relabel it when the language changes.
      const lang = document.documentElement.getAttribute("data-lang") ?? "en"
      weather.dataset.l10n = JSON.stringify({ "aria-label": label, title: label })
      weather.setAttribute("aria-label", label[lang] ?? label.en)
      weather.title = label[lang] ?? label.en
      weather.hidden = false
    } catch {}
  }
  updateWeather()
  const weatherTimer = window.setInterval(updateWeather, 15 * 60_000)

  readColors()
  layout()
  start = performance.now()
  splash.classList.add("splash-ready")
  document.fonts?.ready.then(run)
  run()

  window.addCleanup(() => {
    cancelAnimationFrame(frame)
    window.clearInterval(clockTimer)
    window.clearInterval(weatherTimer)
    resizeObserver.disconnect()
    document.removeEventListener("themechange", onTheme)
    document.removeEventListener("visibilitychange", run)
    reduceMotion.removeEventListener("change", run)
    splash.removeEventListener("pointermove", onPointerMove)
    splash.removeEventListener("pointerleave", onPointerLeave)
  })
})
