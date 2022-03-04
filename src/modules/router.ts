import router from '~/router'
import { VueModuleInstaller } from '~/types'

export const install: VueModuleInstaller = (app) => {
  app.use(router)
}
