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
  const cjk = ys.map((y) => `${y}年`).join(" – ")
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
  pt: "Engenheiro de desenvolvimento de aplicativos",
}

const experience: Entry[] = [
  {
    date: {
      en: "Aug – Sep 2026",
      ja: "2026年8月〜9月",
      zh: "2026年8月 – 9月",
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
      zh: "配合 Liquid Glass 改版，用 UIKit 更新了 LINE 的貼圖和表情貼畫面，也修正了設定頁在 iOS 26 上跑版的問題，過程中用英文和日文跟設計師討論樣式。另外還做了一個原型，把代幣紀錄的頁尾從 UIKit 改寫成 SwiftUI。",
      pt: "Atualizei as telas de stickers e emojis do LINE em UIKit para o novo visual Liquid Glass e corrigi problemas de layout nas configurações do iOS 26. Conversei com designers em inglês e japonês para acertar os detalhes visuais. Também criei um protótipo para migrar o rodapé do histórico de moedas de UIKit para SwiftUI.",
    },
  },
  {
    date: {
      en: "Aug – Sep 2026",
      ja: "2026年8月〜9月",
      zh: "2026年8月 – 9月",
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
      zh: "用 Apple 的 Foundation Models 和 MeCab 做了一個在裝置端執行的日文名片搜尋概念驗證，可以用自然的句子找到人名和公司。另外也重新設計了 Eight 用 TipKit 做的 Premium 提示，並擴充 Premium 的介紹頁面，兩項都從撰寫規格開始負責。",
      pt: "Desenvolvi uma prova de conceito de busca de cartões de visita em japonês que roda no próprio aparelho, usando o Foundation Models da Apple e o MeCab para encontrar nomes e empresas a partir de frases em linguagem natural. Também reformulei os lembretes do plano premium do Eight, feitos com TipKit, e ampliei a landing page do plano premium, cuidando das especificações de ambos.",
    },
  },
  {
    date: {
      en: "May 2026 – Now",
      ja: "2026年5月〜現在",
      zh: "2026年5月 – 至今",
      pt: "mai 2026 – atual",
    },
    title: {
      en: "Full-Stack Software Engineer",
      ja: "フルスタックエンジニア",
      zh: "全端軟體工程師",
      pt: "Engenheiro de software full-stack",
    },
    org: "BaseMe",
    detail: { en: "Part-time", ja: "アルバイト", zh: "兼職", pt: "Meio período" },
    place: tokyo,
    description: {
      en: "Built features for BaseMe’s AI career chat, such as using your notes as context and stopping a reply, and redesigned how company recommendations appear. Also added profile view counts to help students get noticed by recruiters.",
      ja: "BaseMeのAIキャリアチャットに、メモの内容を回答に反映する機能や、回答を途中で止める機能を追加しました。おすすめ企業の表示方法も見直しました。また、学生が採用担当者に見つけてもらいやすくなるよう、プロフィールの閲覧数を表示する機能も作りました。",
      zh: "為 BaseMe 的 AI 職涯聊天開發了多項功能，例如讓 AI 參考使用者的筆記來回答、可以中途停止回覆，也重新設計了企業推薦的呈現方式。另外還加上個人頁面的瀏覽次數，讓學生更容易被招募人員注意到。",
      pt: "Desenvolvi recursos para o chat de carreira com IA da BaseMe, como respostas que usam as anotações do usuário como contexto e a opção de interromper uma resposta. Também redesenhei a forma como as empresas recomendadas aparecem e adicionei um contador de visualizações ao perfil para ajudar estudantes a chamar a atenção de recrutadores.",
    },
  },
  {
    date: {
      en: "Jan – Apr 2026",
      ja: "2026年1月〜4月",
      zh: "2026年1月 – 4月",
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
      zh: "FamilyAlbum 有一項會辨識家人、推薦適合放進相簿照片的 AI 功能，我為它加上依國家限制使用的機制，只在法規允許的地區開放，並用 Swift Testing 測試快取的定位判斷。另外也配合 iOS 26，把 PanModal 換成系統原生的 sheet。",
      pt: "No FamilyAlbum, implementei restrições por país em um recurso de IA que reconhece familiares e sugere fotos para álbuns, permitindo seu uso apenas onde a legislação autoriza. Usei Swift Testing para testar as verificações de localização armazenadas em cache. Também substituí o PanModal pelas sheets nativas do iOS 26.",
    },
  },
  {
    date: years(2025, 2026),
    title: {
      en: "Google Student Ambassador",
      ja: "Google 学生アンバサダー",
      zh: "Google 學生大使",
      pt: "Embaixador estudantil do Google",
    },
    org: "Google Japan",
    place: tokyo,
    description: {
      en: "Part of the program’s first cohort, sharing everyday AI use cases with more than 1,000 followers. Helped fellow university students learn to use AI safely and effectively.",
      ja: "Google 学生アンバサダーの第1期生として、日常でのAIの使い方を1,000人以上のフォロワーに紹介しました。また、大学生がAIを安全に、うまく活用できるようサポートしました。",
      zh: "作為這個計畫的第一屆大使，向超過 1,000 位追蹤者分享 AI 在日常生活中的用法，也幫助大學同學安全、有效地使用 AI。",
      pt: "Fiz parte da primeira turma de embaixadores estudantis do Google, compartilhando formas de usar IA no dia a dia com mais de 1.000 seguidores. Também ajudei outros universitários a usar IA com segurança e de forma prática.",
    },
  },
]

const awards: Entry[] = [
  {
    date: years(2026),
    title: {
      en: "Swift Student Challenge Winner",
      ja: "Swift Student Challenge 受賞",
      zh: "Swift Student Challenge 得獎",
      pt: "Vencedor do Swift Student Challenge",
    },
    org: "Apple",
    description: {
      en: "Selected for an app that impressed and inspired Apple with its creativity, technical skill, and thoughtful design.",
      ja: "アイデアの独自性や技術力、細部までこだわったデザインが評価され、受賞しました。",
      zh: "以兼具創意、技術實力與用心設計的 App 打動 Apple 而獲選。",
      pt: "Fui premiado por um app que chamou a atenção da Apple pela criatividade, qualidade técnica e cuidado com o design.",
    },
  },
  {
    date: years(2023),
    title: {
      en: "MEXT Undergraduate Scholarship",
      ja: "国費外国人留学生（学部）",
      zh: "日本政府獎學金（大學部）",
      pt: "Bolsa MEXT para graduação",
    },
    org: {
      en: "Ministry of Education of Japan",
      ja: "文部科学省",
      zh: "日本文部科學省",
      pt: "Ministério da Educação do Japão",
    },
    description: {
      en: "Awarded through embassy recommendation, covering full tuition, living expenses, and travel for undergraduate studies in Japan.",
      ja: "大使館推薦で国費留学生に採用されました。授業料の免除に加え、生活費と渡航費の支給を受けています。",
      zh: "經大使館推薦獲選，全額補助在日本就讀大學的學費、生活費與往返機票。",
      pt: "Recebi a bolsa MEXT por recomendação da embaixada. Ela cobre as taxas universitárias, oferece auxílio mensal para viver no Japão e inclui as passagens aéreas.",
    },
  },
]

const hackathons: Entry[] = [
  {
    date: { en: "Jun 2026", ja: "2026年6月", zh: "2026年6月", pt: "jun 2026" },
    title: "Build with OpenAI Hackathon",
    org: "OpenAI",
    detail: { en: "Finalist", ja: "ファイナリスト", zh: "決賽入圍", pt: "Finalista" },
    place: tokyo,
  },
  {
    date: { en: "Jun 2026", ja: "2026年6月", zh: "2026年6月", pt: "jun 2026" },
    title: "SDGs to Startups Hackathon",
    org: "Tokyo AI",
    detail: { en: "1st Place", ja: "優勝", zh: "第一名", pt: "1º lugar" },
    place: tokyo,
  },
  {
    date: { en: "Apr 2026", ja: "2026年4月", zh: "2026年4月", pt: "abr 2026" },
    title: "try! Swift Tokyo Hackathon",
    org: { en: "Mercari", ja: "メルカリ", zh: "Mercari", pt: "Mercari" },
    detail: { en: "Winner", ja: "受賞", zh: "得獎", pt: "Vencedor" },
    place: tokyo,
  },
  {
    date: { en: "Sep 2024", ja: "2024年9月", zh: "2024年9月", pt: "set 2024" },
    title: "24-Hour Hackathon by 42 Asia",
    org: "SUTD & 42 Asia",
    detail: { en: "2nd Place", ja: "準優勝", zh: "第二名", pt: "2º lugar" },
    place: seoul,
  },
]

const talks: Entry[] = [
  {
    date: { en: "Jul 2026", ja: "2026年7月", zh: "2026年7月", pt: "jul 2026" },
    title: "如何贏得 Swift Student Challenge",
    titleLang: "zh-Hant",
    org: "iPlayground Taiwan",
    place: { en: "Taipei", ja: "台北", zh: "台北", pt: "Taipé" },
    description: {
      en: "A talk on turning a personal story into a winning Swift Playground, covering how to find an idea only you could build, grow SwiftUI skills under real project constraints, and use attention to detail to raise a submission from good to winning.",
      ja: "自分の体験をSwift Playgroundの作品にした過程を紹介しました。自分ならではのアイデアの見つけ方や、制約のある中でSwiftUIのスキルを磨く方法、細部まで工夫して作品の完成度を高めることについて話しました。",
      zh: "分享如何把個人故事變成得獎的 Swift Playground：找到只有自己做得出來的點子、在真實專案的限制下精進 SwiftUI，以及用對細節的講究，讓作品從「不錯」躍升為得獎之作。",
      pt: "Compartilhei como transformei uma história pessoal em um Swift Playground premiado. Falei sobre encontrar uma ideia própria, aprimorar minhas habilidades em SwiftUI mesmo com as limitações de um projeto real e cuidar dos detalhes que fizeram diferença no resultado.",
    },
    links: [
      {
        label: {
          en: "Watch the talk on YouTube",
          ja: "YouTubeで講演を見る",
          zh: "在 YouTube 觀看演講",
          pt: "Assistir à palestra no YouTube",
        },
        url: "https://www.youtube.com/watch?v=t9sC0nL-uTA",
      },
      {
        label: {
          en: "Covered by the LY Corporation Tech Blog",
          ja: "LINEヤフーのTech Blogで紹介",
          zh: "LY Corporation 技術部落格報導",
          pt: "Destaque no Tech Blog da LY Corporation",
        },
        url: "https://techblog.lycorp.co.jp/zh-hant/TWC-2026-iPlayground-Apple-Developer-Conference",
      },
    ],
  },
  {
    date: { en: "Apr 2026", ja: "2026年4月", zh: "2026年4月", pt: "abr 2026" },
    title: {
      en: "MEXT Scholarship Speaker",
      ja: "国費留学の体験談",
      zh: "日本政府獎學金分享講者",
      pt: "Minha experiência com a bolsa MEXT",
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
      zh: "在日本國駐聖保羅總領事館的線上講座中，向有意申請的學生分享我的日本政府獎學金經驗。",
      pt: "Participei de um webinar do Consulado-Geral do Japão em São Paulo para contar minha experiência com a bolsa MEXT a estudantes interessados em estudar no Japão.",
    },
    links: [
      {
        label: {
          en: "Watch the webinar on YouTube",
          ja: "YouTubeでウェビナーを見る",
          zh: "在 YouTube 觀看講座",
          pt: "Assistir ao webinar no YouTube",
        },
        url: "https://www.youtube.com/watch?v=3_t0S7yOug0",
      },
    ],
  },
  {
    date: { en: "Jan 2024", ja: "2024年1月", zh: "2024年1月", pt: "jan 2024" },
    title: "The 42 Live Radio Show",
    org: "이노베이션 아카데미",
    orgLang: "ko",
    place: seoul,
    description: {
      en: "Joined a cross-campus podcast between Innovation Academy and 42 Tokyo, exchanging perspectives on the 42 Network with Korean students.",
      ja: "Innovation Academyと42 Tokyoの合同ポッドキャストに出演し、韓国の学生と42 Networkについて話しました。",
      zh: "參與 Innovation Academy 與 42 Tokyo 的跨校區 Podcast，和韓國學生交流對 42 Network 的看法。",
      pt: "Participei de um podcast entre a Innovation Academy e a 42 Tokyo, em que conversei com estudantes coreanos sobre a 42 Network.",
    },
  },
  {
    date: { en: "Apr 2023", ja: "2023年4月", zh: "2023年4月", pt: "abr 2023" },
    title: "Vim na Prática",
    org: "Fora da Norma Podcast",
    place: { en: "São Paulo", ja: "サンパウロ", zh: "聖保羅", pt: "São Paulo" },
    description: {
      en: "Produced a Brazilian Portuguese tutorial for 42 São Paulo’s YouTube channel, teaching beginners how to use Vim from the basics.",
      ja: "42 São PauloのYouTubeチャンネル向けに、初心者でもVimの基本を学べるポルトガル語の動画を作りました。",
      zh: "為 42 São Paulo 的 YouTube 頻道製作巴西葡萄牙語教學，帶初學者從基礎開始學 Vim。",
      pt: "Produzi um vídeo em português brasileiro para o canal da 42 São Paulo no YouTube, ensinando Vim do zero.",
    },
    links: [
      {
        label: {
          en: "Watch the tutorial on YouTube",
          ja: "YouTubeで解説動画を見る",
          zh: "在 YouTube 觀看教學",
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
      zh: "語言與區域研究學士",
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
  { name: { en: "French", ja: "フランス語", zh: "法文", pt: "Francês" }, level: "A1" },
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

const readWriteUp: Localized = {
  en: "Read the write-up",
  ja: "記事を読む",
  zh: "閱讀文章",
  pt: "Ler o artigo",
}

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
                <T text={articleTitle(entry.articleUrl)} />
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
      <Section title={{ en: "Awards", ja: "受賞", zh: "獎項", pt: "Prêmios" }}>
        <EntryList entries={awards} />
      </Section>
      <Section title={{ en: "Hackathons", ja: "ハッカソン", zh: "黑客松", pt: "Hackathons" }}>
        <EntryList entries={hackathons} />
      </Section>
      <Section title={{ en: "Talks", ja: "登壇", zh: "演講", pt: "Palestras" }}>
        <EntryList entries={talks} />
      </Section>
      <Section title={{ en: "Education", ja: "学歴", zh: "學歷", pt: "Formação" }}>
        <EntryList entries={education} />
      </Section>
      <Section title={{ en: "Languages", ja: "言語", zh: "語言", pt: "Idiomas" }}>
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
