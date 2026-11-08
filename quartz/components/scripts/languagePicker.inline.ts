// Runs before the DOM loads so a saved language applies before first paint, like the theme.
const siteLangs = ["en", "ja", "zh", "pt"]
const storedLang = localStorage.getItem("lang")
const currentLang = storedLang && siteLangs.includes(storedLang) ? storedLang : "en"

const applyLang = (lang: string) => {
  document.documentElement.setAttribute("data-lang", lang)
  for (const option of document.querySelectorAll<HTMLElement>("[data-lang-option]")) {
    option.setAttribute("aria-checked", String(option.dataset.langOption === lang))
  }
}

applyLang(currentLang)

document.addEventListener("nav", () => {
  applyLang(document.documentElement.getAttribute("data-lang") ?? "en")

  for (const picker of document.querySelectorAll<HTMLElement>(".lang-picker")) {
    const trigger = picker.querySelector<HTMLButtonElement>(".lang-picker-trigger")!
    const options = [...picker.querySelectorAll<HTMLButtonElement>("[data-lang-option]")]

    const setOpen = (open: boolean) => {
      picker.toggleAttribute("data-open", open)
      trigger.setAttribute("aria-expanded", String(open))
    }

    const focusOption = (index: number) => {
      options[(index + options.length) % options.length].focus()
    }

    // `detail` is 0 for keyboard-activated clicks; only then does focus move into the menu,
    // so a mouse or touch user never ends up with a focus ring left on the control.
    const onTriggerClick = (e: MouseEvent) => {
      const open = !picker.hasAttribute("data-open")
      setOpen(open)
      if (open && e.detail === 0) {
        const checked = options.findIndex((o) => o.getAttribute("aria-checked") === "true")
        focusOption(Math.max(checked, 0))
      }
    }

    const onOptionClick = (e: MouseEvent) => {
      const lang = (e.currentTarget as HTMLElement).dataset.langOption!
      applyLang(lang)
      localStorage.setItem("lang", lang)
      setOpen(false)
      if (e.detail === 0) {
        trigger.focus()
      } else {
        trigger.blur()
      }
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (!picker.hasAttribute("data-open")) return
      const index = options.indexOf(document.activeElement as HTMLButtonElement)
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
