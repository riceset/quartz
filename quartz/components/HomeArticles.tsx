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
        <h2 class="home-articles-heading">06 / Articles</h2>

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
