import { createPinia } from 'pinia'
import { VueModuleInstaller } from '~/types'

export const install: VueModuleInstaller = (app) => {
  const pinia = createPinia()
  app.use(pinia)
}
