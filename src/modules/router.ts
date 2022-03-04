import { App } from 'vue'
import router from '~/router'

export const install = (app: App) => {
  app.use(router)
}
