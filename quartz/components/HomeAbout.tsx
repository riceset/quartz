import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { localizedAttrs, T } from "./localized"
import style from "./styles/homeAbout.scss"

const HomeAbout: QuartzComponent = () => (
  <section class="home-about" aria-labelledby="home-about-title">
    <h1 class="home-about-title">
      <T text={{ en: "About", ja: "自己紹介", zh: "關於我", pt: "Sobre" }} />
    </h1>

    <div class="home-about-layout">
      <figure class="home-about-portrait">
        <img
          src="/static/bottom.jpg"
          {...localizedAttrs({
            alt: {
              en: "Thiago Komeno outside a Tokyo bookstore",
              ja: "東京の書店の前に立つ米野チアゴ",
              zh: "米野雅各在東京一家書店外",
              pt: "Thiago Komeno em frente a uma livraria em Tóquio",
            },
          })}
          loading="lazy"
        />
      </figure>

      <div class="home-about-copy">
        <h2 id="home-about-title">
          <T
            text={{
              en: "I like building things that feel native.",
              ja: "プラットフォームになじむ体験をつくるのが好きです。",
              zh: "打造貼合平台的體驗。",
              pt: "Gosto de criar experiências nativas.",
            }}
          />
        </h2>
        <p>
          <T
            text={{
              en: "My projects often begin with something close to me: a family story, a language I’m learning, or a tool I kept wishing existed. From there, I build experiences that feel natural to both the platform and the person using them.",
              ja: "家族の話や学んでいる言語、日常で「こんなツールがあれば」と思ったことなど、身近なことが開発のきっかけになることが多いです。そこから、使う人にとって使いやすく、プラットフォームにも合ったものをつくるようにしています。",
              zh: "我的作品常常從身邊的事開始：一段家族故事、正在學的語言，或是一個一直希望存在的工具。從這些想法出發，我希望做出符合平台特性，也讓使用者覺得自然、順手的體驗。",
              pt: "Meus projetos geralmente começam com algo próximo de mim: uma história de família, um idioma que estou aprendendo ou uma ferramenta que sempre quis que existisse. A partir daí, busco criar experiências que se encaixem naturalmente tanto na plataforma quanto na vida de quem as usa.",
            }}
          />
        </p>
        <p>
          <T
            text={{
              en: "I work mainly on iOS. Lately, I’ve been exploring on-device AI and the ways software can connect people across languages.",
              ja: "普段はiOSアプリを中心に開発しています。最近はオンデバイスAIや、言葉の壁を越えて人と人をつなぐソフトウェアにも取り組んでいます。",
              zh: "我主要做 iOS 開發。最近也在探索裝置端 AI，以及如何透過軟體跨越語言隔閡，讓人與人產生連結。",
              pt: "Trabalho principalmente com desenvolvimento iOS. Ultimamente, tenho explorado IA no dispositivo e como o software pode conectar pessoas que falam idiomas diferentes.",
            }}
          />
        </p>

        <div class="home-about-signature" aria-hidden="true">
          <span class="home-about-signature-stroke"></span>
          <span class="home-about-signature-name">Komeno</span>
        </div>
      </div>
    </div>
  </section>
)

HomeAbout.css = style

export default (() => HomeAbout) satisfies QuartzComponentConstructor
