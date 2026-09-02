import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/homeAbout.scss"

const HomeAbout: QuartzComponent = () => (
  <section class="home-about" aria-labelledby="home-about-title">
    <header class="home-about-header">
      <span>07 / About</span>
      <span>Tokyo, Japan</span>
    </header>

    <div class="home-about-layout">
      <figure class="home-about-portrait">
        <img
          src="/static/bottom.jpg"
          alt="Thiago Komeno outside a Tokyo bookstore"
          loading="lazy"
        />
      </figure>

      <div class="home-about-copy">
        <h2 id="home-about-title">I like building things that feel native.</h2>
        <p>
          When I&apos;m not coding, I&apos;m probably studying a language, taking notes, or
          wandering through Tokyo. Most of what I build starts with something personal: a family
          story or a tool I wish existed.
        </p>
        <p>
          I mostly build for iOS. Lately, I&apos;ve been exploring on-device AI and the ways
          software can connect people through language.
        </p>
      </div>
    </div>
  </section>
)

HomeAbout.css = style

export default (() => HomeAbout) satisfies QuartzComponentConstructor
