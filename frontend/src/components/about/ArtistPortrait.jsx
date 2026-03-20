import { aboutContent } from '../../content/orbitSiteData.js'

export default function ArtistPortrait() {
  return (
    <div className="portrait-panel reveal reveal-delay-2">
      <div className="portrait-shell">
        <img
          alt={aboutContent.imageAlt}
          className="portrait-image"
          decoding="async"
          loading="eager"
          src={aboutContent.image}
        />
      </div>
      <p className="portrait-caption">Arturo Anguiano III</p>
    </div>
  )
}
