import DarkmodeConstructor from "./Darkmode"
import { doodlePaths, doodleViewBox } from "./doodle"
import { socialLinks } from "./socialIcons"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { concatenateResources } from "../util/resources"
import { resolveRelative, FullSlug } from "../util/path"
import style from "./styles/homeSplash.scss"
// @ts-ignore
import script from "./scripts/homeSplash.inline"

const SplashDarkmode = DarkmodeConstructor()

const HomeSplash: QuartzComponent = (props: QuartzComponentProps) => {
  const section = (slug: string) => resolveRelative(props.fileData.slug!, slug as FullSlug)
  const navLinks = [
    { href: section("about"), label: "About" },
    { href: section("articles"), label: "Articles" },
    { href: "/static/Thiago-Komeno.pdf", label: "Résumé" },
    { href: "mailto:komeno@riceset.com", label: "Contact" },
  ]

  return (
    <section class="splash" data-splash>
      <div class="splash-top">
        {/* A field-notebook annotation; the script fills in the current time in Tokyo. */}
        <p class="splash-note">
          Tokyo<span aria-hidden="true"> · </span>
          <span data-splash-clock>JST</span>
        </p>
        <SplashDarkmode {...props} />
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
          <h1 class="splash-name">Thiago Komeno</h1>
          <nav class="splash-nav" aria-label="Sections">
            {navLinks.map(({ href, label }) => (
              <a class="splash-nav-link" href={href}>
                {label}
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

HomeSplash.beforeDOMLoaded = SplashDarkmode.beforeDOMLoaded
HomeSplash.afterDOMLoaded = script
HomeSplash.css = concatenateResources(style, SplashDarkmode.css)
export default (() => HomeSplash) satisfies QuartzComponentConstructor
