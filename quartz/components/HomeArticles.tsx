import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { htmlToJsx } from "../util/jsx"
import { FilePath, resolveRelative } from "../util/path"
import { unescapeHTML } from "../util/escape"
import { Date, getDate } from "./Date"
import { byDateAndAlphabetical } from "./PageList"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/homeArticles.scss"
// @ts-ignore
import script from "./scripts/homeArticles.inline"

const featuredArticleSlug = "Swift-Student-Challenge-2026"
// Section pages reached from the home splash; they host components, not writing.
const sectionSlugs = new Set(["index", "about", "articles"])
// Extra bottom space for a grid card, growing with how much text it holds. Titles count
// double since they're set large. Short cards get none; the wordiest get up to 4rem.
const cardRoom = (title: string, summary: string) => {
  const weight = title.length * 2 + summary.length
  return Math.min(4, Math.max(0, (weight - 160) * 0.05))
}
const summaryProcessor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex, { output: "html" })

const AppleLogo = () => (
  <svg
    class="article-card-meta-logo"
    viewBox="0 0 814 1000"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M788.1 340.9c-5.6 4.3-104.3 59.3-104.3 183.2 0 143.4 126 194.1 129.8 195.3-.6 3.1-20 68.4-65.6 135.1-40.6 58.7-82.9 117.2-147.4 117.2-64.5 0-81.1-37.5-155.4-37.5-72.3 0-98.1 38.7-157.2 38.7-59.1 0-100.6-54.3-147.8-121-54.5-77.1-98.8-196.5-98.8-309.8 0-181.7 118.2-278 234.5-278 61.7 0 113.1 40.6 151.8 40.6 36.9 0 94.4-43.1 164.6-43.1 26.6 0 122.3 2.5 195.8 79.3zM564.1 182.3c29.4-35 50-83.7 50-132.3 0-6.9-.6-13.7-1.9-19.4-47.5 1.9-104.3 31.9-138.4 71.9-26.9 30.6-52 79.3-52 128.5 0 7.5 1.2 15 1.9 17.5 3.1.6 8.1 1.2 13.1 1.2 42.5 0 96.3-28.1 127.3-67.5z" />
  </svg>
)

const cleanExcerpt = (description: string | undefined, title: string) => {
  const raw = unescapeHTML(description?.trim() ?? "")
  const withoutRepeatedTitle = raw.toLocaleLowerCase().startsWith(title.toLocaleLowerCase())
    ? raw.slice(title.length)
    : raw

  return withoutRepeatedTitle.replace(/^[\s.:–—-]+/, "").trim()
}

const getSummary = (description: string | undefined, summary: unknown, title: string): string =>
  typeof summary === "string" ? summary : cleanExcerpt(description, title)

// A small, deterministic force layout of the article graph (articles linked directly and
// through their tags, like the full graph view), drawn at build time beside the title.
const GRAPH_W = 220
const GRAPH_H = 64
const GRAPH_PAD = 5

const graphPreview = (pages: QuartzComponentProps["allFiles"]) => {
  const tags = [...new Set(pages.flatMap((page) => page.frontmatter?.tags ?? []))]
  const index = new Map<string, number>(pages.map((page, i) => [page.slug as string, i]))
  tags.forEach((tag, i) => index.set(`tag:${tag}`, pages.length + i))
  const keys = new Set<string>()
  const edges: (readonly [number, number])[] = []
  const connect = (a: number, b: number | undefined) => {
    if (b === undefined || a === b) return
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    if (keys.has(key)) return
    keys.add(key)
    edges.push([a, b])
  }
  pages.forEach((page, i) => {
    page.links?.forEach((link) => connect(i, index.get(link as string)))
    page.frontmatter?.tags?.forEach((tag) => connect(i, index.get(`tag:${tag}`)))
  })
  const count = pages.length + tags.length
  const isTag = Array.from({ length: count }, (_, i) => i >= pages.length)
  const nodes = Array.from({ length: count }, (_, i) => {
    const angle = i * 2.39996
    const radius = 6 * Math.sqrt(i + 1)
    return {
      x: GRAPH_W / 2 + radius * 2.5 * Math.cos(angle),
      y: GRAPH_H / 2 + radius * Math.sin(angle),
    }
  })

  for (let step = 0; step < 400; step++) {
    const force = nodes.map(() => ({ x: 0, y: 0 }))
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const push = 2.5 / Math.max(dx * dx + dy * dy, 4)
        force[i].x += dx * push
        force[i].y += dy * push
        force[j].x -= dx * push
        force[j].y -= dy * push
      }
    }
    for (const [a, b] of edges) {
      const dx = nodes[b].x - nodes[a].x
      const dy = nodes[b].y - nodes[a].y
      const pull = (Math.hypot(dx, dy) - 12) * 0.004
      force[a].x += dx * pull
      force[a].y += dy * pull
      force[b].x -= dx * pull
      force[b].y -= dy * pull
    }
    nodes.forEach((node, i) => {
      node.x += force[i].x + (GRAPH_W / 2 - node.x) * 0.02
      node.y += force[i].y + (GRAPH_H / 2 - node.y) * 0.05
      node.x = Math.min(GRAPH_W - GRAPH_PAD, Math.max(GRAPH_PAD, node.x))
      node.y = Math.min(GRAPH_H - GRAPH_PAD, Math.max(GRAPH_PAD, node.y))
    })
  }

  return { nodes, edges, isTag }
}

const renderSummary = (summary: string) => {
  const tree = summaryProcessor.runSync(summaryProcessor.parse(summary))
  return htmlToJsx("article-summary.md" as FilePath, tree)
}

export default (() => {
  const HomeArticles: QuartzComponent = (props: QuartzComponentProps) => {
    const { allFiles, fileData, cfg } = props
    const allArticles = allFiles
      .filter((page) => !sectionSlugs.has(page.slug!) && !page.slug?.startsWith("notes/"))
      .sort(byDateAndAlphabetical(cfg))
    const featuredArticle = allArticles.find((page) => page.slug === featuredArticleSlug)
    const gridArticles = featuredArticle
      ? allArticles.filter((page) => page.slug !== featuredArticle.slug)
      : allArticles
    const featuredTitle = featuredArticle?.frontmatter?.title ?? "Untitled"
    const featuredSummary = featuredArticle
      ? getSummary(featuredArticle.description, featuredArticle.frontmatter?.summary, featuredTitle)
      : ""

    if (allArticles.length === 0) return null
    const graph = graphPreview(allArticles)

    return (
      <section class="home-articles" data-nosnippet="true">
        <header class="home-articles-header">
          <h1 class="home-articles-title">Articles</h1>
          <button type="button" class="article-graph global-graph-icon">
            <svg
              class="article-graph-preview"
              data-article-graph
              viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
              aria-hidden="true"
              focusable="false"
            >
              {graph.edges.map(([a, b]) => (
                <line
                  data-a={a}
                  data-b={b}
                  x1={graph.nodes[a].x}
                  y1={graph.nodes[a].y}
                  x2={graph.nodes[b].x}
                  y2={graph.nodes[b].y}
                />
              ))}
              {graph.nodes.map((node, i) => (
                <circle
                  class={graph.isTag[i] ? "article-graph-tag" : undefined}
                  data-node={i}
                  cx={node.x}
                  cy={node.y}
                  r={graph.isTag[i] ? 2.6 : 2}
                />
              ))}
            </svg>
          </button>
        </header>

        {featuredArticle && (
          <article class="article-card article-card-featured">
            {featuredArticle.firstImage && (
              <span class="article-card-cover" aria-hidden="true">
                <img src={featuredArticle.firstImage} alt="" loading="eager" />
              </span>
            )}
            <div class="article-card-content">
              <div class="article-card-meta">
                <span>Featured</span>
                <span aria-hidden="true">·</span>
                <span class="article-card-meta-brand">
                  <AppleLogo />
                  Apple
                </span>
              </div>
              <h2 class="article-card-title">
                <a href={resolveRelative(fileData.slug!, featuredArticle.slug!)}>{featuredTitle}</a>
              </h2>
              {featuredSummary && (
                <div class="article-card-excerpt">{renderSummary(featuredSummary)}</div>
              )}
            </div>
          </article>
        )}

        <div class="article-card-grid">
          {gridArticles.map((page) => {
            const title = page.frontmatter?.title ?? "Untitled"
            const date = page.dates ? getDate(cfg, page) : null
            const tag = page.frontmatter?.tags?.[0]
            const summary = getSummary(page.description, page.frontmatter?.summary, title)
            const href = resolveRelative(fileData.slug!, page.slug!)
            const room = cardRoom(title, summary)

            return (
              <article class="article-card" style={`--card-room: ${room.toFixed(2)}rem`}>
                <div class="article-card-content">
                  <div class="article-card-meta">
                    {tag && <span>{tag}</span>}
                    {tag && date && <span aria-hidden="true">·</span>}
                    {date && <Date date={date} locale={cfg.locale} />}
                  </div>
                  <h3 class="article-card-title">
                    <a href={href}>{title}</a>
                  </h3>
                  {summary && <div class="article-card-excerpt">{renderSummary(summary)}</div>}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  HomeArticles.css = style
  HomeArticles.afterDOMLoaded = script
  return HomeArticles
}) satisfies QuartzComponentConstructor
