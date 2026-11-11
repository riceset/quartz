import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { Localized, T } from "./localized"
import style from "./styles/homeToolkit.scss"

// Tool names stay as written in every language; only the headings are translated.
const groups: { id: string; title: Localized; tools: string[] }[] = [
  {
    id: "development",
    title: { en: "Development", ja: "開発ツール", zh: "開發工具", pt: "Desenvolvimento" },
    tools: [
      "Neovim",
      "Git",
      "GitHub",
      "Claude Code",
      "Ghostty",
      "tmux",
      "Homebrew",
      "Codex",
      "Cursor",
      "gstack",
      "Docker",
      "Firebase",
      "SQLite",
      "AWS",
      "GitHub Pages",
      "LLDB",
      "MeCab",
      "Terraform",
      "yabai",
    ],
  },
  {
    id: "languages",
    title: { en: "Languages", ja: "言語", zh: "語言", pt: "Linguagens" },
    tools: [
      "Swift",
      "C++",
      "C",
      "TypeScript",
      "Python",
      "JavaScript",
      "Shell",
      "SQL",
      "HTML",
      "CSS",
      "Ruby",
      "Go",
      "SCSS",
      "Rust",
      "Lua",
      "LaTeX",
    ],
  },
  {
    id: "apple-technologies",
    title: {
      en: "Apple Technologies",
      ja: "Apple テクノロジー",
      zh: "Apple 技術",
      pt: "Tecnologias da Apple",
    },
    tools: [
      "Xcode",
      "SwiftUI",
      "UIKit",
      "Swift Concurrency",
      "SwiftData",
      "Combine",
      "XCTest",
      "Swift Testing",
      "SwiftPM",
      "TestFlight",
      "Foundation Models",
      "MapKit",
      "TipKit",
      "Image Playground",
    ],
  },
  {
    id: "frameworks",
    title: {
      en: "Frameworks",
      ja: "フレームワーク",
      zh: "框架",
      pt: "Frameworks",
    },
    tools: ["React", "Ruby on Rails", "Django", "Flask", "Quartz"],
  },
  {
    id: "testing",
    title: {
      en: "Testing & Automation",
      ja: "テスト・自動化",
      zh: "測試與自動化",
      pt: "Testes e automação",
    },
    tools: ["GitHub Actions", "CI/CD", "Make", "Valgrind"],
  },
  {
    id: "collaboration",
    title: { en: "Collaboration", ja: "コラボレーション", zh: "協作工具", pt: "Colaboração" },
    tools: ["Slack", "Figma", "Notion", "Linear", "Jira", "Confluence", "Miro", "Discord"],
  },
  {
    id: "personal",
    title: { en: "Personal", ja: "個人用ツール", zh: "個人工具", pt: "Pessoal" },
    tools: [
      "Arc",
      "Obsidian",
      "Alfred",
      "Craft",
      "Apple Calendar",
      "Spotify",
      "Motra",
      "Budget Flow",
      "Eki Bright",
      "Tot",
      "AirBuddy",
      "Muse",
      "Procreate",
    ],
  },
  {
    id: "language-learning",
    title: {
      en: "Language Learning",
      ja: "語学学習",
      zh: "語言學習",
      pt: "Aprendizado de idiomas",
    },
    tools: ["Anki", "Dictionaries", "Pleco"],
  },
]

// Official sites, or the canonical docs where a tool has no site of its own. Languages
// are left unlinked.
const links: Record<string, string> = {
  Xcode: "https://developer.apple.com/xcode/",
  Neovim: "https://neovim.io/",
  Ghostty: "https://ghostty.org/",
  tmux: "https://github.com/tmux/tmux",
  yabai: "https://github.com/asmvik/yabai",
  "Claude Code": "https://www.anthropic.com/claude-code",
  Codex: "https://openai.com/codex/",
  Cursor: "https://cursor.com/",
  gstack: "https://github.com/garrytan/gstack",
  Git: "https://git-scm.com/",
  GitHub: "https://github.com/",
  Docker: "https://www.docker.com/",
  Homebrew: "https://brew.sh/",
  LLDB: "https://lldb.llvm.org/",
  SwiftPM: "https://www.swift.org/documentation/package-manager/",
  TestFlight: "https://developer.apple.com/testflight/",
  SwiftUI: "https://developer.apple.com/xcode/swiftui/",
  UIKit: "https://developer.apple.com/documentation/uikit",
  SwiftData: "https://developer.apple.com/xcode/swiftdata/",
  "Swift Concurrency":
    "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/",
  Combine: "https://developer.apple.com/documentation/combine",
  "Foundation Models": "https://developer.apple.com/documentation/foundationmodels",
  TipKit: "https://developer.apple.com/documentation/tipkit",
  MapKit: "https://developer.apple.com/documentation/mapkit",
  "Image Playground": "https://developer.apple.com/documentation/imageplayground",
  React: "https://react.dev/",
  "Ruby on Rails": "https://rubyonrails.org/",
  Flask: "https://flask.palletsprojects.com/",
  Django: "https://www.djangoproject.com/",
  Quartz: "https://quartz.jzhao.xyz/",
  MeCab: "https://taku910.github.io/mecab/",
  SQLite: "https://sqlite.org/",
  Firebase: "https://firebase.google.com/",
  AWS: "https://aws.amazon.com/",
  Terraform: "https://developer.hashicorp.com/terraform",
  "GitHub Pages": "https://pages.github.com/",
  XCTest: "https://developer.apple.com/documentation/xctest",
  "Swift Testing": "https://developer.apple.com/xcode/swift-testing/",
  "GitHub Actions": "https://github.com/features/actions",
  "CI/CD": "https://en.wikipedia.org/wiki/CI/CD",
  Valgrind: "https://valgrind.org/",
  Make: "https://www.gnu.org/software/make/",
  Linear: "https://linear.app/",
  Figma: "https://www.figma.com/",
  Notion: "https://www.notion.com/",
  Slack: "https://slack.com/",
  Discord: "https://discord.com/",
  Miro: "https://miro.com/",
  Jira: "https://www.atlassian.com/software/jira",
  Confluence: "https://www.atlassian.com/software/confluence",
  Arc: "https://arc.net/",
  Craft: "https://www.craft.do/",
  Obsidian: "https://obsidian.md/",
  Muse: "https://apps.apple.com/app/id6760173601",
  "Apple Calendar": "https://support.apple.com/guide/calendar/welcome/mac",
  Spotify: "https://www.spotify.com/",
  Motra: "https://motra.com/",
  "Budget Flow": "https://budget-flow.app/",
  "Eki Bright": "https://apps.apple.com/app/id6504702463",
  Tot: "https://tot.rocks/",
  AirBuddy: "https://v2.airbuddy.app/",
  Alfred: "https://www.alfredapp.com/",
  Procreate: "https://procreate.com/",
  Anki: "https://apps.ankiweb.net/",
  Pleco: "https://www.pleco.com/",
  Dictionaries: "https://www.monokakido.jp/en/dictionaries/app/",
}

// Sections reuse About's heading styles (homeProfile.scss); each heading carries a count
// of its tools, with the names gridded beneath. A div, not <header>: Quartz styles
// every <header> as the page header.
const HomeToolkit: QuartzComponent = () => (
  <div class="home-toolkit" data-nosnippet>
    <h1 class="home-toolkit-title">
      <T text={{ en: "Toolkit", ja: "ツール", zh: "工具箱", pt: "Ferramentas" }} />
    </h1>
    {groups.map(({ id, title, tools }, i) => (
      <section class="about-section toolkit-group" aria-labelledby={id} style={`--i: ${i}`}>
        <div class="toolkit-group-head">
          <h2 class="about-section-title" id={id}>
            <T text={title} />
          </h2>
          <span class="toolkit-group-count" aria-hidden="true">
            {String(tools.length).padStart(2, "0")}
          </span>
        </div>
        <ul class="toolkit-list" lang="en">
          {tools.map((tool) => (
            <li>
              {links[tool] ? (
                <a
                  class="toolkit-link"
                  href={links[tool]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tool}
                </a>
              ) : (
                tool
              )}
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
)

HomeToolkit.css = style

export default (() => HomeToolkit) satisfies QuartzComponentConstructor
