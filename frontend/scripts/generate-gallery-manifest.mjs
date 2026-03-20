import { execFile } from 'node:child_process'
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const galleryDir = path.join(projectRoot, 'public', 'gallery')
const thumbnailDir = path.join(galleryDir, 'thumbs')
const thumbnailConfigFile = path.join(galleryDir, '.thumb-config')
const outputDir = path.join(projectRoot, 'src', 'content')
const outputFile = path.join(outputDir, 'galleryManifest.js')
const supportedExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'])
const thumbnailSourceExtensions = new Set(['.jpeg', '.jpg', '.png'])
const thumbnailMaxSize = 512
const thumbnailConfigValue = JSON.stringify({ maxSize: thumbnailMaxSize, format: 'jpeg', generator: 'ffmpeg' })
let warnedAboutMissingFfmpeg = false

function compareFileNames(left, right) {
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function parseDateParts(year, month, day, hour = '00', minute = '00', second = '00') {
  const timestamp = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  )

  return Number.isNaN(timestamp) ? null : timestamp
}

function extractTimestamp(fileName) {
  const baseName = fileName.replace(/\.[^.]+$/, '')
  const fullDateTimeMatch = baseName.match(/(?:^|[^0-9])(\d{8})[_-]?(\d{6})(?:[^0-9]|$)/)

  if (fullDateTimeMatch) {
    const [, datePart, timePart] = fullDateTimeMatch

    return parseDateParts(
      datePart.slice(0, 4),
      datePart.slice(4, 6),
      datePart.slice(6, 8),
      timePart.slice(0, 2),
      timePart.slice(2, 4),
      timePart.slice(4, 6),
    )
  }

  const dateOnlyMatch = baseName.match(/(?:^|[^0-9])(\d{8})(?:[^0-9]|$)/)

  if (dateOnlyMatch) {
    const [, datePart] = dateOnlyMatch

    return parseDateParts(datePart.slice(0, 4), datePart.slice(4, 6), datePart.slice(6, 8))
  }

  return null
}

function toTitleCase(value) {
  return value.replace(/\b[a-z]/g, (character) => character.toUpperCase())
}

function formatTitle(fileName) {
  const baseName = fileName.replace(/\.[^.]+$/, '')
  const spacedName = baseName.replace(/[_-]+/g, ' ').trim()

  return toTitleCase(spacedName)
}

function toGalleryItem(fileName) {
  const id = fileName.replace(/\.[^.]+$/, '')
  const title = formatTitle(fileName)

  return {
    id,
    src: `/gallery/${encodeURIComponent(fileName)}`,
    alt: title,
    title,
  }
}

function getGalleryFileHref(fileName) {
  return `/gallery/${encodeURIComponent(fileName)}`
}

function getThumbnailFileName(fileName) {
  return `${fileName.replace(/\.[^.]+$/, '')}.jpg`
}

function getThumbnailHref(thumbnailFileName, cacheVersion) {
  return `/gallery/thumbs/${encodeURIComponent(thumbnailFileName)}?v=${cacheVersion}`
}

async function ensureThumbnail(fileName, sourceModifiedAt) {
  const extension = path.extname(fileName).toLowerCase()
  const thumbnailFileName = getThumbnailFileName(fileName)
  const thumbnailPath = path.join(thumbnailDir, thumbnailFileName)

  if (!thumbnailSourceExtensions.has(extension)) {
    await rm(thumbnailPath, { force: true })
    return getGalleryFileHref(fileName)
  }

  const sourcePath = path.join(galleryDir, fileName)

  let thumbnailIsCurrent = false
  let thumbnailModifiedAt = sourceModifiedAt

  try {
    const thumbnailStats = await stat(thumbnailPath)
    thumbnailIsCurrent = thumbnailStats.mtimeMs >= sourceModifiedAt
    thumbnailModifiedAt = thumbnailStats.mtimeMs
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }

  if (!thumbnailIsCurrent) {
    try {
      await mkdir(path.dirname(thumbnailPath), { recursive: true })
      await execFileAsync('ffmpeg', [
        '-y',
        '-loglevel',
        'error',
        '-i',
        sourcePath,
        '-vf',
        `scale='min(${thumbnailMaxSize},iw)':'min(${thumbnailMaxSize},ih)':force_original_aspect_ratio=decrease`,
        '-frames:v',
        '1',
        '-update',
        '1',
        thumbnailPath,
      ])
      const thumbnailStats = await stat(thumbnailPath)
      thumbnailModifiedAt = thumbnailStats.mtimeMs
    } catch (error) {
      await rm(thumbnailPath, { force: true })

      if (error.code === 'ENOENT') {
        if (!warnedAboutMissingFfmpeg) {
          console.warn('ffmpeg is not installed, so gallery thumbnails were skipped and original images will be used instead.')
          warnedAboutMissingFfmpeg = true
        }
      } else {
        console.warn(`Failed to generate a thumbnail for ${fileName}; using the original image instead.`)
      }

      return getGalleryFileHref(fileName)
    }
  }

  return getThumbnailHref(thumbnailFileName, Math.round(thumbnailModifiedAt))
}

async function syncThumbnailConfig() {
  let shouldResetThumbnails = false

  try {
    const currentConfig = await readFile(thumbnailConfigFile, 'utf8')
    shouldResetThumbnails = currentConfig !== thumbnailConfigValue
  } catch (error) {
    if (error.code === 'ENOENT') {
      shouldResetThumbnails = true
    } else {
      throw error
    }
  }

  if (shouldResetThumbnails) {
    await rm(thumbnailDir, { recursive: true, force: true })
  }

  await mkdir(thumbnailDir, { recursive: true })
  await writeFile(thumbnailConfigFile, thumbnailConfigValue)
}

async function removeStaleThumbnails(validThumbnailFileNames) {
  let entries = []

  try {
    entries = await readdir(thumbnailDir, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') {
      return
    }

    throw error
  }

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && !entry.name.startsWith('.') && !validThumbnailFileNames.has(entry.name))
      .map((entry) => rm(path.join(thumbnailDir, entry.name), { force: true })),
  )
}

async function getGalleryItems() {
  let entries = []

  try {
    entries = await readdir(galleryDir, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }

    throw error
  }

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))

  const expectedThumbnailFiles = new Set(
    files
      .filter((fileName) => thumbnailSourceExtensions.has(path.extname(fileName).toLowerCase()))
      .map(getThumbnailFileName),
  )

  await syncThumbnailConfig()
  await removeStaleThumbnails(expectedThumbnailFiles)

  const itemsWithDates = await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(galleryDir, fileName)
      const fileStats = await stat(filePath)
      const thumbSrc = await ensureThumbnail(fileName, fileStats.mtimeMs)

      return {
        fileName,
        modifiedAt: fileStats.mtimeMs,
        sortTimestamp: extractTimestamp(fileName),
        thumbSrc,
      }
    }),
  )

  return itemsWithDates
    .sort((left, right) => {
      const leftHasTimestamp = left.sortTimestamp !== null
      const rightHasTimestamp = right.sortTimestamp !== null

      if (leftHasTimestamp !== rightHasTimestamp) {
        return Number(rightHasTimestamp) - Number(leftHasTimestamp)
      }

      if (right.sortTimestamp !== left.sortTimestamp) {
        return right.sortTimestamp - left.sortTimestamp
      }

      if (right.modifiedAt !== left.modifiedAt) {
        return right.modifiedAt - left.modifiedAt
      }

      return compareFileNames(left.fileName, right.fileName)
    })
    .map(({ fileName, thumbSrc }) => ({
      ...toGalleryItem(fileName),
      thumbSrc,
    }))
}

function renderManifest(items) {
  return `// This file is generated by scripts/generate-gallery-manifest.mjs.
// Run \`npm run generate:gallery\` after changing files in public/gallery.

export const galleryItems = ${JSON.stringify(items, null, 2)}
`
}

const galleryItems = await getGalleryItems()

await mkdir(outputDir, { recursive: true })
await writeFile(outputFile, renderManifest(galleryItems))
