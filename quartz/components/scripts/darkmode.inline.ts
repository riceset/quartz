const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const storedTheme = localStorage.getItem("theme")
const currentTheme: "light" | "dark" =
  storedTheme === "light" || storedTheme === "dark" ? storedTheme : userPref

// Preserve the active theme's metadata and document color scheme.
// Safari 26+ primarily determines toolbar appearance from rendered page surfaces.
const themeColors = { light: "#faf8f8", dark: "#161618" }

const applyTheme = (theme: "light" | "dark") => {
  document.documentElement.setAttribute("saved-theme", theme)
  document.documentElement.style.colorScheme = theme

  // Quartz SPA navigation can replace <head>, so always resolve the current tag.
  const tag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (tag) tag.content = themeColors[theme]
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
    // A manual selection takes priority; follow the OS only without an override.
    if (localStorage.getItem("theme") === "light" || localStorage.getItem("theme") === "dark") return
    const newTheme = e.matches ? "dark" : "light"
    applyTheme(newTheme)
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
