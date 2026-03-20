export default function ContactLinkCard({ item, index }) {
  const delayClass = index > 0 ? 'reveal-delay-1' : ''

  return (
    <a
      aria-label={item.label}
      className={`contact-card reveal ${delayClass}`}
      href={item.href}
      rel={item.external ? 'noreferrer' : undefined}
      target={item.external ? '_blank' : undefined}
    >
      <span className="contact-icon">
        <img alt="" aria-hidden="true" className="contact-icon-graphic" src={item.iconSrc} />
      </span>
    </a>
  )
}
