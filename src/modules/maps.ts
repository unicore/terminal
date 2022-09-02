// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'

import { VueModuleInstaller } from '~/types'

export const install: VueModuleInstaller = (app) => {
  app.use(OpenLayersMap)
}
