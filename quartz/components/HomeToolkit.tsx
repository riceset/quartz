import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { Localized, T } from "./localized"
import style from "./styles/homeToolkit.scss"

// Tool names stay as written in every language; only the headings are translated.
const groups: { id: string; title: Localized; tools: string[] }[] = [
  {
    id: "development",
    title: { en: "Development", ja: "開発ツール", zh: "開發工具", pt: "Desenvolvimento" },
    tools: [
      "Xcode",
      "Neovim",
      "Ghostty",
      "tmux",
      "yabai",
      "Claude Code",
      "Codex",
      "gstack",
      "Git",
      "GitHub",
      "Docker",
      "Homebrew",
      "LLDB",
      "SwiftPM",
      "TestFlight",
    ],
  },
  {
    id: "programming-languages",
    title: {
      en: "Programming Languages",
      ja: "プログラミング言語",
      zh: "程式語言",
      pt: "Linguagens de programação",
    },
    tools: [
      "Swift",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "SCSS",
      "C",
      "C++",
      "Python",
      "Ruby",
      "Go",
      "Lua",
      "SQL",
      "Shell",
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
      "SwiftUI",
      "UIKit",
      "SwiftData",
      "Swift Concurrency",
      "Combine",
      "Foundation Models",
      "TipKit",
      "MapKit",
    ],
  },
  {
    id: "frameworks",
    title: {
      en: "Frameworks & Technologies",
      ja: "フレームワーク・技術",
      zh: "框架與技術",
      pt: "Frameworks e tecnologias",
    },
    tools: [
      "React",
      "Ruby on Rails",
      "Flask",
      "Django",
      "Quartz",
      "MeCab",
      "SQLite",
      "Firebase",
      "AWS",
      "GitHub Pages",
    ],
  },
  {
    id: "testing",
    title: {
      en: "Testing & Automation",
      ja: "テスト・自動化",
      zh: "測試與自動化",
      pt: "Testes e automação",
    },
    tools: ["XCTest", "Swift Testing", "GitHub Actions", "CI/CD", "Valgrind", "Make"],
  },
  {
    id: "collaboration",
    title: { en: "Collaboration", ja: "コラボレーション", zh: "協作工具", pt: "Colaboração" },
    tools: ["Linear", "Figma", "Notion", "Slack", "Discord", "Miro", "Jira", "Confluence"],
  },
  {
    id: "personal",
    title: { en: "Personal", ja: "個人用ツール", zh: "個人工具", pt: "Pessoal" },
    tools: [
      "Arc",
      "Craft",
      "Obsidian",
      "Muse",
      "Apple Calendar",
      "Spotify",
      "Tot",
      "AirBuddy",
      "Alfred 5",
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
    tools: ["Anki", "Pleco"],
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
  React: "https://react.dev/",
  "Ruby on Rails": "https://rubyonrails.org/",
  Flask: "https://flask.palletsprojects.com/",
  Django: "https://www.djangoproject.com/",
  Quartz: "https://quartz.jzhao.xyz/",
  MeCab: "https://taku910.github.io/mecab/",
  SQLite: "https://sqlite.org/",
  Firebase: "https://firebase.google.com/",
  AWS: "https://aws.amazon.com/",
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
  Muse: "https://museapp.com/",
  "Apple Calendar": "https://support.apple.com/guide/calendar/welcome/mac",
  Spotify: "https://www.spotify.com/",
  Tot: "https://tot.rocks/",
  AirBuddy: "https://v2.airbuddy.app/",
  "Alfred 5": "https://www.alfredapp.com/",
  Procreate: "https://procreate.com/",
  Anki: "https://apps.ankiweb.net/",
  Pleco: "https://www.pleco.com/",
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
