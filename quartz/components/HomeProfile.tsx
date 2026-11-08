import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/homeProfile.scss"

// ── Data ───────────────────────────────────────────────────────────────────

// Every section is a list of the same kind of entry: a date in the margin, a title,
// the organization line, and an optional description with follow-up links.
interface Entry {
  date?: string
  title: string
  org: string
  // BCP 47 tags for a title or org not written in English, so CJK picks up its webfont.
  titleLang?: string
  orgLang?: string
  detail?: string
  place?: string
  description?: string
  articleUrl?: string
  // External follow-ups listed under the description, e.g. a recording or press.
  links?: { label: string; url: string }[]
}

interface Language {
  name: string
  level: string
}

const experience: Entry[] = [
  {
    date: "Aug – Sep 2026",
    title: "Application Development Engineer",
    org: "LY Corporation",
    detail: "Internship",
    place: "Fukuoka",
    articleUrl: "/LINE-Internship",
    description:
      "Updated LINE's sticker and emoji screens in UIKit for the Liquid Glass redesign and fixed iOS 26 layout issues in settings, aligning on styling with designers in English and Japanese. Also prototyped migrating the currency-history footer from UIKit to SwiftUI.",
  },
  {
    date: "Aug – Sep 2026",
    title: "Application Development Engineer",
    org: "Sansan",
    detail: "Internship",
    place: "Tokyo",
    articleUrl: "/Sansan-Internship",
    description:
      "Built a proof of concept for on-device Japanese contact search with Apple’s Foundation Models and MeCab, matching natural-language queries to names and companies. Also reworked Eight’s TipKit Premium reminders and expanded its Premium landing page, writing the specs for both.",
  },
  {
    date: "May 2026 – Now",
    title: "Full-Stack Software Engineer",
    org: "BaseMe",
    detail: "Part-time",
    place: "Tokyo",
    description:
      "Built features for BaseMe's AI career chat, such as using your notes as context and stopping a reply, and redesigned how company recommendations appear. Also added profile view counts to help students get noticed by recruiters.",
  },
  {
    date: "Jan – Apr 2026",
    title: "Application Development Engineer",
    org: "MIXI",
    detail: "Internship",
    place: "Tokyo",
    articleUrl: "/MIXI-Internship",
    description:
      "Added country-based access controls to an AI feature in FamilyAlbum that recognizes family members and suggests photos for albums, keeping it to legally approved regions with cached location checks covered by Swift Testing. Also replaced PanModal with native iOS sheets for iOS 26.",
  },
  {
    date: "Aug 2025 – Feb 2026",
    title: "Google Student Ambassador",
    org: "Google Japan",
    place: "Tokyo",
    description:
      "Part of the program's first cohort, sharing everyday AI use cases with more than 1,000 followers. Helped fellow university students learn to use AI safely and effectively.",
  },
]

const awards: Entry[] = [
  {
    date: "2026",
    title: "Swift Student Challenge Winner",
    org: "Apple",
    description:
      "Selected for an app that impressed and inspired Apple with its creativity, technical skill, and thoughtful design.",
  },
  {
    title: "MEXT Undergraduate Scholarship",
    org: "Ministry of Education of Japan",
    description:
      "Awarded through embassy recommendation, covering full tuition, living expenses, and travel for undergraduate studies in Japan.",
  },
]

const hackathons: Entry[] = [
  {
    date: "Jun 2026",
    title: "Build with OpenAI Hackathon",
    org: "OpenAI",
    detail: "Finalist",
    place: "Tokyo",
  },
  {
    date: "Jun 2026",
    title: "SDGs to Startups Hackathon",
    org: "Tokyo AI",
    detail: "1st Place",
    place: "Tokyo",
  },
  {
    date: "Apr 2026",
    title: "try! Swift Tokyo Hackathon",
    org: "Mercari",
    detail: "Winner",
    place: "Tokyo",
  },
  {
    date: "Sep 2024",
    title: "24-Hour Hackathon by 42 Asia",
    org: "SUTD & 42 Asia",
    detail: "2nd Place",
    place: "Seoul",
  },
]

const talks: Entry[] = [
  {
    date: "Jul 2026",
    title: "如何贏得 Swift Student Challenge",
    titleLang: "zh-Hant",
    org: "iPlayground Taiwan",
    place: "Taipei",
    description:
      "A talk on turning a personal story into a winning Swift Playground, covering how to find an idea only you could build, grow SwiftUI skills under real project constraints, and use attention to detail to raise a submission from good to winning.",
    links: [
      { label: "Watch the talk on YouTube", url: "https://www.youtube.com/watch?v=t9sC0nL-uTA" },
      {
        label: "Covered by LY Corporation Tech Blog",
        url: "https://techblog.lycorp.co.jp/zh-hant/TWC-2026-iPlayground-Apple-Developer-Conference",
      },
    ],
  },
  {
    date: "Apr 2026",
    title: "MEXT Scholarship Speaker",
    org: "Ministry of Foreign Affairs of Japan",
    place: "Tokyo",
    description:
      "Spoke at a Consulate-General of Japan in São Paulo webinar, sharing my MEXT scholarship experience with prospective students.",
    links: [
      { label: "Watch the webinar on YouTube", url: "https://www.youtube.com/watch?v=3_t0S7yOug0" },
    ],
  },
  {
    date: "Jan 2024",
    title: "The 42 Live Radio Show",
    org: "이노베이션 아카데미",
    orgLang: "ko",
    place: "Seoul",
    description:
      "Joined a cross-campus podcast between Innovation Academy and 42 Tokyo, exchanging perspectives on the 42 Network with Korean students.",
  },
  {
    date: "Apr 2023",
    title: "Vim na Prática",
    org: "Fora da Norma Podcast",
    place: "São Paulo",
    description:
      "Produced a Brazilian Portuguese tutorial for 42 São Paulo's YouTube channel, teaching beginners how to use Vim from the basics.",
    links: [
      {
        label: "Watch the tutorial on YouTube",
        url: "https://www.youtube.com/watch?v=10BSs7UGBtY",
      },
    ],
  },
]

const education: Entry[] = [
  {
    date: "2024 – 2028",
    title: "Tokyo University of Foreign Studies",
    org: "B.A. Language and Area Studies",
    place: "Tokyo",
  },
  {
    date: "2022 – 2025",
    title: "École 42",
    org: "Computer Software Engineering",
    place: "Tokyo",
  },
]

const languages: Language[] = [
  { name: "Portuguese", level: "Native" },
  { name: "Japanese", level: "C2" },
  { name: "English", level: "C2" },
  { name: "Spanish", level: "C1" },
  { name: "Mandarin", level: "B1" },
  { name: "French", level: "A1" },
]

// Request only the glyphs these entries use: a full CJK family is several megabytes.
const allEntries = [...experience, ...awards, ...hackathons, ...talks, ...education]
const cjkFontHref = (family: string, lang: "zh-Hant" | "ko") => {
  const text = allEntries
    .flatMap((entry) => [
      entry.titleLang === lang ? entry.title : "",
      entry.orgLang === lang ? entry.org : "",
    ])
    .join("")
  return `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}&display=swap`
}

// ── Component ──────────────────────────────────────────────────────────────

const Section = ({ title, children }: { title: string; children: any }) => (
  <section class="about-section">
    <h2 class="about-section-title">{title}</h2>
    {children}
  </section>
)

const HomeProfile: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
  // Label each write-up link with the linked article's own title.
  const articleTitle = (url: string) =>
    allFiles.find((file) => `/${file.slug}` === url)?.frontmatter?.title ?? "Read the write-up"

  const EntryList = ({ entries }: { entries: Entry[] }) => (
    <ol class="about-entries">
      {entries.map((entry) => (
        <li class="about-entry">
          <p class="about-entry-when">
            {entry.date && <span>{entry.date}</span>}
            {entry.place && <span>{entry.place}</span>}
          </p>
          <div class="about-entry-body">
            <h3 class="about-entry-title" lang={entry.titleLang}>
              {entry.title}
            </h3>
            <p class="about-entry-org" lang={entry.orgLang}>
              {entry.org}
              {entry.detail && (
                <>
                  <span class="about-entry-sep" aria-hidden="true">
                    ·
                  </span>
                  <span class="about-entry-detail">{entry.detail}</span>
                </>
              )}
            </p>
            {entry.description && <p class="about-entry-desc">{entry.description}</p>}
            {entry.articleUrl && (
              <a class="about-entry-link" href={entry.articleUrl}>
                <span class="about-entry-link-label">Write-up</span>
                {articleTitle(entry.articleUrl)}
                <span class="about-arrow" aria-hidden="true">
                  {"⁠ →"}
                </span>
              </a>
            )}
            {entry.links?.map((link) => (
              <a class="about-entry-link" href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
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
      <Section title="Experience">
        <EntryList entries={experience} />
      </Section>
      <Section title="Awards">
        <EntryList entries={awards} />
      </Section>
      <Section title="Hackathons">
        <EntryList entries={hackathons} />
      </Section>
      <Section title="Talks">
        <EntryList entries={talks} />
      </Section>
      <Section title="Education">
        <EntryList entries={education} />
      </Section>
      <Section title="Languages">
        <ul class="about-languages">
          {languages.map((lang) => (
            <li>
              <span class="about-language-name">{lang.name}</span>
              <span class="about-language-level">{lang.level}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

HomeProfile.css = style
export default (() => HomeProfile) satisfies QuartzComponentConstructor
