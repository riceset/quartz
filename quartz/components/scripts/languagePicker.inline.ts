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

// The only translated pages are Home, About, and Toolkit. Use the URL before <body> has parsed
// and the Quartz slug after SPA navigation (which doesn't reload the language script).
const isEnglishOnlyPage = () => {
  const slug = document.body?.dataset.slug
  if (slug) return !["index", "about", "toolkit"].includes(slug)
  const path = window.location.pathname.replace(/\/+$/, "") || "/"
  return ![
    "/",
    "/index",
    "/index.html",
    "/about",
    "/about/index.html",
    "/toolkit",
    "/toolkit/index.html",
  ].includes(path)
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

document.addEventListener("nav", () => {
  // Always derive the active language from the saved preference, not the previous page:
  // returning to Home/About restores Japanese, Chinese or Portuguese automatically.
  applyLang(preferredLang())
  whenIdle(warmTranslationFonts)

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
    const onTriggerClick = (e: MouseEvent) => {
      const open = !picker.hasAttribute("data-open")
      setOpen(open)
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
        applyLang(lang)
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
