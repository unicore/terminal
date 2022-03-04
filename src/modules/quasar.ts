import { App } from 'vue'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import { Quasar, Notify, LocalStorage, Loading, Meta } from 'quasar'
import quasarLang from 'quasar/lang/ru'

const config = {
  plugins: { Notify, LocalStorage, Loading, Meta },
  lang: quasarLang,
}

export const install = (app: App) => {
  app.use(Quasar, config)
}
