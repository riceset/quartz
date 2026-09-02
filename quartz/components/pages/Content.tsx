import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import HomeArticles from "../HomeArticles"

const ArticleArchive = HomeArticles({ archive: true })

const Content: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree } = props

  if (fileData.slug === "articles") {
    return <ArticleArchive {...props} />
  }

  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

Content.css = ArticleArchive.css

export default (() => Content) satisfies QuartzComponentConstructor
