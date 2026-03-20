import { resolveAssetHref } from '../utils/resolveAssetHref.js'

export default function HomePage() {
  return (
    <section className="home-stage">
      <figure className="home-hero reveal">
        <img
          alt="Orbit home artwork"
          className="home-hero-image"
          decoding="async"
          loading="eager"
          src={resolveAssetHref('/orbit_home.jpg')}
        />
        <figcaption className="home-overlay-title">Orbit</figcaption>
      </figure>
    </section>
  )
}
