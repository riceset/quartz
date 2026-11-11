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
      zh: "全端工程師",
      pt: "Engenheiro de Software Full-Stack",
    },
    org: "BaseMe",
    detail: { en: "Part-time", ja: "アルバイト", zh: "兼職", pt: "Meio Período" },
    place: tokyo,
    description: {
      en: "Built features for BaseMe’s AI career chat, such as using your notes as context and stopping a reply, and redesigned how company recommendations appear. Also added profile view counts to help students get noticed by recruiters.",
      ja: "BaseMeのAIキャリアチャットで、学生のメモを回答に反映する機能と、回答を途中で止められる機能を追加しました。おすすめ企業の表示も新しいデザインに合わせて変更しました。また、学生が自分のプロフィールの閲覧数を確認できるようにしました。",
      zh: "為 BaseMe 的 AI 職涯聊天新增兩項功能：回答時參考學生的筆記，以及讓學生能中途停止生成回答。也依新版設計調整推薦企業區塊，並讓學生能查看自己個人檔案的瀏覽次數。",
      pt: "No assistente de carreira com IA da BaseMe, fiz com que as respostas levassem em conta as anotações dos estudantes e adicionei a opção de interromper respostas em andamento. Também implementei o novo design da seção de empresas recomendadas e incluí a contagem de visualizações nos perfis dos estudantes.",
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
      en: "Updated LINE’s sticker and emoji settings screens in UIKit for the Liquid Glass redesign and fixed layout issues that appeared in iOS 26, refining the details with designers in English and Japanese. Also prototyped migrating the currency-history footer from UIKit to SwiftUI.",
      ja: "LINEのスタンプ・絵文字設定画面をLiquid Glassのデザインに合わせてUIKitで改修し、iOS 26で発生したレイアウトの問題も修正しました。デザイナーと日本語・英語で相談しながら、UIの細かな部分も調整しました。また、コイン履歴画面のフッターをUIKitからSwiftUIへ移行するためのプロトタイプも作成しました。",
      zh: "配合 Liquid Glass 的設計，以 UIKit 更新 LINE 的貼圖與表情貼設定畫面，並修正 iOS 26 的版面問題。與設計師以日文和英文討論畫面細節，依討論結果調整 UI。另外，也製作了將代幣紀錄畫面的底部區塊由 UIKit 改用 SwiftUI 的原型。",
      pt: "Adaptei as telas de configuração de stickers e emojis do LINE ao design Liquid Glass usando UIKit e corrigi problemas de layout que surgiram no iOS 26. Conversei com os designers em japonês e inglês para ajustar os detalhes da interface. Também criei um protótipo para migrar o rodapé da tela de histórico de moedas de UIKit para SwiftUI.",
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
      en: "Built a proof of concept for on-device Japanese contact search with Apple’s Foundation Models and MeCab, matching natural-language queries to names and companies. At Eight, also revised when its TipKit Premium tips appear and removed an unneeded toolbar from the Premium screen to give its web page more room, writing the specs for both.",
      ja: "AppleのFoundation ModelsとMeCabを使い、端末上で動く日本語の名刺検索の概念実証を開発しました。自然言語で入力すると、名前や会社名を探せる仕組みです。また、EightではTipKitを使ったプレミアムプランの案内の表示ルールを見直し、紹介画面の不要なツールバーを取り除いてWebページの表示領域を広げました。どちらも仕様書の作成から担当しました。",
      zh: "使用 Apple 的 Foundation Models 和 MeCab，開發了在裝置端執行的概念驗證，讓使用者能用日文句子搜尋名片。在 Eight，調整了以 TipKit 呈現的 Premium 方案提示規則，也移除 Premium 介紹畫面中不必要的工具列，讓網頁有更多顯示空間。負責兩項修改的實作與規格書。",
      pt: "Desenvolvi uma prova de conceito para buscar cartões de visita a partir de queries em japonês, usando o framework Foundation Models da Apple e o MeCab no próprio aparelho. A busca interpreta frases em linguagem natural para encontrar contatos por nome ou empresa. No Eight, revisei as regras de exibição de um aviso sobre o plano premium criado com TipKit e removi a barra de ferramentas da tela de apresentação do plano, ampliando o espaço disponível para a página web. Escrevi as especificações dessas duas mudanças antes de implementá-las.",
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
      en: "For FamilyAlbum, I restricted an AI feature that identifies family members in photos and suggests photos for albums to countries where it could legally be offered. I cached country lookup results to avoid repeated API calls and used Swift Testing to cover allowed, blocked, and unknown-country cases. I also replaced PanModal with native iOS sheets after it ran into issues on iOS 26.",
      ja: "「家族アルバム みてね」では、写真に写った家族を認識してアルバム用の写真を提案するAI機能について、法的な要件に合わせて利用できる国を制限しました。国の判定結果をキャッシュしてAPIへの問い合わせを減らし、対応国・非対応国・国を判定できない場合の動作をSwift Testingでテストしました。また、iOS 26で不具合が出ていたPanModalをiOS標準のシートに置き換えました。",
      zh: "在「家家相簿」（FamilyAlbum），為 AI 照片推薦功能加入國別使用限制。這項功能會辨識照片中的家人，推薦適合放進相簿的照片；加入限制後，只會在法規允許的國家提供。將國家判定結果存入快取，以減少重複呼叫 API，並用 Swift Testing 測試可使用、不可使用及無法判定國家的情況。PanModal 在 iOS 26 出現問題後，也將相關畫面改用 iOS 原生的 sheet。",
      pt: "No FamilyAlbum, implementei restrições por país para um recurso de IA que identifica familiares nas fotos e sugere imagens para álbuns. O recurso ficou limitado aos países onde podia ser oferecido legalmente. Armazenei em cache o resultado da verificação do país para evitar consultas repetidas à API e usei Swift Testing para testar os casos de acesso permitido, negado e país não identificado. Também substituí o PanModal pelas sheets nativas do iOS depois que ele apresentou problemas no iOS 26.",
    },
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
      ja: "アイデアの独自性や技術力、細部までこだわったデザインがAppleに評価されました。",
      zh: "從 0 到 1 自己構想並開發的 app，獲 Apple 選為 Swift Student Challenge 得獎者。從技術實作到設計細節都用心琢磨，打造完整流暢的使用者體驗。",
      pt: "Fui premiado pela Apple no Swift Student Challenge por um app que desenvolvi a partir de uma ideia original, com atenção aos detalhes da implementação e do design.",
    },
    articleUrl: "/Swift-Student-Challenge-2026",
    articleLabel: "Swift Student Challenge",
  },
  {
    date: years(2023),
    title: {
      en: "MEXT Undergraduate Scholarship",
      ja: "国費外国人留学生",
      zh: "日本政府獎學金",
      pt: "Bolsa MEXT (Graduação)",
    },
    org: {
      en: "Ministry of Education of Japan",
      ja: "文部科学省",
      zh: "日本文部科學省",
      pt: "Ministério da Educação do Japão",
    },
    description: {
      en: "Awarded through embassy recommendation, covering full tuition, living expenses, and travel for undergraduate studies in Japan.",
      ja: "大使館推薦で国費留学生（学部）に選ばれ、2023年に来日しました。",
      zh: "2023 年經日本大使館推薦，獲得獎學金並赴日留學。",
      pt: "Fui selecionado para a bolsa MEXT de graduação após receber a recomendação da embaixada.",
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

const community: Entry[] = [
  {
    date: {
      en: "Oct 2026 – Present",
      ja: "2026年10月〜現在",
      zh: "2026 年 10 月至今",
      pt: "out 2026 – atual",
    },
    title: {
      en: "Frontend Team Member",
      ja: "フロントエンドチームメンバー",
      zh: "前端團隊成員",
      pt: "Integrante da Equipe de Front-end",
    },
    org: "GDG on Campus Waseda University",
    detail: {
      en: "Student Organization",
      ja: "学生団体",
      zh: "學生社團",
      pt: "Organização estudantil",
    },
    place: tokyo,
    description: {
      en: "Member of the frontend team at Waseda University's Google-supported student developer community.",
      ja: "早稲田大学のGoogleが支援する学生デベロッパーコミュニティで、フロントエンドチームのメンバーとして活動しています。",
      zh: "在 Google 支持的早稻田大學學生開發者社群中，擔任前端團隊成員。",
      pt: "Faço parte da equipe de front-end da comunidade estudantil de desenvolvedores da Universidade Waseda, apoiada pelo Google.",
    },
  },
  {
    date: {
      en: "Aug 2025 – Feb 2026",
      ja: "2025年8月〜2026年2月",
      zh: "2025 年 8 月至 2026 年 2 月",
      pt: "ago 2025 – fev 2026",
    },
    title: {
      en: "Google Student Ambassador",
      ja: "Google 学生アンバサダー",
      zh: "Google 學生大使",
      pt: "Embaixador Estudantil do Google",
    },
    org: "Google Japan",
    detail: {
      en: "Ambassador Program",
      ja: "アンバサダープログラム",
      zh: "大使計畫",
      pt: "Programa de Embaixadores",
    },
    place: tokyo,
    description: {
      en: "Part of the program’s first cohort, sharing everyday AI use cases with more than 1,000 followers. Helped fellow university students learn to use AI safely and effectively.",
      ja: "Google 学生アンバサダーの第1期生として、1,000人以上のフォロワーに向けて、日常でのAIの使い方を発信しました。また、大学生がAIを安全にうまく活用できるよう支援しました。",
      zh: "作為 Google 學生大使計畫的首屆成員，向超過 1,000 名追蹤者分享日常生活中如何使用 AI，也協助大學生更安全、有效地使用 AI。",
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
          zh: "觀看電視新聞報導（YouTube）",
          pt: "Reportagem de TV no YouTube",
        },
        url: "https://www.youtube.com/watch?v=1IyzO2LOErc",
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
    place: { en: "Taipei", ja: "台北", zh: "臺北", pt: "Taipei" },
    description: {
      en: "A talk on turning a personal story into a winning Swift Playground, covering how to find an idea only you could build, grow SwiftUI skills under real project constraints, and use attention to detail to raise a submission from good to winning.",
      ja: "Swift Student Challengeで受賞したSwift Playgroundを題材に、自分の経験からアイデアを見つけ、SwiftUIで試行錯誤しながら作品を作り上げた過程を紹介しました。",
      zh: "我分享了如何從自己的經歷找到靈感，做出在 Swift Student Challenge 得獎的 Swift Playground，也談了用 SwiftUI 開發時的嘗試，以及反覆調整作品細節的過程。",
      pt: "Mostrei como uma experiência pessoal deu origem a um Swift Playground premiado. Falei sobre a escolha da ideia, os desafios de desenvolver em SwiftUI e os detalhes que fizeram diferença na versão final.",
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
      zh: "在日本駐聖保羅總領事館舉辦的線上講座中，向有意申請 MEXT 獎學金的學生分享留學經驗。",
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
      ja: "Innovation Academyと42 Tokyoのポッドキャストに出演し、韓国の学生と42 Networkについて話しました。",
      zh: "參與 Innovation Academy 與 42 Tokyo 合作的 Podcast 節目，和韓國學生交流對 42 Network 的看法。",
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
      en: "Produced and presented a Brazilian Portuguese introduction to Vim for Fora da Norma, 42 São Paulo’s podcast.",
      ja: "42 São Pauloのポッドキャスト「Fora da Norma」で、Vim入門動画を制作し、ポルトガル語で解説しました。",
      zh: "為 42 São Paulo 的 Podcast 節目《Fora da Norma》製作 Vim 入門影片，並以葡萄牙語講解。",
      pt: "Produzi e apresentei um vídeo de introdução ao Vim em português para o podcast Fora da Norma, da 42 São Paulo.",
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
const allEntries = [...experience, ...awards, ...community, ...hackathons, ...talks, ...education]
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

const Section = ({ id, title, children }: { id: string; title: Localized; children: any }) => (
  <section class="about-section" aria-labelledby={id}>
    <h2 class="about-section-title" id={id}>
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
      <Section id="experience" title={{ en: "Experience", ja: "経歴", zh: "經歷", pt: "Experiência" }}>
        <EntryList entries={experience} />
      </Section>
      <Section id="awards" title={{ en: "Awards", ja: "受賞・奨学金", zh: "獎項", pt: "Prêmios" }}>
        <EntryList entries={awards} />
      </Section>
      <Section id="community" title={{ en: "Community", ja: "コミュニティー", zh: "社群", pt: "Comunidade" }}>
        <EntryList entries={community} />
      </Section>
      <Section id="hackathons" title={{ en: "Hackathons", ja: "ハッカソン", zh: "黑客松", pt: "Hackathons" }}>
        <EntryList entries={hackathons} />
      </Section>
      <Section id="talks" title={{ en: "Talks", ja: "登壇", zh: "演講與分享", pt: "Palestras" }}>
        <EntryList entries={talks} />
      </Section>
      <Section id="education" title={{ en: "Education", ja: "学歴", zh: "學歷", pt: "Formação" }}>
        <EntryList entries={education} />
      </Section>
      <Section id="languages" title={{ en: "Languages", ja: "言語", zh: "語言能力", pt: "Idiomas" }}>
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
