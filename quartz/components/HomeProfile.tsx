import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/homeProfile.scss"

// ── Icons ──────────────────────────────────────────────────────────────────

const BriefcaseIcon = () => (
  <svg
    class="section-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12.01" />
    <path d="M2 12h20" />
  </svg>
)

const GraduationCapIcon = () => (
  <svg
    class="section-icon section-icon-education"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)

const GlobeIcon = () => (
  <svg
    class="section-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const AwardIcon = () => (
  <svg
    class="section-icon section-icon-award"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="m8.5 12.5-1 8 4.5-2.5 4.5 2.5-1-8" />
  </svg>
)

const CertificationIcon = () => (
  <svg
    class="section-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

const HackathonIcon = () => (
  <svg
    class="section-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
)

const MicIcon = () => (
  <svg
    class="section-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
)

const CalendarIcon = () => (
  <svg class="meta-icon" viewBox="-1 -1 26 26" fill="currentColor" stroke="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6 2C6 1.44772 6.44772 1 7 1C7.55228 1 8 1.44772 8 2V3H16V2C16 1.44772 16.4477 1 17 1C17.5523 1 18 1.44772 18 2V3H19C20.6569 3 22 4.34315 22 6V20C22 21.6569 20.6569 23 19 23H5C3.34315 23 2 21.6569 2 20V6C2 4.34315 3.34315 3 5 3H6V2ZM16 5V6C16 6.55228 16.4477 7 17 7C17.5523 7 18 6.55228 18 6V5H19C19.5523 5 20 5.44772 20 6V9H4V6C4 5.44772 4.44772 5 5 5H6V6C6 6.55228 6.44772 7 7 7C7.55228 7 8 6.55228 8 6V5H16ZM4 11V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V11H4Z"
    />
  </svg>
)

const LocationIcon = () => (
  <svg
    class="meta-icon meta-icon-pin"
    viewBox="-1 -1 18 18"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z"
    />
  </svg>
)

const MedalIcon = () => (
  <svg
    class="meta-icon meta-icon-medal"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <path d="M11 12 5.12 2.2" />
    <path d="m13 12 5.88-9.8" />
    <path d="M8 7h8" />
    <circle cx="12" cy="17" r="5" />
    <path d="M12 18v-2h-.5" />
  </svg>
)

interface MetaRowProps {
  period?: string
  location?: string
  rank?: string
}

const MetaRow = ({ period, location, rank }: MetaRowProps) => (
  <div class="home-meta-row">
    {period && (
      <span class="home-meta-item">
        <CalendarIcon />
        <span>{period}</span>
      </span>
    )}
    {rank && (
      <span class="home-meta-item">
        <MedalIcon />
        <span>{rank}</span>
      </span>
    )}
    {location && (
      <span class="home-meta-item">
        <LocationIcon />
        <span>{location}</span>
      </span>
    )}
  </div>
)

// ── Data ───────────────────────────────────────────────────────────────────

interface ExperienceItem {
  role: string
  company: string
  companyUrl: string
  employmentType?: string
  logo: string
  logoClass?: string
  period: string
  location: string
  description?: string
  children?: ExperienceChildItem[]
}

interface ExperienceChildItem {
  title: string
  logo: string
  logoClass?: string
  badgeClass?: string
  description: string
}

interface EducationItem {
  degree: string
  institution: string
  institutionUrl: string
  logo: string
  period: string
  location: string
}

interface Language {
  flag: string
  flagAlt?: string
  name: string
  level: string
}

interface AwardItem {
  title: string
  logo: string
  logoClass?: string
  institution: string
  description: string
}

interface CertificationItem {
  title: string
  issuer: string
  logo?: string
  logoClass?: string
  date: string
  certUrl?: string
}

interface HackathonItem {
  title: string
  organizer: string
  logo?: string
  logoClass?: string
  date: string
  rank?: string
}

interface SpeakingItem {
  title: string
  organization: string
  logo?: string
  logoClass?: string
  description: string
  tags?: string[]
  date?: string
  location: string
}

const experience: ExperienceItem[] = [
  {
    role: "LINE Application Engineer",
    company: "LY Corporation",
    companyUrl: "https://www.lycorp.co.jp/en/",
    employmentType: "Internship",
    logo: "/static/logos/ly-corp-en.svg",
    logoClass: "home-org-logo-ly-corp",
    period: "Aug 2026 – Sep 2026",
    location: "Fukuoka",
    description:
      "iOS engineering intern at LY Corporation / LINEヤフー developing native mobile features for its communication platform.",
    children: [
      {
        title: "LINE",
        logo: "/static/logos/line-corporation.svg",
        logoClass: "home-org-logo-line",
        badgeClass: "home-exp-child-logo-badge-line",
        description:
          "LINE is Japan's leading communication app, with domestic monthly active users surpassing 100 million at the end of 2025.",
      },
    ],
  },
  {
    role: "Eight Application Engineer",
    company: "Sansan",
    companyUrl: "https://www.sansan.com",
    employmentType: "Internship",
    logo: "/static/logos/sansan.svg",
    logoClass: "home-org-logo-sansan",
    period: "Aug 2026 – Sep 2026",
    location: "Tokyo",
    description:
      "Joining Sansan as an iOS engineering intern, building native mobile features for its business card and contact management platform.",
    children: [
      {
        title: "Eight",
        logo: "/static/logos/eight-app.svg",
        logoClass: "home-org-logo-eight",
        badgeClass: "home-exp-child-logo-badge-eight",
        description:
          "Eight is a business card app with more than 4 million users, offering QR card exchange and digitization for business cards.",
      },
    ],
  },
  {
    role: "Full-Stack Software Engineer",
    company: "BaseMe",
    companyUrl: "https://baseme.app",
    employmentType: "Part-time",
    logo: "/static/logos/baseme.svg",
    logoClass: "home-org-logo-baseme",
    period: "May 2026 – Present",
    location: "Tokyo",
    description:
      "Full-stack software engineer at BaseMe with a focus on retention-driven UX improvements, LLM implementation, and mobile-web parity.",
    children: [
      {
        title: "BaseMe",
        logo: "/static/logos/baseme-ken.svg",
        logoClass: "home-org-logo-baseme-ken",
        badgeClass: "home-exp-child-logo-badge-baseme",
        description:
          "BaseMe is a career support platform in Japan that helps job-seeking students with AI-assisted career planning, applications, and scouting.",
      },
    ],
  },
  {
    role: "Digital Album Domain Engineer",
    company: "MIXI",
    companyUrl: "https://mixi.co.jp",
    employmentType: "Internship",
    logo: "/static/logos/mixi.svg",
    logoClass: "home-org-logo-mixi",
    period: "Jan 2026 – Apr 2026",
    location: "Tokyo",
    description:
      "Built and optimized iOS features for MIXI's digital album application, working in Swift with an agile product engineering team.",
    children: [
      {
        title: "FamilyAlbum",
        logo: "/static/logos/familyalbum-logo.svg",
        logoClass: "home-org-logo-familyalbum",
        badgeClass: "home-exp-child-logo-badge-familyalbum",
        description:
          "FamilyAlbum is a private family photo and video sharing app that surpassed 30 million users worldwide and supports families across 175 countries and regions.",
      },
    ],
  },
  {
    role: "Google Student Ambassador",
    company: "Google Japan",
    companyUrl: "https://about.google/intl/ALL_jp/",
    logo: "/static/logos/google.svg",
    logoClass: "home-org-logo-google",
    period: "Aug 2025 – Feb 2026",
    location: "Tokyo",
    description:
      "Participated in Google Japan's ambassador program to promote responsible and effective AI use among university students.",
    children: [
      {
        title: "Google Student Ambassador Program",
        logo: "/static/logos/google-student-ambassador.svg",
        logoClass: "home-org-logo-google-student-ambassador",
        badgeClass: "home-exp-child-logo-badge-google",
        description:
          "A program offered by Google Japan for university students, focused on helping peers learn safe and effective AI use through Gemini, prompting education, and workshops.",
      },
    ],
  },
]

const education: EducationItem[] = [
  {
    degree: "B.A. Language and Area Studies",
    institution: "Tokyo University of Foreign Studies",
    institutionUrl: "https://www.tufs.ac.jp/english/",
    logo: "/static/logos/Logo_tufs-cropped.svg",
    period: "2024 – 2028",
    location: "Tokyo",
  },
  {
    degree: "Computer Software Engineering",
    institution: "École 42",
    institutionUrl: "https://42.fr",
    logo: "/static/logos/42.svg",
    period: "2022 – 2025",
    location: "Paris",
  },
]

const awards: AwardItem[] = [
  {
    title: "Swift Student Challenge Winner",
    logo: "/static/logos/apple.svg",
    logoClass: "home-org-logo-apple",
    institution: "Apple",
    description:
      "Selected in 2026 for an app that impressed and inspired Apple with its creativity, technical skill, and thoughtful design.",
  },
  {
    title: "MEXT Undergraduate Scholarship",
    logo: "/static/logos/mext.svg",
    logoClass: "home-org-logo-mext",
    institution: "Ministry of Education of Japan",
    description:
      "Scholarship awarded through embassy recommendation, covering full tuition, living expenses, and travel for undergraduate studies in Japan.",
  },
]

const certifications: CertificationItem[] = [
  {
    title: "Introduction to Computer Science",
    issuer: "Harvard University",
    logo: "/static/logos/harvard.svg",
    logoClass: "home-org-logo-harvard",
    date: "Jul 2021",
    certUrl: "https://cs50.harvard.edu/certificates/bd575551-1159-49e7-a81b-672d2526b34c",
  },
]

const hackathons: HackathonItem[] = [
  {
    title: "ai& × Moonshot Hackathon",
    organizer: "Moonshot AI",
    logo: "/static/logos/moonshot-ai.svg",
    logoClass: "home-org-logo-moonshot",
    date: "Jul 2026",
    rank: "Participant",
  },
  {
    title: "Build with OpenAI Hackathon",
    organizer: "OpenAI",
    logo: "/static/logos/openai.svg",
    date: "Jun 2026",
    rank: "Finalist",
  },
  {
    title: "SDGs to Startups Hackathon",
    organizer: "Tokyo AI",
    logo: "/static/logos/tokyo-ai.svg",
    logoClass: "home-org-logo-tokyo-ai",
    date: "Jun 2026",
    rank: "1st Place",
  },
  {
    title: "try! Swift Tokyo Hackathon",
    organizer: "Mercari",
    logo: "/static/logos/mercari.svg",
    logoClass: "home-org-logo-mercari",
    date: "Apr 2026",
    rank: "Winner",
  },
  {
    title: "Mistral AI Worldwide Hackathon",
    organizer: "Mistral AI",
    logo: "/static/logos/mistral.svg",
    logoClass: "home-org-logo-mistral",
    date: "Mar 2026",
    rank: "Participant",
  },
  {
    title: "24-Hour Hackathon by 42 Asia",
    organizer: "Singapore University of Technology and Design",
    logo: "/static/logos/sutd-mark.svg",
    date: "Sep 2024",
    rank: "2nd Place",
  },
]

const speaking: SpeakingItem[] = [
  {
    title: "如何贏得 Swift Student Challenge",
    organization: "iPlayground Taiwan",
    logo: "/static/logos/iplayground.svg",
    logoClass: "home-org-logo-iplayground",
    description:
      "A talk on turning a personal story into a winning Swift Playground, covering how to find an idea only you could build, grow SwiftUI skills under real project constraints, and use attention to detail to raise a submission from good to winning.",
    date: "Jul 2026",
    location: "Taipei",
  },
  {
    title: "MEXT Scholarship Speaker",
    organization: "Ministry of Foreign Affairs of Japan",
    logo: "/static/logos/mofa.svg",
    description:
      "Spoke at a Consulate-General of Japan in São Paulo webinar, sharing my MEXT scholarship experience with prospective students.",
    date: "Apr 2026",
    location: "Tokyo",
  },
  {
    title: "The 42 Live Radio Show",
    organization: "이노베이션 아카데미",
    logo: "/static/logos/innovationacademy_cropped.jpg",
    logoClass: "home-org-logo-innovationacademy",
    description:
      "Joined a cross-campus podcast between Innovation Academy and 42 Tokyo, exchanging perspectives on the 42 Network with Korean students.",
    date: "Jan 2024",
    location: "Seoul",
  },
  {
    title: "Vim na Prática",
    organization: "Fora da Norma Podcast",
    logo: "/static/logos/fora-da-norma.svg",
    description:
      "Produced a Brazilian Portuguese tutorial for 42 São Paulo's YouTube channel, teaching beginners how to use Vim from the basics.",
    date: "Apr 2023",
    location: "São Paulo",
  },
]

const languages: Language[] = [
  { flag: "🇧🇷", flagAlt: "🇵🇹", name: "Portuguese", level: "Native" },
  { flag: "🇯🇵", name: "Japanese", level: "Bilingual" },
  { flag: "🇺🇸", flagAlt: "🇬🇧", name: "English", level: "Bilingual" },
  { flag: "🇪🇸", name: "Spanish", level: "Proficient" },
  { flag: "🇹🇼", flagAlt: "🇨🇳", name: "Mandarin", level: "Conversational" },
]

// ── Component ──────────────────────────────────────────────────────────────

const HomeProfile: QuartzComponent = () => {
  return (
    // data-nosnippet: keep these body sections out of Google search snippets so the
    // homepage snippet falls back to the meta description instead of stitching fragments.
    <div class="home-profile" data-nosnippet>
      {/* Experience */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <BriefcaseIcon />
          Experience
        </h2>
        <div class="home-exp-list">
          {experience.map((item) => (
            <div class="home-exp-item">
              {item.children ? (
                <div class="home-exp-tree">
                  <span class="home-org-logo-badge home-exp-tree-parent-logo">
                    <img
                      class={["home-org-logo", item.logoClass].filter(Boolean).join(" ")}
                      src={item.logo}
                      alt={item.company}
                    />
                  </span>
                  <div class="home-exp-text home-exp-tree-parent-text">
                    <span class="home-exp-role">{item.role}</span>
                    <span class="home-exp-company">
                      {item.company}
                      {item.employmentType && ` · ${item.employmentType}`}
                    </span>
                    <div class="home-exp-meta">
                      <MetaRow period={item.period} location={item.location} />
                    </div>
                    {item.description && (
                      <div class="home-exp-body">
                        <p class="home-exp-desc">{item.description}</p>
                      </div>
                    )}
                  </div>
                  <span class="home-exp-tree-connector" aria-hidden="true" />
                  {item.children.map((child) => (
                    <>
                      <span
                        class={[
                          "home-org-logo-badge",
                          "home-exp-child-logo-badge",
                          child.badgeClass,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <img
                          class={["home-org-logo", child.logoClass].filter(Boolean).join(" ")}
                          src={child.logo}
                          alt={child.title}
                        />
                      </span>
                      <div class="home-exp-child-text">
                        <span class="home-exp-child-title">{child.title}</span>
                        <p class="home-exp-desc">{child.description}</p>
                      </div>
                    </>
                  ))}
                </div>
              ) : (
                <div class="home-exp-row">
                  <span class="home-org-logo-badge">
                    <img
                      class={["home-org-logo", item.logoClass].filter(Boolean).join(" ")}
                      src={item.logo}
                      alt={item.company}
                    />
                  </span>
                  <div class="home-exp-text">
                    <span class="home-exp-role">{item.role}</span>
                    <span class="home-exp-company">
                      {item.company}
                      {item.employmentType && ` · ${item.employmentType}`}
                    </span>
                    <div class="home-exp-meta">
                      <MetaRow period={item.period} location={item.location} />
                    </div>
                    {item.description && (
                      <div class="home-exp-body">
                        <p class="home-exp-desc">{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <GraduationCapIcon />
          Education
        </h2>
        <div class="home-edu-list">
          {education.map((item) => (
            <div class="home-edu-item">
              <span class="home-org-logo-badge">
                <img class="home-org-logo" src={item.logo} alt={item.institution} />
              </span>
              <div class="home-edu-text">
                <span class="home-edu-institution">{item.institution}</span>
                <span class="home-edu-degree">{item.degree}</span>
                <div class="home-edu-meta">
                  <MetaRow period={item.period} location={item.location} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <AwardIcon />
          Awards
        </h2>
        <div class="home-award-list">
          {awards.map((item) => (
            <div class="home-award-item">
              <div class="home-award-row">
                <span class="home-org-logo-badge">
                  <img
                    class={["home-org-logo", item.logoClass].filter(Boolean).join(" ")}
                    src={item.logo}
                    alt={item.title}
                  />
                </span>
                <div class="home-award-text">
                  <span class="home-award-title">{item.title}</span>
                  <span class="home-award-institution">{item.institution}</span>
                  <p class="home-award-desc">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Talks */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <MicIcon />
          Talks
        </h2>
        <div class="home-talk-list">
          {speaking.map((item) => (
            <div class="home-talk-item">
              <div class="home-talk-row">
                {item.logo && (
                  <span class="home-org-logo-badge">
                    <img
                      class={["home-org-logo", item.logoClass].filter(Boolean).join(" ")}
                      src={item.logo}
                      alt={item.organization}
                    />
                  </span>
                )}
                <div class="home-talk-text">
                  <span class="home-talk-title">{item.title}</span>
                  <span class="home-talk-organization">{item.organization}</span>
                  <div class="home-talk-meta">
                    <MetaRow period={item.date} location={item.location} />
                  </div>
                  <p class="home-talk-desc">{item.description}</p>
                  {item.tags && (
                    <div class="home-talk-tags">
                      {item.tags.map((tag) => (
                        <span class="home-talk-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hackathons */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <HackathonIcon />
          Hackathons
        </h2>
        <div class="home-hackathon-list">
          {hackathons.map((item) => (
            <div class="home-hackathon-item">
              {item.logo && (
                <span class="home-org-logo-badge">
                  <img
                    class={["home-org-logo", item.logoClass].filter(Boolean).join(" ")}
                    src={item.logo}
                    alt={item.organizer}
                  />
                </span>
              )}
              <div class="home-hackathon-text">
                <span class="home-hackathon-title">{item.title}</span>
                <span class="home-hackathon-organizer">{item.organizer}</span>
                <div class="home-hackathon-meta">
                  <MetaRow period={item.date} rank={item.rank} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section class="home-section">
        <h2 class="home-section-heading">
          <GlobeIcon />
          Languages
        </h2>
        <div class="home-lang-list">
          {languages.map((lang) => (
            <div class="home-lang-item">
              <span class="home-lang-name">
                {lang.flagAlt ? (
                  <span class="home-lang-flag home-lang-flag-flip" aria-hidden="true">
                    <span class="home-lang-flag-sizer">{lang.flag}</span>
                    <span class="home-lang-flag-flip-inner">
                      <span class="home-lang-flag-face home-lang-flag-front">{lang.flag}</span>
                      <span class="home-lang-flag-face home-lang-flag-back">{lang.flagAlt}</span>
                    </span>
                  </span>
                ) : (
                  <span class="home-lang-flag">{lang.flag}</span>
                )}
                {lang.name}
              </span>
              <span class="home-lang-level">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

HomeProfile.css = style
export default (() => HomeProfile) satisfies QuartzComponentConstructor
