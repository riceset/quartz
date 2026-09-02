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

interface Options {
  pageSize?: number
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
    const pageSize = Math.max(1, opts?.pageSize ?? 6)
    const allArticles = allFiles
      .filter((page) => page.slug !== "index" && !page.slug?.startsWith("notes/"))
      .sort(byDateAndAlphabetical(cfg))
    const featuredArticle = allArticles.find((page) => page.slug === featuredArticleSlug)
    const gridArticles = featuredArticle
      ? allArticles.filter((page) => page.slug !== featuredArticle.slug)
      : allArticles
    const articlePages = Array.from(
      { length: Math.ceil(gridArticles.length / pageSize) },
      (_, pageIndex) => gridArticles.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    )
    const featuredTitle = featuredArticle?.frontmatter?.title ?? "Untitled"
    const featuredSummary = featuredArticle
      ? getSummary(featuredArticle.description, featuredArticle.frontmatter?.summary, featuredTitle)
      : ""

    if (allArticles.length === 0) return null

    return (
      <section class="home-articles" data-nosnippet="true" data-article-pagination>
        <h2 class="home-articles-heading">
          <BookIcon />
          Articles
        </h2>

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

        <div class="article-card-pages">
          {articlePages.map((articles, pageIndex) => (
            <div
              class="article-card-grid article-card-page"
              data-article-page={pageIndex}
              hidden={pageIndex !== 0}
            >
              {articles.map((page) => {
                const title = page.frontmatter?.title ?? "Untitled"
                const date = page.dates ? getDate(cfg, page) : null
                const tag = page.frontmatter?.tags?.[0]
                const summary = getSummary(page.description, page.frontmatter?.summary, title)
                const href = resolveRelative(fileData.slug!, page.slug!)

                return (
                  <article class="article-card">
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
              {Array.from({ length: pageSize - articles.length }, (_, placeholderIndex) => (
                <div
                  class="article-card article-card-placeholder"
                  aria-hidden="true"
                  data-placeholder={placeholderIndex}
                >
                  <div class="article-card-content" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {articlePages.length > 1 && (
          <nav class="article-pagination" aria-label="Article pages">
            <button
              type="button"
              class="article-pagination-button article-pagination-previous"
              data-article-previous
              aria-label="Previous article page"
              title="Previous page"
              disabled
            >
              <span aria-hidden="true">{"<-"}</span>
            </button>
            <span
              class="article-pagination-status"
              data-article-page-status
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Page 1 of ${articlePages.length}`}
            >
              <span data-article-page-current>1</span>
              <span aria-hidden="true"> / </span>
              <span>{articlePages.length}</span>
            </span>
            <button
              type="button"
              class="article-pagination-button article-pagination-next"
              data-article-next
              aria-label="Next article page"
              title="Next page"
            >
              <span aria-hidden="true">{"->"}</span>
            </button>
          </nav>
        )}
      </section>
    )
  }

  HomeArticles.css = style
  HomeArticles.afterDOMLoaded = script
  return HomeArticles
}) satisfies QuartzComponentConstructor<Options | undefined>
