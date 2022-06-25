import { createI18n } from 'vue-i18n'
import { VueModuleInstaller } from '~/types'

const messages = Object.fromEntries(
  Object.entries(import.meta.globEager('/src/locales/*.ts')).map(([key, value]) => {
    return [key.slice(13, -3), value.default]
  })
)

export const install: VueModuleInstaller = (app) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    messages,
    pluralRules: {
      ru: (choice: number) => {
        if (choice === 0) {
          return 0
        }

        if (choice === 1) {
          return 1
        }

        const teen = choice > 10 && choice < 20
        const endsWithOne = choice % 10 === 1
        if (!teen && endsWithOne) {
          return 2
        }
        if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
          return 3
        }

        return 4
      },
    },
  })
  app.use(i18n)
}
