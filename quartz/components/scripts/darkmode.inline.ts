const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const storedTheme = localStorage.getItem("theme")
const currentTheme: "light" | "dark" =
  storedTheme === "light" || storedTheme === "dark" ? storedTheme : userPref

// Safari paints the area around the page with theme-color. The tags in <head> follow the OS
// scheme, so point both at the site's chosen theme or the edges keep the old color until reload.
// SPA navigation swaps the <head> tags, so look them up on every call. iOS Safari can miss an
// edit to an existing tag's content (notably when the OS appearance flips), so swap in new tags.
const themeColorTags = () => document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
const themeColors = { light: "", dark: "" }
for (const tag of themeColorTags()) {
  if (tag.media.includes("light")) themeColors.light = tag.content
  if (tag.media.includes("dark")) themeColors.dark = tag.content
}

const applyTheme = (theme: "light" | "dark") => {
  document.documentElement.setAttribute("saved-theme", theme)
  document.documentElement.style.colorScheme = theme
  if (themeColors[theme]) {
    for (const tag of themeColorTags()) {
      if (tag.content === themeColors[theme]) continue
      const fresh = tag.cloneNode() as HTMLMetaElement
      fresh.content = themeColors[theme]
      tag.replaceWith(fresh)
    }
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
