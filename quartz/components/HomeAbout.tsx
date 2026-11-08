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
          src="/static/bottom-hq.webp"
          {...localizedAttrs({
            alt: {
              en: "Thiago Komeno outside a Tokyo bookstore",
              ja: "東京の書店の前に立つ米野チアゴ",
              zh: "米野雅各在東京一家書店門口",
              pt: "Thiago Komeno em frente a uma livraria em Tóquio",
            },
          })}
          loading="eager"
          decoding="async"
          fetchPriority="high"
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
              ja: "家族の話や学んでいる言語、普段「こんなツールがあったらいいな」と思うことなど、身近なところからアイデアが生まれることが多いです。そこから、プラットフォームらしさを大切にしながら、使いやすいものをつくっています。",
              zh: "我的作品常常從身邊的事開始：家人的故事、正在學的語言，或是一個一直希望有人做出來的工具。從這些想法出發，我希望做出符合平台使用習慣、也讓人用起來自然順手的東西。",
              pt: "Meus projetos costumam nascer de coisas próximas de mim: uma história da minha família, um idioma que estou aprendendo ou alguma ferramenta que eu queria que existisse. A partir daí, tento criar algo que faça sentido tanto para a plataforma quanto para quem vai usar.",
            }}
          />
        </p>
        <p>
          <T
            text={{
              en: "I work mainly on iOS. Lately, I’ve been exploring on-device AI and the ways software can connect people across languages.",
              ja: "主にiOSアプリを開発しています。最近はオンデバイスAIや、言葉の壁を越えて人と人をつなぐソフトウェアにも取り組んでいます。",
              zh: "我主要做 iOS 開發。最近也在探索裝置端 AI，以及如何透過軟體，讓說不同語言的人更容易交流。",
              pt: "Desenvolvo principalmente para iOS. Ultimamente, tenho explorado IA que roda no próprio aparelho e como o software pode aproximar pessoas que falam idiomas diferentes.",
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
