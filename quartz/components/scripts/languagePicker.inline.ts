// Apply the saved preference before paint, but never replace it on English-only pages.
const siteLangs = ["en", "ja", "zh", "pt"]
const languageTags: Record<string, string> = {
  en: "en",
  ja: "ja",
  zh: "zh-Hant",
  pt: "pt-BR",
}
// The eyebrow above Articles follows the saved preference, while article content stays English.
const articleLanguageNotice: Record<string, string> = {
  en: "English Only",
  ja: "英語のみ",
  zh: "僅提供英文版",
  pt: "Apenas Inglês",
}

const preferredLang = () => {
  const stored = localStorage.getItem("lang")
  return stored && siteLangs.includes(stored) ? stored : "en"
}

// The only non-article pages are Home and About. Use the URL before <body> has parsed
// and the Quartz slug after SPA navigation (which doesn't reload the language script).
const isEnglishOnlyPage = () => {
  const slug = document.body?.dataset.slug
  if (slug) return slug !== "index" && slug !== "about"
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
    const label = englishOnly
      ? "English only — articles are available in English"
      : "Language / 言語 / 語言 / Idioma"
    trigger.setAttribute("aria-label", label)
    trigger.setAttribute("title", label)

  }

  // This is separate from data-lang: article content is English, but the small
  // availability label is shown in the language the visitor was using before.
  const notice = document.querySelector<HTMLElement>("[data-article-language-notice]")
  if (notice) {
    notice.textContent = articleLanguageNotice[preference] ?? articleLanguageNotice.en
    notice.lang = languageTags[preference] ?? "en"
  }

  // Attributes set with localizedAttrs (see components/localized.tsx).
  for (const el of document.querySelectorAll<HTMLElement>("[data-l10n]")) {
    const attrs: Record<string, Record<string, string>> = JSON.parse(el.dataset.l10n!)
    for (const [name, text] of Object.entries(attrs)) el.setAttribute(name, text[lang] ?? text.en)
  }
}

applyLang(preferredLang())

document.addEventListener("nav", () => {
  // Always derive the active language from the saved preference, not the previous page:
  // returning to Home/About restores Japanese, Chinese or Portuguese automatically.
  applyLang(preferredLang())

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
      if (enabled.length) enabled[((index % enabled.length) + enabled.length) % enabled.length].focus()
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
