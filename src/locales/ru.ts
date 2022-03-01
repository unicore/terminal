const msg = Object.entries(import.meta.globEager('/src/locales/ru/*.yml')).map(([key, value]) => {
    return value.default
  })
  
  export default msg.reduce((pre, cur) => {
    return { ...pre, ...cur }
  }, {})