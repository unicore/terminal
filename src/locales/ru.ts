const msg = Object.values(import.meta.globEager('/src/locales/ru/*.yml')).map((value) => {
  return value.default
})

export default msg.reduce((pre, cur) => {
  return { ...pre, ...cur }
}, {})
