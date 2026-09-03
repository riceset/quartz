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
          My projects often begin with something close to me: a family story, a language I’m
          learning, or a tool I kept wishing existed. From there, I build experiences that feel
          natural to both the platform and the person using them.
        </p>
        <p>
          I work mainly on iOS. Lately, I’ve been exploring on-device AI and the ways software can
          connect people across languages.
        </p>
      </div>
    </div>
  </section>
)

HomeAbout.css = style

export default (() => HomeAbout) satisfies QuartzComponentConstructor
