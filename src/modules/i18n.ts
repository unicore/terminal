import { App } from 'vue'
import { createI18n } from 'vue-i18n'
const messages = Object.fromEntries(
  Object.entries(import.meta.globEager('/src/locales/*.ts')).map(([key, value]) => {
    return [key.slice(13, -3), value.default]
  })
)

export const install = (app: App) => {
  const i18n = createI18n({
    locale: 'ru',
    messages,
  })
  app.use(i18n)
}
