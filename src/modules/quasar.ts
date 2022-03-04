import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import { Quasar, Notify, LocalStorage, Loading, Meta } from 'quasar'
import quasarLang from 'quasar/lang/ru'
import { VueModuleInstaller } from '~/types'

const config = {
  plugins: { Notify, LocalStorage, Loading, Meta },
  lang: quasarLang,
}

export const install: VueModuleInstaller = (app) => {
  app.use(Quasar, config)
}
