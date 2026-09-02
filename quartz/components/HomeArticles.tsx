import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { htmlToJsx } from "../util/jsx"
import { FilePath, FullSlug, resolveRelative } from "../util/path"
import { unescapeHTML } from "../util/escape"
import { Date, getDate } from "./Date"
import { byDateAndAlphabetical } from "./PageList"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/homeArticles.scss"

interface Options {
  limit?: number
  archive?: boolean
  showAllLink?: boolean
}

const featuredArticleSlug = "Swift-Student-Challenge-2026"
const summaryProcessor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex, { output: "html" })

const BookIcon = () => (
  <svg
    class="section-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

const ArrowIcon = () => (
  <svg
    class="article-card-arrow"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M4 10h11" />
    <path d="m11 6 4 4-4 4" />
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

const renderSummary = (summary: string) => {
  const tree = summaryProcessor.runSync(summaryProcessor.parse(summary))
  return htmlToJsx("article-summary.md" as FilePath, tree)
}

export default ((opts?: Options) => {
  const HomeArticles: QuartzComponent = (props: QuartzComponentProps) => {
    const { allFiles, fileData, cfg } = props
    const isArchive = opts?.archive ?? false
    const allArticles = allFiles
      .filter(
        (page) =>
          page.slug !== "index" && page.slug !== "articles" && !page.slug?.startsWith("notes/"),
      )
      .sort(byDateAndAlphabetical(cfg))
    const featuredArticle = allArticles.find((page) => page.slug === featuredArticleSlug)
    const gridArticles = featuredArticle
      ? allArticles.filter((page) => page.slug !== featuredArticle.slug)
      : allArticles
    const pages = opts?.limit ? gridArticles.slice(0, opts.limit) : gridArticles
    const featuredTitle = featuredArticle?.frontmatter?.title ?? "Untitled"
    const featuredSummary = featuredArticle
      ? getSummary(featuredArticle.description, featuredArticle.frontmatter?.summary, featuredTitle)
      : ""

    if (allArticles.length === 0) return null

    return (
      <section
        class={["home-articles", isArchive ? "article-archive" : undefined]
          .filter(Boolean)
          .join(" ")}
        data-nosnippet={!isArchive || undefined}
      >
        {isArchive && (
          <header class="article-archive-header">
            <h1>All articles</h1>
          </header>
        )}

        {!isArchive && (
          <h2 class="home-articles-heading">
            <BookIcon />
            Articles
          </h2>
        )}

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
                <span>Apple</span>
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
          {pages.map((page) => {
            const title = page.frontmatter?.title ?? "Untitled"
            const date = page.dates ? getDate(cfg, page) : null
            const tag = page.frontmatter?.tags?.[0]
            const summary = getSummary(page.description, page.frontmatter?.summary, title)
            const href = resolveRelative(fileData.slug!, page.slug!)
            const TitleTag = isArchive ? "h2" : "h3"

            return (
              <article class="article-card">
                <div class="article-card-content">
                  <div class="article-card-meta">
                    {tag && <span>{tag}</span>}
                    {tag && date && <span aria-hidden="true">·</span>}
                    {date && <Date date={date} locale={cfg.locale} />}
                  </div>
                  <TitleTag class="article-card-title">
                    <a href={href}>{title}</a>
                  </TitleTag>
                  {summary && <div class="article-card-excerpt">{renderSummary(summary)}</div>}
                </div>
              </article>
            )
          })}
        </div>

        {opts?.showAllLink && allArticles.length > pages.length && (
          <div class="articles-more-row">
            <a
              class="articles-more-link"
              href={resolveRelative(fileData.slug!, "articles" as FullSlug)}
            >
              All articles
              <ArrowIcon />
            </a>
          </div>
        )}
      </section>
    )
  }

  HomeArticles.css = style
  return HomeArticles
}) satisfies QuartzComponentConstructor<Options | undefined>
