// @ts-ignore: this runs before DOM ready and should stay a plain script import
import script from "./scripts/languagePicker.inline"
import styles from "./styles/languagePicker.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { T } from "./localized"

const options = [
  { value: "en", label: { en: "English", ja: "英語", zh: "英文", pt: "Inglês" }, code: "EN" },
  { value: "ja", label: { en: "Japanese", ja: "日本語", zh: "日文", pt: "Japonês" }, code: "JA" },
  { value: "zh", label: { en: "Mandarin", ja: "中国語", zh: "中文", pt: "Mandarim" }, code: "ZH" },
  { value: "pt", label: { en: "Portuguese", ja: "ポルトガル語", zh: "葡文", pt: "Português" }, code: "PT" },
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
      <span class="lang-picker-value">
        <T text={{ en: "EN", ja: "JA", zh: "ZH", pt: "PT" }} />
        <svg
          class="lang-picker-lock"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </span>
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
          <span class="lang-picker-label">
            <T text={label} />
          </span>
          <span class="lang-picker-code" aria-hidden="true">
            {code}
          </span>
        </button>
      ))}
      <p class="lang-picker-note">Articles are available in English only.</p>
    </div>
  </div>
)

LanguagePicker.beforeDOMLoaded = script
LanguagePicker.css = styles

export default (() => LanguagePicker) satisfies QuartzComponentConstructor
