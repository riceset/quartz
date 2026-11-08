import DarkmodeConstructor from "./Darkmode"
import LanguagePickerConstructor from "./LanguagePicker"
import { Localized, T } from "./localized"
import { doodlePaths, doodleViewBox } from "./doodle"
import { socialLinks } from "./socialIcons"
import { WeatherIcons } from "./weatherIcons"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { concatenateResources } from "../util/resources"
import { resolveRelative, FullSlug } from "../util/path"
import style from "./styles/homeSplash.scss"
// @ts-ignore
import script from "./scripts/homeSplash.inline"

const SplashDarkmode = DarkmodeConstructor()
const SplashLanguagePicker = LanguagePickerConstructor()

const name: Localized = {
  en: "Thiago Komeno",
  ja: "米野チアゴ",
  zh: "米野雅各",
  pt: "Thiago Komeno",
}

const HomeSplash: QuartzComponent = (props: QuartzComponentProps) => {
  const section = (slug: string) => resolveRelative(props.fileData.slug!, slug as FullSlug)
  const navLinks: { href: string; label: Localized }[] = [
    { href: section("about"), label: { en: "About", ja: "自己紹介", zh: "關於我", pt: "Sobre" } },
    { href: section("articles"), label: { en: "Articles", ja: "記事", zh: "文章", pt: "Artigos" } },
    {
      href: "/static/Thiago-Komeno.pdf",
      label: { en: "Résumé", ja: "履歴書", zh: "履歷", pt: "Currículo" },
    },
    {
      href: "mailto:komeno@riceset.com",
      label: { en: "Contact", ja: "連絡先", zh: "聯絡", pt: "Contato" },
    },
  ]

  return (
    <section class="splash" data-splash>
      <div class="splash-top">
        {/* A field-notebook annotation; the script fills in the current time and weather in Tokyo. */}
        <p class="splash-note">
          <span class="splash-weather" role="img" data-splash-weather hidden>
            <WeatherIcons />
          </span>
          <T text={{ en: "Tokyo", ja: "東京", zh: "東京", pt: "Tóquio" }} />
          <span aria-hidden="true"> · </span>
          <span data-splash-clock>JST</span>
        </p>
        <div class="splash-controls">
          <SplashLanguagePicker {...props} />
          <SplashDarkmode {...props} />
        </div>
      </div>

      <div class="splash-stage">
        {/* The canvas draws the doodle as animated ASCII; the SVG is the no-JS fallback
            and the source the script reads the path data from. */}
        <canvas class="splash-canvas" aria-hidden="true" data-splash-canvas />
        <svg
          class="splash-doodle"
          viewBox={doodleViewBox}
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
          data-splash-doodle
        >
          {doodlePaths.map((d) => (
            <path d={d} />
          ))}
        </svg>
      </div>

      <div class="splash-bottom">
        <div class="splash-signature">
          <h1 class="splash-name">
            <T text={name} />
          </h1>
          <nav class="splash-nav" aria-label="Sections">
            {navLinks.map(({ href, label }) => (
              <a class="splash-nav-link" href={href}>
                <T text={label} />
              </a>
            ))}
          </nav>
        </div>

        <div class="splash-socials">
          {socialLinks.map(({ href, label, Icon }) => {
            const isExternal = href.startsWith("https://")
            return (
              <a
                href={href}
                class="splash-social"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={label}
                title={label}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

HomeSplash.beforeDOMLoaded = concatenateResources(
  SplashDarkmode.beforeDOMLoaded,
  SplashLanguagePicker.beforeDOMLoaded,
)
HomeSplash.afterDOMLoaded = script
HomeSplash.css = concatenateResources(style, SplashDarkmode.css, SplashLanguagePicker.css)
export default (() => HomeSplash) satisfies QuartzComponentConstructor
