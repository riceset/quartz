import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const faviconSvgPath = joinSegments(baseDir, "static/favicon.svg")
    const faviconIcoPath = joinSegments(baseDir, "static/favicon.ico")
    const appleTouchIconPath = joinSegments(baseDir, "static/apple-touch-icon.png")
    const msTileIconPath = joinSegments(baseDir, "static/mstile-150x150.png")
    const manifestPath = joinSegments(baseDir, "static/site.webmanifest")
    const isHomePage = fileData.slug === "index" || fileData.slug === ""

    // Url of current page
    const socialUrl =
      fileData.slug === "404" || isHomePage
        ? url.toString()
        : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`
    const logoImagePath = `https://${cfg.baseUrl}/static/icon.png`
    const organizationId = `https://${cfg.baseUrl}/#organization`
    const socialProfiles = [
      "https://github.com/riceset",
      "https://www.linkedin.com/in/riceset/",
      "https://www.youtube.com/@riceset",
      "https://www.instagram.com/riceset/",
      "https://x.com/riceset",
    ]
    const ogImageExtension = getFileExtension(ogImageDefaultPath)?.replace(/^\./, "") ?? "png"
    const ogImageAlt = usesCustomOgImage
      ? description
      : "The riceset boy mark and wordmark centered on a warm gray background"
    const ogImageObject = {
      "@type": "ImageObject",
      url: ogImageDefaultPath,
      contentUrl: ogImageDefaultPath,
      width: 1200,
      height: 630,
      caption: ogImageAlt,
    }
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: cfg.pageTitle,
      url: `https://${cfg.baseUrl}/`,
      publisher: { "@id": organizationId },
    }
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      url: `https://${cfg.baseUrl}/`,
      description,
      primaryImageOfPage: ogImageObject,
      publisher: { "@id": organizationId },
    }
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: cfg.pageTitle,
      alternateName: "Thiago Komeno",
      url: `https://${cfg.baseUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: logoImagePath,
        contentUrl: logoImagePath,
        width: 192,
        height: 192,
        caption: "riceset",
      },
      sameAs: socialProfiles,
    }
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Thiago Komeno",
      url: `https://${cfg.baseUrl}/`,
      image: `https://${cfg.baseUrl}/media/index/face.jpg`,
      jobTitle: "Software Developer",
      sameAs: socialProfiles,
    }

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#faf8f8" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#161618" media="(prefers-color-scheme: dark)" />
        <meta name="msapplication-TileColor" content="#faf8f8" />
        <meta name="msapplication-TileImage" content={msTileIconPath} />
        <meta name="robots" content="max-image-preview:large" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&display=swap"
            />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=La+Belle+Aurore&family=LINE+Seed+JP&display=swap"
            />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content={isHomePage ? "website" : "article"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={ogImageAlt} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta property="og:image:secure_url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta name="twitter:image:alt" content={ogImageAlt} />
            <meta property="og:image:type" content={`image/${ogImageExtension}`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link
          rel="icon"
          href={faviconIcoPath}
          sizes="16x16 32x32 48x48 96x96"
          media="(prefers-color-scheme: light)"
        />
        <link rel="icon" href={faviconSvgPath} type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href={appleTouchIconPath} sizes="180x180" />
        <link rel="manifest" href={manifestPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        {isHomePage && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
          </>
        )}

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
