export const PUBLIC_FOLDER_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://shineministry.github.io/catechism'
    : window.location.origin
