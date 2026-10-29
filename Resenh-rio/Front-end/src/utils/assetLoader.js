import loginBackground from '../assets/37066e4f-70b1-4da2-8b41-7d133691ba78.png'
import profileIcon from '../assets/659d4d1f-3c37-4643-b12d-2ed7aad0b9f4.svg'

const profileAssets = import.meta.glob(
  '../assets/profile-*.png',
  { eager: true, query: '?url', import: 'default' }
)

export const getProfileImage = (number) =>
  profileAssets[`../assets/profile-${number}.png`] || ''

const homeAssets = import.meta.glob(
  '../assets/home-*',
  { eager: true, query: '?url', import: 'default' }
)

export const getHomeImage = (name) =>
  homeAssets[`../assets/home-${name}`] || ''

export { loginBackground, profileIcon }
