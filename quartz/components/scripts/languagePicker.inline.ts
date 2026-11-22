// Apply the saved preference before paint, but never replace it on English-only pages.
const siteLangs = ["en", "ja", "zh", "pt"]
const languageTags: Record<string, string> = {
  en: "en",
  ja: "ja",
  zh: "zh-Hant",
  pt: "pt-BR",
}
const preferredLang = () => {
  const stored = localStorage.getItem("lang")
  return stored && siteLangs.includes(stored) ? stored : "en"
}

// The only translated pages are Home and About. Use the URL before <body> has parsed
// and the Quartz slug after SPA navigation (which doesn't reload the language script).
const isEnglishOnlyPage = () => {
  const slug = document.body?.dataset.slug
  if (slug) return !["index", "about"].includes(slug)
  const path = window.location.pathname.replace(/\/+$/, "") || "/"
  return !["/", "/index", "/index.html", "/about", "/about/index.html"].includes(path)
}

const applyLang = (preference: string) => {
  const englishOnly = isEnglishOnlyPage()
  const lang = englishOnly ? "en" : preference

  document.documentElement.setAttribute("data-lang", lang)
  document.documentElement.setAttribute("data-english-only", String(englishOnly))
  document.documentElement.lang = languageTags[lang] ?? "en"

  for (const option of document.querySelectorAll<HTMLButtonElement>("[data-lang-option]")) {
    const isDisabled = englishOnly && option.dataset.langOption !== "en"
    option.disabled = isDisabled
    option.setAttribute("aria-disabled", String(isDisabled))
    option.setAttribute("aria-checked", String(option.dataset.langOption === lang))
  }

  for (const picker of document.querySelectorAll<HTMLElement>(".lang-picker")) {
    const trigger = picker.querySelector<HTMLButtonElement>(".lang-picker-trigger")
    if (!trigger) continue
    const label = "Language / 言語 / 語言 / Idioma"
    trigger.setAttribute("aria-label", label)
    trigger.setAttribute("title", label)
  }

  // Attributes set with localizedAttrs (see components/localized.tsx).
  for (const el of document.querySelectorAll<HTMLElement>("[data-l10n]")) {
    const attrs: Record<string, Record<string, string>> = JSON.parse(el.dataset.l10n!)
    for (const [name, text] of Object.entries(attrs)) el.setAttribute(name, text[lang] ?? text.en)
  }
}

applyLang(preferredLang())

// Browsers fetch a webfont (and each unicode-range slice of the CJK fonts) only once
// visible text needs it, so switching language used to wait on downloads. Once idle,
// load exactly the faces and characters the hidden translations on this page use.
const warmTranslationFonts = () => {
  if (!document.fonts) return
  const textByFont = new Map<string, Set<string>>()
  for (const root of document.querySelectorAll<HTMLElement>("[data-text-lang]")) {
    if (root.getClientRects().length > 0) continue
    for (const el of [root, ...root.querySelectorAll<HTMLElement>("*")]) {
      let text = ""
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) text += node.textContent
      }
      if (!text.trim()) continue
      const style = getComputedStyle(el)
      const font = `${style.fontStyle} ${style.fontWeight} 16px ${style.fontFamily}`
      const chars = textByFont.get(font) ?? new Set<string>()
      for (const char of text) chars.add(char)
      textByFont.set(font, chars)
    }
  }
  for (const [font, chars] of textByFont) {
    void document.fonts.load(font, [...chars].join("")).catch(() => {})
  }
}

const whenIdle = (fn: () => void) =>
  "requestIdleCallback" in window
    ? requestIdleCallback(fn, { timeout: 3000 })
    : setTimeout(fn, 1500)

// Switching language morphs each heading and paragraph in place: a view transition keeps
// the old and new copy layered in the same spot, blur-crossfades them, and animates each
// box to its new size so surrounding content glides instead of jumping (languagePicker.scss).
// Only blocks on screen get a transition name; everything else just swaps.
let langTransition: ViewTransition | null = null
let namedForTransition: HTMLElement[] = []

const clearTransitionNames = () => {
  for (const el of namedForTransition) {
    el.style.removeProperty("view-transition-name")
    el.style.removeProperty("view-transition-class")
    el.style.removeProperty("transition")
  }
  glassStyle?.remove()
  glassStyle = null
  namedForTransition = []
}

// Finish any switch in flight, so a second click or a navigation starts from a clean page.
const settleLangSwitch = () => {
  // A switch still waiting for the menu to close applies at once.
  if (pendingSwitch) {
    clearTimeout(pendingSwitch.timer)
    applyLang(pendingSwitch.to)
    pendingSwitch = null
  }
  langTransition?.skipTransition()
  langTransition = null
  clearTransitionNames()
  stopReels?.()
}

// The nearest block-level ancestor: view transitions skip elements broken across lines,
// so a multi-line inline span can't be named itself.
const blockOf = (el: HTMLElement) => {
  let node: HTMLElement | null = el
  while (node && getComputedStyle(node).display.startsWith("inline")) node = node.parentElement
  return node
}

const onScreen = (el: Element) => {
  const rect = el.getBoundingClientRect()
  return el.getClientRects().length > 0 && rect.bottom > 0 && rect.top < innerHeight
}

// Untranslated content (text, images) that a language would push to a new spot. Naming
// content that stays put makes it flash, because a snapshot draws text slightly differently
// from the page; so only movers glide. Measuring needs a layout in the new language, which
// is too slow to do on tap (it froze phones), so it runs in idle time while the menu is
// open. A language tapped before it's measured skips the glide for that content.
let movesByLang: Record<string, HTMLElement[]> = {}

const soon = (fn: () => void) =>
  "requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 300 }) : setTimeout(fn, 50)

const measureMoves = () => {
  movesByLang = {}
  const root = document.documentElement
  const from = root.dataset.lang ?? "en"
  soon(() => {
    // Group untranslated content as the largest piece holding no translated copy, so
    // decorations without text (like the signature's stroke) travel with their neighbors.
    const holdsTranslation = (el: HTMLElement) => !!el.querySelector("[data-text-lang]")
    const groups = new Set<HTMLElement>()
    const add = (el: Element | null) => {
      if (!(el instanceof HTMLElement) || el.closest(".lang-picker-menu, [data-text-lang]")) return
      let node = blockOf(el)
      if (!node || holdsTranslation(node)) return
      while (
        node.parentElement &&
        node.parentElement !== document.body &&
        !holdsTranslation(node.parentElement)
      ) {
        node = node.parentElement
      }
      groups.add(node)
    }
    const texts = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    while (texts.nextNode()) {
      if (texts.currentNode.textContent?.trim()) add(texts.currentNode.parentElement)
    }
    for (const media of document.querySelectorAll("img, svg")) add(media)
    const candidates = [...groups].filter(
      (el) => ![...groups].some((other) => other !== el && other.contains(el)),
    )

    // One language per idle slot. Flip only data-lang (the rest of applyLang restyles the
    // whole page) and flip it back in the same task, so nothing paints in between.
    for (const lang of siteLangs) {
      if (lang === from) continue
      soon(() => {
        if (root.dataset.lang !== from || langTransition) return
        const before = candidates.map((el) => el.getBoundingClientRect())
        root.dataset.lang = lang
        movesByLang[lang] = candidates.filter((el, i) => {
          const a = before[i]
          const b = el.getBoundingClientRect()
          return [a.x - b.x, a.y - b.y, a.width - b.width, a.height - b.height].some(
            (d) => Math.abs(d) > 0.5,
          )
        })
        root.dataset.lang = from
      })
    }
  })
}

// Frosted-glass elements (the rail, the mobile bar). A view transition draws the page as a
// flat snapshot, where backdrop-filter has nothing live behind it to blur, so glass turned
// see-through. Instead, each visible glass element gets its own layer, and that layer's
// pseudo-element carries the element's backdrop-filter and corners (a temporary <style>),
// so it blurs the live, animating transition underneath. Found once per page in idle time.
let glassElements: { el: HTMLElement; pseudo: "" | "::before" }[] | null = null
let glassStyle: HTMLStyleElement | null = null

// The rail and mobile bar keep their glass on ::before (see custom.scss), so check it too.
const findGlass = () => {
  glassElements = []
  for (const el of document.querySelectorAll<HTMLElement>("body *")) {
    for (const pseudo of ["", "::before"] as const) {
      if (getComputedStyle(el, pseudo || null).backdropFilter !== "none") {
        glassElements.push({ el, pseudo })
      }
    }
  }
}

const nameGlass = () => {
  if (!glassElements) findGlass()
  const named: HTMLElement[] = []
  let css = ""
  for (const { el, pseudo } of glassElements!) {
    // The menu is already closed and hidden by now.
    if (!el.isConnected || el.closest(".lang-picker-menu") || !onScreen(el)) continue
    const style = getComputedStyle(el, pseudo || null)
    const name = `lang-glass-${named.length}`
    el.style.setProperty("view-transition-name", name)
    el.style.setProperty("view-transition-class", "lang-glass")
    css += `::view-transition-group(${name}){backdrop-filter:${style.backdropFilter};border-radius:${style.borderRadius}}`
    named.push(el)
  }
  glassStyle?.remove()
  glassStyle = document.createElement("style")
  glassStyle.textContent = css
  document.head.append(glassStyle)
  return named
}

// The picker's label scrolls like a slot reel through every language between the old and
// the new one, in menu order (EN, PT, JA, ZH): forward scrolls down, backward scrolls up.
// A strip of codes is laid over the label for the ride, then removed.
let stopReels: (() => void) | null = null

const rollLabels = (from: string, to: string) => {
  stopReels?.()
  const cleanups: (() => void)[] = []
  for (const trigger of document.querySelectorAll<HTMLElement>(".lang-picker-trigger")) {
    const picker = trigger.closest(".lang-picker")
    const order = [...(picker?.querySelectorAll<HTMLElement>("[data-lang-option]") ?? [])].map(
      (option) => option.dataset.langOption!,
    )
    const [a, b] = [order.indexOf(from), order.indexOf(to)]
    if (a < 0 || b < 0 || !onScreen(trigger)) continue
    const steps = Math.abs(b - a)
    const codes = order
      .slice(Math.min(a, b), Math.max(a, b) + 1)
      .map((lang) => trigger.querySelector(`[data-text-lang="${lang}"]`)?.textContent ?? "")

    const reel = document.createElement("span")
    reel.className = "lang-reel"
    reel.setAttribute("aria-hidden", "true")
    const strip = document.createElement("span")
    strip.className = "lang-reel-strip"
    for (const code of codes)
      strip.append(Object.assign(document.createElement("span"), { textContent: code }))
    reel.append(strip)
    trigger.append(reel)
    trigger.classList.add("lang-reeling")

    // Each code is one button-height tall; forward starts at the top, backward at the bottom.
    const end = `translateY(${-100 * steps}%)`
    const [first, last] = a < b ? ["none", end] : [end, "none"]
    const ride = strip.animate(
      [
        { transform: first, filter: "blur(0)" },
        { filter: `blur(${steps > 1 ? 1.5 : 1}px)`, offset: 0.4 },
        { transform: last, filter: "blur(0)" },
      ],
      // Hold the last code until cleanup removes the strip, so the first never flashes back.
      { duration: 760 + 160 * steps, easing: langReelEasing, fill: "forwards" },
    )
    const cleanup = () => {
      ride.cancel()
      reel.remove()
      trigger.classList.remove("lang-reeling")
    }
    ride.finished.then(cleanup, () => {})
    cleanups.push(cleanup)
  }
  stopReels = () => {
    for (const cleanup of cleanups) cleanup()
    stopReels = null
  }
}

// SwiftUI's default spring, the same curve as $lang-spring in languagePicker.scss.
const langReelEasing = CSS.supports("animation-timing-function", "linear(0, 1)")
  ? "linear(0, 0.018, 0.066, 0.132, 0.21, 0.293, 0.377, 0.459, 0.537, 0.608, 0.673, 0.731, " +
    "0.782, 0.825, 0.863, 0.895, 0.921, 0.942, 0.96, 0.974, 0.985, 0.993, 0.999, 1.004, " +
    "1.007, 1.009, 1.01, 1.01, 1.01, 1.01, 1.009, 1.008, 1.008, 1.007, 1.006, 1.005, 1.004, " +
    "1.004, 1.003, 1.002, 1)"
  : "cubic-bezier(0.2, 0.9, 0.3, 1)"

// How long the menu takes to close (its transform transition in languagePicker.scss).
const menuCloseMs = 200
let pendingSwitch: { to: string; timer: ReturnType<typeof setTimeout> } | null = null

const switchLang = (to: string) => {
  settleLangSwitch()
  if ((document.documentElement.dataset.lang ?? "en") === to) return
  // Let the open menu close with its usual fade first, then morph the page. The menu is
  // fully gone before the "before" snapshot, so its frosted glass never lands in a snapshot
  // (where backdrop-filter has nothing to blur and smears).
  const openPickers = document.querySelectorAll<HTMLElement>(".lang-picker[data-open]")
  if (!openPickers.length || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return morphLang(to)
  }
  for (const picker of openPickers) picker.removeAttribute("data-open")
  pendingSwitch = {
    to,
    timer: setTimeout(() => {
      pendingSwitch = null
      morphLang(to)
    }, menuCloseMs),
  }
}

const morphLang = (to: string) => {
  const root = document.documentElement
  const from = root.dataset.lang ?? "en"
  if (from === to) return
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return applyLang(to)
  if (!document.startViewTransition) {
    applyLang(to)
    return rollLabels(from, to)
  }

  // Translated blocks on screen morph; measured movers glide. Nested names are fine: each
  // animates on its own.
  const morphing = new Set<HTMLElement>()
  for (const span of document.querySelectorAll<HTMLElement>(`[data-text-lang="${from}"]`)) {
    // The picker's own label runs its reel instead (see rollLabels).
    if (span.closest(".lang-picker-menu, .lang-picker-trigger") || !onScreen(span)) continue
    // Skip copy that reads the same in both languages (the name is "Thiago Komeno" in
    // English and Portuguese): there's nothing to morph, and naming it makes it flash.
    const next = span.parentElement?.querySelector<HTMLElement>(`:scope > [data-text-lang="${to}"]`)
    if (next?.textContent === span.textContent) continue
    const block = blockOf(span)
    if (block) morphing.add(block)
  }
  const moved = (movesByLang[to] ?? []).filter((el) => el.isConnected && onScreen(el))
  movesByLang = {}

  const named = [...morphing, ...moved]
  named.forEach((el, i) => {
    el.style.setProperty("view-transition-name", `lang-morph-${i}`)
    el.style.setProperty("view-transition-class", morphing.has(el) ? "lang-text" : "lang-move")
  })
  namedForTransition = named

  // Swap synchronously. Waiting here (it once held for fonts) leaves a gap after the
  // "before" snapshot where the bar's live-blur layer doesn't exist yet, so its glass
  // dropped out at the tap. The fonts are fetched when the menu opens instead.
  const transition = document.startViewTransition(() => {
    applyLang(to)
    // A skipped switch still runs this callback; naming anything then would leave names
    // nothing cleans up (glass would stay see-through).
    if (langTransition !== transition) return
    rollLabels(from, to)
    // Glass gets its own layer, raised above the text (languagePicker.scss) and given a live
    // blur, so morphing text passes under the bar instead of drawing over it. Named only
    // here, in the "after" state: a named element can't blur what's behind it, so naming
    // the bar before the "before" snapshot left it see-through for the frames until the
    // animation began (caught in a screen recording). Its "before" copy is hidden anyway.
    namedForTransition.push(...nameGlass())
  })
  langTransition = transition
  transition.finished.finally(() => {
    if (langTransition !== transition) return
    langTransition = null
    clearTransitionNames()
  })
}

document.addEventListener("nav", () => {
  settleLangSwitch()
  // Always derive the active language from the saved preference, not the previous page:
  // returning to Home/About restores Japanese, Chinese or Portuguese automatically.
  applyLang(preferredLang())
  whenIdle(warmTranslationFonts)
  glassElements = null
  whenIdle(findGlass)

  for (const picker of document.querySelectorAll<HTMLElement>(".lang-picker")) {
    const trigger = picker.querySelector<HTMLButtonElement>(".lang-picker-trigger")!
    const options = [...picker.querySelectorAll<HTMLButtonElement>("[data-lang-option]")]
    const enabledOptions = () => options.filter((option) => !option.disabled)

    const setOpen = (open: boolean) => {
      picker.toggleAttribute("data-open", open)
      trigger.setAttribute("aria-expanded", String(open))
    }

    const focusOption = (index: number) => {
      const enabled = enabledOptions()
      if (enabled.length)
        enabled[((index % enabled.length) + enabled.length) % enabled.length].focus()
    }

    // detail is 0 for keyboard activation; leave pointer users without a focus ring.
    let fontsWarmed = false
    const onTriggerClick = (e: MouseEvent) => {
      const open = !picker.hasAttribute("data-open")
      setOpen(open)
      // Fetch the translations' fonts while the user is still choosing (once per page).
      // Work out which content each language moves while the user is still choosing.
      if (open) measureMoves()
      if (open && !fontsWarmed) {
        fontsWarmed = true
        warmTranslationFonts()
      }
      if (open && e.detail === 0) {
        const enabled = enabledOptions()
        const checked = enabled.findIndex((o) => o.getAttribute("aria-checked") === "true")
        focusOption(Math.max(checked, 0))
      }
    }

    const onOptionClick = (e: MouseEvent) => {
      const option = e.currentTarget as HTMLButtonElement
      if (option.disabled) return

      // Clicking EN on an article closes the menu without overwriting the
      // user's actual preference; it will be restored on Home and About.
      if (!isEnglishOnlyPage()) {
        const lang = option.dataset.langOption!
        localStorage.setItem("lang", lang)
        switchLang(lang)
      }
      setOpen(false)
      if (e.detail === 0) {
        trigger.focus()
      } else {
        trigger.blur()
      }
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (!picker.hasAttribute("data-open")) return
      const enabled = enabledOptions()
      const index = enabled.indexOf(document.activeElement as HTMLButtonElement)
      if (e.key === "Escape") {
        setOpen(false)
        trigger.focus()
      } else if (e.key === "ArrowDown") {
        focusOption(index + 1)
      } else if (e.key === "ArrowUp") {
        focusOption(index < 0 ? -1 : index - 1)
      } else if (e.key === "Home") {
        focusOption(0)
      } else if (e.key === "End") {
        focusOption(-1)
      } else {
        if (e.key === "Tab") setOpen(false)
        return
      }
      e.preventDefault()
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!picker.contains(e.target as Node)) setOpen(false)
    }

    trigger.addEventListener("click", onTriggerClick)
    picker.addEventListener("keydown", onKeydown)
    document.addEventListener("pointerdown", onPointerDown)
    for (const option of options) option.addEventListener("click", onOptionClick)

    window.addCleanup(() => {
      trigger.removeEventListener("click", onTriggerClick)
      picker.removeEventListener("keydown", onKeydown)
      document.removeEventListener("pointerdown", onPointerDown)
      for (const option of options) option.removeEventListener("click", onOptionClick)
    })
  }
})
