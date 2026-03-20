import { resolveAssetHref } from '../utils/resolveAssetHref.js'
import { galleryItems as generatedGalleryItems } from './galleryManifest.js'

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Art Work', href: '/art-work/' },
  { label: 'Contact', href: '/contact/' },
]

export const routeMeta = {
  '/': {
    title: 'Orbit | Home',
    description: 'Orbit is a visual home for original artwork, motion studies, and an evolving artistic practice.',
  },
  '/about/': {
    title: 'Orbit | About',
    description: 'Learn about the ideas, process, and artist behind Orbit.',
  },
  '/art-work/': {
    title: 'Orbit | Art Work',
    description: 'Browse a growing gallery of Orbit artwork and motion-derived stills.',
  },
  '/contact/': {
    title: 'Orbit | Contact',
    description: 'Contact Orbit through email or Instagram.',
  },
}

export const aboutContent = {
  paragraphs: [
    "I have a very special way on how I interpret different subjects and ideas. Through my creative expression, I make sure that everyone that takes a look at my pieces to search for everything they can find in them. \n\nEver since I was in 2nd grade I was obsessed with the beautiful chaos of doodle drawings. As time passes on I found people that take your interest of an art style and push its limits. As my inspiration grew so did my process in drawing.\n\nMy inspirations like, GawxArt, SentRock, or Vexx, is what I used to progress foward. Then when the time comes, I didn't need to look at other artists anymore to create something beautiful. It'll come naturally. But I always loop back around to any artist for inspiration. From taking someone's character and making it my own, or using the same colors or art style. All artists are thieves, and they all wonder the same question at a time in their career,\"What is Inspiration?\"\n\n I was very hyped to start making art for people, like for My Chi My Future, or simple flyers and posters for events. I've become involved with the City of Chicago because of Clue? And The Alliance 98. Without them, I wouldn't have been here today making art for my community. My inspiration is everywhere. And I hope I can be someone else's inspiration some day.",
  ],
  image: resolveAssetHref('/orbit.jpg'),
  imageAlt: 'Artist portrait for Orbit',
}

export const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:Artanguiano3@gmail.com ',
    external: false,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/real_orbit___',
    external: true,
  },
]

export const galleryItems = generatedGalleryItems.map((item) => ({
  ...item,
  src: resolveAssetHref(item.src),
}))
