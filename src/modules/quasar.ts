import '@quasar/extras/material-icons/material-icons.css'
import '@fontsource/mulish'
import 'quasar/src/css/index.sass'

import { Quasar, Notify, LocalStorage, Loading, Meta, Ripple, Dialog } from 'quasar'
import quasarLang from 'quasar/lang/ru'
import { VueModuleInstaller } from '~/types'

const config = {
  plugins: { Notify, LocalStorage, Loading, Meta, Ripple, Dialog },
  lang: quasarLang,
}

export const install: VueModuleInstaller = (app) => {
  app.use(Quasar, config)
}
