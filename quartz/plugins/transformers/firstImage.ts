import { Root } from "hast"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

export const FirstImage: QuartzTransformerPlugin = () => ({
  name: "FirstImage",
  htmlPlugins() {
    return [
      () => (tree: Root, file) => {
        visit(tree, "element", (node) => {
          if (file.data.firstImage || node.tagName !== "img") return

          const src = node.properties?.src
          if (typeof src === "string") {
            file.data.firstImage = src
          }
        })
      },
    ]
  },
})

declare module "vfile" {
  interface DataMap {
    firstImage?: string
  }
}
