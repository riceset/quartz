import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { Localized, T } from "./localized"
import style from "./styles/homeProfile.scss"

// ── Data ───────────────────────────────────────────────────────────────────

// Every section is a list of the same kind of entry: a date in the margin, a title,
// the organization line, and an optional description with follow-up links.
// Text is either one string for every language (names, event titles) or a translation each.
interface Entry {
  date?: Localized
  title: Localized
  org: Localized
  // BCP 47 tags for a title or org not written in English, so CJK picks up its webfont.
  titleLang?: string
  orgLang?: string
  detail?: Localized
  place?: Localized
  description?: Localized
  articleUrl?: string
  // Replaces the linked article's title, for titles too long to show.
  articleLabel?: Localized
  // External follow-ups listed under the description, e.g. a recording or press.
  links?: { label: Localized; url: string }[]
}

interface Language {
  name: Localized
  level: Localized
}

// Year-only dates; Japanese and Chinese mark each year with 年, like the month dates.
const years = (...ys: number[]): Localized => {
  const plain = ys.join(" – ")
  const cjk = ys.length === 1 ? `${ys[0]} 年` : `${ys.join("–")} 年`
  const japanese = ys.map((y) => `${y}年`).join("〜")
  return { en: plain, ja: japanese, zh: cjk, pt: plain }
}

const tokyo: Localized = { en: "Tokyo", ja: "東京", zh: "東京", pt: "Tóquio" }
const seoul: Localized = { en: "Seoul", ja: "ソウル", zh: "首爾", pt: "Seul" }
const internship: Localized = { en: "Internship", ja: "インターン", zh: "實習", pt: "Estágio" }
const appDevEngineer: Localized = {
  en: "Application Development Engineer",
  ja: "アプリ開発エンジニア",
  zh: "應用程式開發工程師",
  pt: "Engenheiro de Desenvolvimento de Aplicativos",
}

const experience: Entry[] = [
  {
    date: {
      en: "May 2026 – Now",
      ja: "2026年5月〜現在",
      zh: "2026 年 5 月至今",
      pt: "mai 2026 – atual",
    },
    title: {
      en: "Full-Stack Software Engineer",
      ja: "フルスタックエンジニア",
      zh: "全端軟體工程師",
      pt: "Engenheiro de Software Full-Stack",
    },
    org: "BaseMe",
    detail: { en: "Part-time", ja: "アルバイト", zh: "兼職", pt: "Meio Período" },
    place: tokyo,
    description: {
      en: "Built features for BaseMe’s AI career chat, such as using your notes as context and stopping a reply, and redesigned how company recommendations appear. Also added profile view counts to help students get noticed by recruiters.",
      ja: "BaseMeのAIキャリアチャットに、メモの内容を回答に反映する機能や、回答を途中で止める機能を追加しました。おすすめ企業の表示方法も見直しました。また、学生が自分のプロフィールへの反応を確認できるよう、閲覧数を表示する機能も追加しました。",
      zh: "我為 BaseMe 的 AI 職涯聊天加入了幾項功能，讓 AI 能參考使用者的筆記回答，也能隨時停止生成回覆。我還重新設計了推薦企業的呈現方式，並加入個人檔案的瀏覽次數，幫助學生更容易被招募人員看見。",
      pt: "Desenvolvi recursos para o chat de carreira com IA da BaseMe, como respostas que usam as anotações do usuário como contexto e a opção de interromper uma resposta. Também redesenhei a forma como as empresas recomendadas aparecem e adicionei um contador de visualizações ao perfil para ajudar estudantes a chamar a atenção de recrutadores.",
    },
  },
  {
    date: {
      en: "Aug – Sep 2026",
      ja: "2026年8月〜9月",
      zh: "2026 年 8–9 月",
      pt: "ago – set 2026",
    },
    title: appDevEngineer,
    org: { en: "LY Corporation", ja: "LINEヤフー", zh: "LY Corporation", pt: "LY Corporation" },
    detail: internship,
    place: { en: "Fukuoka", ja: "福岡", zh: "福岡", pt: "Fukuoka" },
    articleUrl: "/LINE-Internship",
    description: {
      en: "Updated LINE’s sticker and emoji screens in UIKit for the Liquid Glass redesign and fixed iOS 26 layout issues in settings, aligning on styling with designers in English and Japanese. Also prototyped migrating the currency-history footer from UIKit to SwiftUI.",
      ja: "LINEのスタンプ・絵文字画面をLiquid Glassに合わせてUIKitで改修しました。iOS 26で崩れていた設定画面のレイアウトも修正し、デザインは、日本語と英語でデザイナーと相談しながら調整しました。また、コイン履歴のフッターをUIKitからSwiftUIに移すプロトタイプも作りました。",
      zh: "我用 UIKit 配合 Liquid Glass 的新設計，更新 LINE 的貼圖和表情貼畫面，也修正了 iOS 26 上設定頁面的排版問題。過程中用日文和英文跟設計師討論視覺細節。另外也做了一個原型，嘗試把代幣紀錄頁面的底部從 UIKit 改成 SwiftUI。",
      pt: "Atualizei as telas de stickers e emojis do LINE em UIKit para o novo visual Liquid Glass e corrigi problemas de layout nas configurações do iOS 26. Conversei com designers em inglês e japonês para acertar os detalhes visuais. Também criei um protótipo para migrar o rodapé do histórico de moedas de UIKit para SwiftUI.",
    },
  },
  {
    date: {
      en: "Aug – Sep 2026",
      ja: "2026年8月〜9月",
      zh: "2026 年 8–9 月",
      pt: "ago – set 2026",
    },
    title: appDevEngineer,
    org: "Sansan",
    detail: internship,
    place: tokyo,
    articleUrl: "/Sansan-Internship",
    description: {
      en: "Built a proof of concept for on-device Japanese contact search with Apple’s Foundation Models and MeCab, matching natural-language queries to names and companies. Also reworked Eight’s TipKit Premium reminders and expanded its Premium landing page, writing the specs for both.",
      ja: "AppleのFoundation ModelsとMeCabを使い、端末上で動く日本語の名刺検索を試作しました。自然な文章を入力すると、名前や会社名を探せる仕組みです。また、EightのTipKitを使ったPremiumの案内を見直し、Premiumの紹介ページも拡充しました。この2件は仕様書の作成から担当しました。",
      zh: "我用 Apple 的 Foundation Models 和 MeCab 做了日文名片搜尋的概念驗證，讓使用者能用自然語句搜尋姓名和公司，整個過程都在裝置上完成。我也重新設計了 Eight 透過 TipKit 顯示的 Premium 方案提醒，並擴充 Premium 方案的介紹頁面。這兩項工作的規格書也由我撰寫。",
      pt: "Desenvolvi uma prova de conceito de busca de cartões de visita em japonês que roda no próprio aparelho, usando o Foundation Models da Apple e o MeCab para encontrar nomes e empresas a partir de frases em linguagem natural. Também reformulei os lembretes do plano premium do Eight, feitos com TipKit, e ampliei a landing page do plano premium, cuidando das especificações de ambos.",
    },
  },
  {
    date: {
      en: "Jan – Apr 2026",
      ja: "2026年1月〜4月",
      zh: "2026 年 1–4 月",
      pt: "jan – abr 2026",
    },
    title: appDevEngineer,
    org: "MIXI",
    detail: internship,
    place: tokyo,
    articleUrl: "/MIXI-Internship",
    description: {
      en: "Added country-based access controls to an AI feature in FamilyAlbum that recognizes family members and suggests photos for albums, keeping it to legally approved regions with cached location checks covered by Swift Testing. Also replaced PanModal with native iOS sheets for iOS 26.",
      ja: "「家族アルバム みてね」で、家族を認識してアルバム用の写真を提案するAI機能に、国ごとの利用制限を追加しました。法律上、提供できる地域だけで使えるようにし、キャッシュを使った地域判定はSwift Testingでテストしました。また、iOS 26に合わせてPanModalを標準のシートに置き換えました。",
      zh: "在 FamilyAlbum，我為一項能辨識家人、推薦相簿照片的 AI 功能加入了國家／地區使用限制，確保只有法規允許的地區能使用。我也用 Swift Testing 測試透過快取的位置資訊判斷所在地區的邏輯，並因應 iOS 26，把 PanModal 換成 iOS 原生的 sheet。",
      pt: "No FamilyAlbum, implementei restrições por país em um recurso de IA que reconhece familiares e sugere fotos para álbuns, permitindo seu uso apenas onde a legislação autoriza. Usei Swift Testing para testar as verificações de localização armazenadas em cache. Também substituí o PanModal pelas sheets nativas do iOS 26.",
    },
  },
  {
    date: years(2025, 2026),
    title: {
      en: "Google Student Ambassador",
      ja: "Google 学生アンバサダー",
      zh: "Google 學生大使",
      pt: "Embaixador Estudantil do Google",
    },
    org: "Google Japan",
    place: tokyo,
    description: {
      en: "Part of the program’s first cohort, sharing everyday AI use cases with more than 1,000 followers. Helped fellow university students learn to use AI safely and effectively.",
      ja: "Google 学生アンバサダーの第1期生として、日常でのAIの使い方を1,000人以上のフォロワーに紹介しました。また、大学生がAIを安全に、うまく活用できるようサポートしました。",
      zh: "我是 Google 學生大使計畫的第一屆成員，向超過 1,000 位追蹤者分享日常生活中的 AI 用法，也協助其他大學生學會安全、有效地使用 AI。",
      pt: "Fiz parte da primeira turma de embaixadores estudantis do Google, compartilhando formas de usar IA no dia a dia com mais de 1.000 seguidores. Também ajudei outros universitários a usar IA com segurança e de forma prática.",
    },
    links: [
      {
        label: {
          en: "Article by Google Gemini",
          ja: "Google Geminiのnoteで紹介",
          zh: "Google Gemini 的介紹文章",
          pt: "Artigo do Google Gemini",
        },
        url: "https://note.com/google_gemini/n/nae4c7e7952f7",
      },
      {
        label: {
          en: "TV news coverage on YouTube",
          ja: "YouTubeでテレビ報道を見る",
          zh: "在 YouTube 看電視新聞報導",
          pt: "Reportagem de TV no YouTube",
        },
        url: "https://www.youtube.com/watch?v=1IyzO2LOErc",
      },
    ],
  },
]

const readWriteUp: Localized = {
  en: "Read the write-up",
  ja: "記事を読む",
  zh: "閱讀文章",
  pt: "Ler o artigo",
}

const awards: Entry[] = [
  {
    date: years(2026),
    title: {
      en: "Swift Student Challenge Winner",
      ja: "Swift Student Challenge 受賞",
      zh: "Swift Student Challenge 得獎者",
      pt: "Vencedor do Swift Student Challenge",
    },
    org: "Apple",
    description: {
      en: "Selected for an app that impressed and inspired Apple with its creativity, technical skill, and thoughtful design.",
      ja: "アイデアの独自性や技術力、細部までこだわったデザインが評価され、受賞しました。",
      zh: "我的作品在創意、技術實作和設計細節上獲得 Apple 肯定，並在 Swift Student Challenge 中得獎。",
      pt: "Fui premiado por um app que chamou a atenção da Apple pela criatividade, qualidade técnica e cuidado com o design.",
    },
    articleUrl: "/Swift-Student-Challenge-2026",
    articleLabel: "Swift Student Challenge",
  },
  {
    date: years(2023),
    title: {
      en: "MEXT Undergraduate Scholarship",
      ja: "国費外国人留学生（学部）",
      zh: "日本政府（MEXT）大學部獎學金",
      pt: "Bolsa MEXT para Graduação",
    },
    org: {
      en: "Ministry of Education of Japan",
      ja: "文部科学省",
      zh: "日本文部科學省",
      pt: "Ministério da Educação do Japão",
    },
    description: {
      en: "Awarded through embassy recommendation, covering full tuition, living expenses, and travel for undergraduate studies in Japan.",
      ja: "2023年、大使館推薦の国費留学生として来日しました。",
      zh: "2023 年透過日本大使館推薦，獲得 MEXT 大學部獎學金，並赴日留學。",
      pt: "Recebi a bolsa MEXT por recomendação da embaixada, com cobertura integral das taxas universitárias, auxílio mensal para viver no Japão e passagens aéreas.",
    },
    links: [
      {
        label: {
          en: "Covered by Brasil Nippou",
          ja: "ブラジル日報で紹介",
          zh: "Brasil Nippou 報導",
          pt: "Destaque no Brasil Nippou",
        },
        url: "https://brasilnippou.com/ja/articles/230329-24colonia",
      },
    ],
  },
]

const hackathons: Entry[] = [
  {
    date: { en: "Jun 2026", ja: "2026年6月", zh: "2026 年 6 月", pt: "jun 2026" },
    title: "Build with OpenAI Hackathon",
    org: "OpenAI",
    detail: { en: "Finalist", ja: "ファイナリスト", zh: "入圍決賽", pt: "Finalista" },
    place: tokyo,
  },
  {
    date: { en: "Jun 2026", ja: "2026年6月", zh: "2026 年 6 月", pt: "jun 2026" },
    title: "SDGs to Startups Hackathon",
    org: "Tokyo AI",
    detail: { en: "1st Place", ja: "優勝", zh: "第一名", pt: "1º lugar" },
    place: tokyo,
    links: [
      {
        label: {
          en: "Group photo on Instagram",
          ja: "Instagramで集合写真を見る",
          zh: "Instagram 上的大合照",
          pt: "Foto em grupo no Instagram",
        },
        url: "https://www.instagram.com/p/DZ_XJXogen8/",
      },
    ],
  },
  {
    date: { en: "Apr 2026", ja: "2026年4月", zh: "2026 年 4 月", pt: "abr 2026" },
    title: "try! Swift Tokyo Hackathon",
    org: { en: "Mercari", ja: "メルカリ", zh: "Mercari", pt: "Mercari" },
    detail: { en: "Winner", ja: "受賞", zh: "得獎", pt: "Vencedor" },
    place: tokyo,
    links: [
      {
        label: {
          en: "Group photo on X",
          ja: "Xで集合写真を見る",
          zh: "X 上的大合照",
          pt: "Foto em grupo no X",
        },
        url: "https://x.com/HR_mixi/status/2042940019481223188",
      },
    ],
  },
  {
    date: { en: "Sep 2024", ja: "2024年9月", zh: "2024 年 9 月", pt: "set 2024" },
    title: "24-Hour Hackathon by 42 Asia",
    org: "SUTD & 42 Asia",
    detail: { en: "2nd Place", ja: "準優勝", zh: "第二名", pt: "2º lugar" },
    place: seoul,
    links: [
      {
        label: {
          en: "Covered by the 42 Network blog",
          ja: "42 Networkのブログで紹介",
          zh: "42 Network 部落格報導",
          pt: "Destaque no blog da 42 Network",
        },
        url: "https://www.42network.org/blog/42-in-asia-bridging-innovation-and-collaboration-across-borders/",
      },
    ],
  },
]

const talks: Entry[] = [
  {
    date: { en: "Jul 2026", ja: "2026年7月", zh: "2026 年 7 月", pt: "jul 2026" },
    title: {
      en: "How to Win the Swift Student Challenge",
      ja: "How to Win the Swift Student Challenge",
      zh: "如何贏得 Swift Student Challenge",
      pt: "How to Win the Swift Student Challenge",
    },
    titleLang: "en",
    org: "iPlayground Taiwan",
    place: { en: "Taipei", ja: "台北", zh: "台北", pt: "Taipé" },
    description: {
      en: "A talk on turning a personal story into a winning Swift Playground, covering how to find an idea only you could build, grow SwiftUI skills under real project constraints, and use attention to detail to raise a submission from good to winning.",
      ja: "自分の経験をもとにSwift Playgroundをつくり、受賞するまでの過程を紹介しました。自分ならではのアイデアの見つけ方や、制約のある中でSwiftUIのスキルを磨く方法、細部まで工夫して作品の完成度を高めることについて話しました。",
      zh: "我分享了如何把自己的故事做成得獎的 Swift Playground，也談到怎麼找到自己獨特的題材、在專案限制下磨練 SwiftUI，以及如何透過細節提升作品的完成度，讓作品更有機會得獎。",
      pt: "Compartilhei como transformei uma história pessoal em um Swift Playground premiado. Falei sobre encontrar uma ideia própria, aprimorar minhas habilidades em SwiftUI mesmo com as limitações de um projeto real e cuidar dos detalhes que fizeram diferença no resultado.",
    },
    links: [
      {
        label: {
          en: "Watch the talk on YouTube",
          ja: "YouTubeで講演を見る",
          zh: "在 YouTube 看演講",
          pt: "Assistir à palestra no YouTube",
        },
        url: "https://www.youtube.com/watch?v=t9sC0nL-uTA",
      },
      {
        label: {
          en: "Covered by the LY Corporation Tech Blog",
          ja: "LINEヤフーのTech Blogで紹介",
          zh: "LY Corporation 技術部落格的介紹文章",
          pt: "Destaque no Tech Blog da LY Corporation",
        },
        url: "https://techblog.lycorp.co.jp/zh-hant/TWC-2026-iPlayground-Apple-Developer-Conference",
      },
    ],
  },
  {
    date: { en: "Apr 2026", ja: "2026年4月", zh: "2026 年 4 月", pt: "abr 2026" },
    title: {
      en: "MEXT Scholarship Speaker",
      ja: "国費留学の体験談",
      zh: "我的 MEXT 留學經驗",
      pt: "Minha Experiência com a Bolsa MEXT",
    },
    org: {
      en: "Ministry of Foreign Affairs of Japan",
      ja: "外務省",
      zh: "日本外務省",
      pt: "Ministério das Relações Exteriores do Japão",
    },
    place: tokyo,
    description: {
      en: "Spoke at a Consulate-General of Japan in São Paulo webinar, sharing my MEXT scholarship experience with prospective students.",
      ja: "在サンパウロ日本国総領事館のウェビナーで、国費留学を考えている学生に自分の経験を話しました。",
      zh: "我在日本駐聖保羅總領事館舉辦的線上講座中，向考慮申請 MEXT 獎學金的學生分享自己的留學經驗。",
      pt: "Participei de um webinar do Consulado-Geral do Japão em São Paulo para contar minha experiência com a bolsa MEXT a estudantes interessados em estudar no Japão.",
    },
    links: [
      {
        label: {
          en: "Watch the webinar on YouTube",
          ja: "YouTubeでウェビナーを見る",
          zh: "在 YouTube 看講座",
          pt: "Assistir ao webinar no YouTube",
        },
        url: "https://www.youtube.com/watch?v=3_t0S7yOug0",
      },
    ],
  },
  {
    date: { en: "Jan 2024", ja: "2024年1月", zh: "2024 年 1 月", pt: "jan 2024" },
    title: "The 42 Live Radio Show",
    org: "Innovation Academy",
    orgLang: "en",
    place: seoul,
    description: {
      en: "Joined a cross-campus podcast between Innovation Academy and 42 Tokyo, exchanging perspectives on the 42 Network with Korean students.",
      ja: "Innovation Academyと42 Tokyoの合同ポッドキャストに出演し、韓国の学生と42 Networkについて話しました。",
      zh: "我參加了 Innovation Academy 和 42 Tokyo 合作的 Podcast，和韓國學生聊了彼此對 42 Network 的看法。",
      pt: "Participei de um podcast entre a Innovation Academy e a 42 Tokyo, em que conversei com estudantes coreanos sobre a 42 Network.",
    },
  },
  {
    date: { en: "Apr 2023", ja: "2023年4月", zh: "2023 年 4 月", pt: "abr 2023" },
    title: {
      en: "Vim in Practice",
      ja: "実践Vim",
      zh: "Vim 實戰",
      pt: "Vim na Prática",
    },
    org: "Fora da Norma Podcast",
    place: { en: "São Paulo", ja: "サンパウロ", zh: "聖保羅", pt: "São Paulo" },
    description: {
      en: "Produced a Brazilian Portuguese tutorial for 42 São Paulo’s YouTube channel, teaching beginners how to use Vim from the basics.",
      ja: "42 São PauloのYouTubeチャンネル向けに、初心者でもVimの基本を学べるポルトガル語の動画を作りました。",
      zh: "我為 42 São Paulo 的 YouTube 頻道做了一支巴西葡萄牙語的 Vim 入門影片，帶初學者從零開始學習。",
      pt: "Produzi um vídeo em português brasileiro para o canal da 42 São Paulo no YouTube, ensinando Vim do zero.",
    },
    links: [
      {
        label: {
          en: "Watch the tutorial on YouTube",
          ja: "YouTubeで解説動画を見る",
          zh: "在 YouTube 看教學影片",
          pt: "Assistir ao tutorial no YouTube",
        },
        url: "https://www.youtube.com/watch?v=10BSs7UGBtY",
      },
    ],
  },
]

const education: Entry[] = [
  {
    date: years(2024, 2028),
    title: {
      en: "Tokyo University of Foreign Studies",
      ja: "東京外国語大学",
      zh: "東京外國語大學",
      pt: "Universidade de Estudos Estrangeiros de Tóquio",
    },
    org: {
      en: "B.A. Language and Area Studies",
      ja: "言語・地域研究（学士課程）",
      zh: "語言與區域研究（學士）",
      pt: "Bacharelado em Estudos de Línguas e Regiões",
    },
    place: tokyo,
  },
  {
    date: years(2022, 2025),
    title: "École 42",
    org: {
      en: "Computer Software Engineering",
      ja: "ソフトウェアエンジニアリング",
      zh: "軟體工程",
      pt: "Engenharia de Software",
    },
    place: tokyo,
  },
]

const languages: Language[] = [
  {
    name: { en: "Portuguese", ja: "ポルトガル語", zh: "葡萄牙文", pt: "Português" },
    level: { en: "Native", ja: "母語", zh: "母語", pt: "Nativo" },
  },
  { name: { en: "Japanese", ja: "日本語", zh: "日文", pt: "Japonês" }, level: "C2" },
  { name: { en: "English", ja: "英語", zh: "英文", pt: "Inglês" }, level: "C2" },
  { name: { en: "Spanish", ja: "スペイン語", zh: "西班牙文", pt: "Espanhol" }, level: "C1" },
  { name: { en: "Mandarin", ja: "中国語", zh: "中文", pt: "Mandarim" }, level: "B1" },
  { name: { en: "French", ja: "仏語", zh: "法文", pt: "Francês" }, level: "A1" },
]

// Request only the glyphs these entries use: a full CJK family is several megabytes.
// Only untranslated strings carry titleLang/orgLang, so .en is the original text.
const allEntries = [...experience, ...awards, ...hackathons, ...talks, ...education]
const original = (text: Localized) => (typeof text === "string" ? text : text.en)
const cjkFontHref = (family: string, lang: "zh-Hant" | "ko") => {
  const text = allEntries
    .flatMap((entry) => [
      entry.titleLang === lang ? original(entry.title) : "",
      entry.orgLang === lang ? original(entry.org) : "",
    ])
    .join("")
  return `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}&display=swap`
}

// ── Component ──────────────────────────────────────────────────────────────

const Section = ({ title, children }: { title: Localized; children: any }) => (
  <section class="about-section">
    <h2 class="about-section-title">
      <T text={title} />
    </h2>
    {children}
  </section>
)

const HomeProfile: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
  // Label each write-up link with the linked article's own title.
  const articleTitle = (url: string): Localized =>
    allFiles.find((file) => `/${file.slug}` === url)?.frontmatter?.title ?? readWriteUp

  const EntryList = ({ entries }: { entries: Entry[] }) => (
    <ol class="about-entries">
      {entries.map((entry) => (
        <li class="about-entry">
          <p class="about-entry-when">
            {entry.date && (
              <span>
                <T text={entry.date} />
              </span>
            )}
            {entry.place && (
              <span>
                <T text={entry.place} />
              </span>
            )}
          </p>
          <div class="about-entry-body">
            <h3 class="about-entry-title" lang={entry.titleLang}>
              <T text={entry.title} />
            </h3>
            <p class="about-entry-org" lang={entry.orgLang}>
              <T text={entry.org} />
              {entry.detail && (
                <>
                  <span class="about-entry-sep" aria-hidden="true">
                    ·
                  </span>
                  <span class="about-entry-detail">
                    <T text={entry.detail} />
                  </span>
                </>
              )}
            </p>
            {entry.description && (
              <p class="about-entry-desc">
                <T text={entry.description} />
              </p>
            )}
            {entry.articleUrl && (
              <a class="about-entry-link" href={entry.articleUrl}>
                <span class="about-entry-link-label">
                  <T text={{ en: "Write-up", ja: "記事", zh: "文章", pt: "Artigo" }} />
                </span>
                <T text={entry.articleLabel ?? articleTitle(entry.articleUrl)} />
                <span class="about-arrow" aria-hidden="true">
                  {"⁠ →"}
                </span>
              </a>
            )}
            {entry.links?.map((link) => (
              <a class="about-entry-link" href={link.url} target="_blank" rel="noopener noreferrer">
                <T text={link.label} />
                <span class="about-arrow" aria-hidden="true">
                  {"⁠ ↗"}
                </span>
              </a>
            ))}
          </div>
        </li>
      ))}
    </ol>
  )

  return (
    // data-nosnippet: keep these body sections out of Google search snippets so the
    // snippet falls back to the meta description instead of stitching fragments.
    <div class="home-profile" data-nosnippet>
      <link rel="stylesheet" href={cjkFontHref("Noto+Serif+TC", "zh-Hant")} />
      <link rel="stylesheet" href={cjkFontHref("Noto+Sans+KR", "ko")} />
      <Section title={{ en: "Experience", ja: "経歴", zh: "經歷", pt: "Experiência" }}>
        <EntryList entries={experience} />
      </Section>
      <Section title={{ en: "Awards", ja: "受賞・奨学金", zh: "獎項", pt: "Prêmios" }}>
        <EntryList entries={awards} />
      </Section>
      <Section title={{ en: "Hackathons", ja: "ハッカソン", zh: "黑客松", pt: "Hackathons" }}>
        <EntryList entries={hackathons} />
      </Section>
      <Section title={{ en: "Talks", ja: "登壇", zh: "演講與分享", pt: "Palestras" }}>
        <EntryList entries={talks} />
      </Section>
      <Section title={{ en: "Education", ja: "学歴", zh: "學歷", pt: "Formação" }}>
        <EntryList entries={education} />
      </Section>
      <Section title={{ en: "Languages", ja: "言語", zh: "語言能力", pt: "Idiomas" }}>
        <ul class="about-languages">
          {languages.map((lang) => (
            <li>
              <span class="about-language-name">
                <T text={lang.name} />
              </span>
              <span class="about-language-level">
                <T text={lang.level} />
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

HomeProfile.css = style
export default (() => HomeProfile) satisfies QuartzComponentConstructor
