export default function PageIntro({ eyebrow, title, text }) {
  return (
    <section className="page-intro reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {text ? <p className="page-copy">{text}</p> : null}
    </section>
  )
}
