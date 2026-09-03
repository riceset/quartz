import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {},
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.HomeHero(),
      condition: (props) => props.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.HomeProfile(),
      condition: (props) => props.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.HomeArticles({ pageSize: 4 }),
      condition: (props) => props.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.HomeAbout(),
      condition: (props) => props.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.Graph({
        modalOnly: true,
        globalGraph: {
          removeSlugs: ["index"],
          repelForce: 0.65,
          centerForce: 0.45,
          linkDistance: 38,
          labelOpacity: 0.68,
          graphLabels: {
            Dictionary: "Mandarin",
            "Introduction-to-Vim": "Vim",
            "MIXI-Internship": "MIXI",
            "Makefile-for-C++-Projects": "Makefiles",
            Pointers: "Pointers",
            "Replicating-the-Print-Function-in-C": "Print",
            "Signals-in-Linux": "Signals",
            "Swift-Student-Challenge-2025": "NeoMnemo",
            "Swift-Student-Challenge-2026": "SSC 2026",
            "The-Dining-Philosophers-Problem": "Dining",
            "The-Orthodox-Canonical-Class-Form": "Canonical Form",
            "The-XOR-Swap": "XOR Swap",
            "Understanding-Binary-Insertion-Sort": "Binary Insert",
            "Understanding-Casts-in-C++": "C++ Casts",
            "Understanding-Insertion-Sort": "Insertion Sort",
          },
        },
      }),
      condition: (props) => props.fileData.slug === "index",
    }),
  ],
  left: [
    Component.ConditionalRender({
      component: Component.PageTitle(),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.MobileOnly(Component.Spacer()),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.Darkmode(),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.Socials()),
      condition: (props) => props.fileData.slug !== "index",
    }),
  ],
  right: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Socials()),
  ],
  right: [],
}
