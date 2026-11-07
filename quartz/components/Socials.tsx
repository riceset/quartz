import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { mailLink, socialLinks } from "./socialIcons"

// The home splash reaches email through its Contact link; the rail has no nav, so it
// leads with the mail icon.
const links = [mailLink, ...socialLinks]

const Socials: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "rail-socials")}>
      {links.map(({ href, label, Icon }) => {
        const external = href.startsWith("http")
        return (
          <a
            href={href}
            aria-label={label}
            title={label}
            class="rail-social-link"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icon />
          </a>
        )
      })}
    </div>
  )
}

export default (() => Socials) satisfies QuartzComponentConstructor
