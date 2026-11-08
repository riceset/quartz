// @ts-ignore: this runs before DOM ready and should stay a plain script import
import script from "./scripts/languagePicker.inline"
import styles from "./styles/languagePicker.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { langTags, T } from "./localized"

const options = [
  { value: "en", label: "English", code: "EN" },
  { value: "ja", label: "日本語", code: "JA" },
  { value: "zh", label: "繁體中文", code: "ZH" },
  { value: "pt", label: "Português", code: "PT" },
] as const

// The trigger shows the current language code in mono, like the site's other annotations;
// it opens a glass menu styled after the rail.
const LanguagePicker: QuartzComponent = ({ displayClass }: QuartzComponentProps) => (
  <div class={classNames(displayClass, "lang-picker")}>
    <button
      class="lang-picker-trigger"
      type="button"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Language / 言語 / 語言 / Idioma"
      title="Language / 言語 / 語言 / Idioma"
    >
      <T text={{ en: "EN", ja: "JA", zh: "ZH", pt: "PT" }} />
    </button>
    <div class="lang-picker-menu" role="menu" aria-label="Language / 言語 / 語言 / Idioma">
      {options.map(({ value, label, code }) => (
        <button
          class="lang-picker-option"
          type="button"
          role="menuitemradio"
          aria-checked="false"
          tabindex={-1}
          data-lang-option={value}
        >
          <svg
            class="lang-picker-check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
          <span class="lang-picker-label" lang={langTags[value]}>
            {label}
          </span>
          <span class="lang-picker-code" aria-hidden="true">
            {code}
          </span>
        </button>
      ))}
    </div>
  </div>
)

LanguagePicker.beforeDOMLoaded = script
LanguagePicker.css = styles

export default (() => LanguagePicker) satisfies QuartzComponentConstructor
