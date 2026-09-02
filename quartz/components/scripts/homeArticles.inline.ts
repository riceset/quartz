const ARTICLE_PAGE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)"

document.addEventListener("nav", () => {
  document.querySelectorAll<HTMLElement>("[data-article-pagination]").forEach((section) => {
    const pages = Array.from(section.querySelectorAll<HTMLElement>("[data-article-page]"))
    const previousButton = section.querySelector<HTMLButtonElement>("[data-article-previous]")
    const nextButton = section.querySelector<HTMLButtonElement>("[data-article-next]")
    const status = section.querySelector<HTMLElement>("[data-article-page-status]")
    const currentLabel = section.querySelector<HTMLElement>("[data-article-page-current]")

    if (pages.length < 2 || !previousButton || !nextButton || !status || !currentLabel) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const activeAnimations = new Set<Animation>()
    let currentPage = 0
    let isTransitioning = false
    let disposed = false

    const updateControls = () => {
      const displayedPage = currentPage + 1
      currentLabel.textContent = displayedPage.toString()
      status.setAttribute("aria-label", `Page ${displayedPage} of ${pages.length}`)
      previousButton.disabled = currentPage === 0
      nextButton.disabled = currentPage === pages.length - 1
    }

    const play = async (element: HTMLElement, keyframes: Keyframe[], duration: number) => {
      const animation = element.animate(keyframes, {
        duration,
        easing: ARTICLE_PAGE_EASING,
        fill: "both",
      })
      activeAnimations.add(animation)

      try {
        await animation.finished
      } catch {
        // Navigation cleanup cancels in-flight animations.
      } finally {
        activeAnimations.delete(animation)
        animation.cancel()
      }
    }

    const showPage = async (nextPage: number) => {
      if (isTransitioning || nextPage < 0 || nextPage >= pages.length || nextPage === currentPage) {
        return
      }

      const outgoing = pages[currentPage]
      const incoming = pages[nextPage]
      const direction = nextPage > currentPage ? 1 : -1
      isTransitioning = true
      section.setAttribute("aria-busy", "true")

      if (!reduceMotion.matches) {
        await play(
          outgoing,
          [
            { opacity: 1, transform: "translateX(0)" },
            { opacity: 0, transform: `translateX(${-direction * 12}px)` },
          ],
          140,
        )
      }

      if (disposed) return

      outgoing.hidden = true
      incoming.hidden = false
      currentPage = nextPage
      updateControls()

      if (!reduceMotion.matches) {
        await play(
          incoming,
          [
            { opacity: 0, transform: `translateX(${direction * 12}px)` },
            { opacity: 1, transform: "translateX(0)" },
          ],
          220,
        )
      }

      if (disposed) return

      isTransitioning = false
      section.removeAttribute("aria-busy")
    }

    const showPreviousPage = () => void showPage(currentPage - 1)
    const showNextPage = () => void showPage(currentPage + 1)

    previousButton.addEventListener("click", showPreviousPage)
    nextButton.addEventListener("click", showNextPage)
    updateControls()

    window.addCleanup(() => {
      disposed = true
      activeAnimations.forEach((animation) => animation.cancel())
      previousButton.removeEventListener("click", showPreviousPage)
      nextButton.removeEventListener("click", showNextPage)
    })
  })
})
