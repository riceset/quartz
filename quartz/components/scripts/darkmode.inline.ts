const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const storedTheme = localStorage.getItem("theme")
const currentTheme: "light" | "dark" =
  storedTheme === "light" || storedTheme === "dark" ? storedTheme : userPref

// Safari's surrounding UI is controlled by the browser, not transparent page CSS.
// Keep its tint aligned with the actual page background, including manual theme changes.
// This script runs before DOM ready: only touch <head> and <html>, never document.body.
const themeColors = { light: "#faf8f8", dark: "#161618" }

const applyTheme = (theme: "light" | "dark") => {
  document.documentElement.setAttribute("saved-theme", theme)
  document.documentElement.style.colorScheme = theme

  // Replace OS-specific theme-color tags with one authoritative tag.
  // Re-query after Quartz SPA navigation, which can replace the page head.
  const tags = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')]
  const primary = tags[0]
  if (primary) {
    primary.removeAttribute("media")
    primary.content = themeColors[theme]
    for (const duplicate of tags.slice(1)) duplicate.remove()
  } else {
    const tag = document.createElement("meta")
    tag.name = "theme-color"
    tag.content = themeColors[theme]
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
