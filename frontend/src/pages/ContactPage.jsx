import ContactLinkCard from '../components/contact/ContactLinkCard.jsx'
import PageIntro from '../components/PageIntro.jsx'
import { contactLinks } from '../content/orbitSiteData.js'
import { resolveAssetHref } from '../utils/resolveAssetHref.js'

const iconPathByLabel = {
  Email: '/mail_icon.png',
  Instagram: '/ig_logo.png',
}

export default function ContactPage() {
  const contactItems = contactLinks.map((item) => ({
    ...item,
    iconSrc: resolveAssetHref(iconPathByLabel[item.label]),
  }))

  return (
    <section className="contact-stage">
      <PageIntro eyebrow="Contact" title="Reach Orbit" />

      <div className="contact-orbit reveal reveal-delay-1" aria-label="Contact links">
        <div className="contact-grid">
          {contactItems.map((item, index) => (
            <ContactLinkCard key={item.label} index={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
