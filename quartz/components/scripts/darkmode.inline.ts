const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const storedTheme = localStorage.getItem("theme")
const currentTheme: "light" | "dark" =
  storedTheme === "light" || storedTheme === "dark" ? storedTheme : userPref

// iOS Safari owns its browser chrome; it cannot be made genuinely transparent by a web page.
// Match the chrome to the page canvas so the floating glass pill remains visually separate.
// Keep a single meta tag (without OS media queries) synchronized with the in-site toggle.
// Quartz SPA navigation can replace <head>, so query the tag on every application.
const themeColors = { light: "#faf8f8", dark: "#161618" }

const applyTheme = (theme: "light" | "dark") => {
  document.documentElement.setAttribute("saved-theme", theme)
  document.documentElement.style.colorScheme = theme
  const color = themeColors[theme]
  document.documentElement.style.backgroundColor = color
  document.body.style.backgroundColor = color

  const tags = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
  for (const tag of tags) {
    const fresh = document.createElement("meta")
    fresh.name = "theme-color"
    fresh.content = color
    tag.replaceWith(fresh)
  }
  if (tags.length === 0) {
    const tag = document.createElement("meta")
    tag.name = "theme-color"
    tag.content = color
    document.head.appendChild(tag)
  }
}

applyTheme(currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  applyTheme(document.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light")

  const switchTheme = () => {
    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    applyTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const themeChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? "dark" : "light"
    applyTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    darkmodeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", switchTheme))
  }

  // Listen for changes in prefers-color-scheme
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
})
