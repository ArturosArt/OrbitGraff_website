import { aboutContent } from '../../content/orbitSiteData.js'

function getParagraphs(paragraphs) {
  return paragraphs.flatMap((paragraph) =>
    paragraph
      .split('\n\n')
      .map((section) => section.trim())
      .filter(Boolean),
  )
}

export default function AboutText() {
  const paragraphs = getParagraphs(aboutContent.paragraphs)

  return (
    <article className="text-panel reveal reveal-delay-1">
      <h2>About</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </article>
  )
}
