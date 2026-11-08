// Site languages offered by the language picker. Article bodies stay in English; only the
// site's own copy (splash, About, Articles) is translated.
export const siteLangs = ["en", "ja", "zh", "pt"] as const
export type SiteLang = (typeof siteLangs)[number]

// BCP 47 tags, so each translation picks up the right CJK glyphs and fonts.
export const langTags: Record<SiteLang, string> = { en: "en", ja: "ja", zh: "zh-Hant", pt: "pt-BR" }

export type Localized = string | Record<SiteLang, string>

// Render every translation; custom.scss shows only the one matching the picker's choice
// (`data-lang` on <html>), so switching needs no rebuild or reload.
export const T = ({ text }: { text: Localized }) =>
  typeof text === "string" ? (
    <>{text}</>
  ) : (
    <>
      {siteLangs.map((lang) => (
        <span data-text-lang={lang} lang={langTags[lang]}>
          {text[lang]}
        </span>
      ))}
    </>
  )
