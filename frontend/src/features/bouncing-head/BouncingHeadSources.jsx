import { resolveAssetHref } from '../../utils/resolveAssetHref.js'

function BouncingHeadSources() {
  return (
    <>
      <source
        src={resolveAssetHref('/orbit_transparent_fast.webm')}
        type="video/webm"
      />
      <source
        src={resolveAssetHref('/orbit_transparent_fast.mov')}
        type="video/quicktime"
      />
    </>
  )
}

export default BouncingHeadSources
