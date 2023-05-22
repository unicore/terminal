import 'readable-stream'
import 'stream-browserify'
import 'stream'
import { createApp } from 'vue'

import App from './App.vue'

import 'uno.css'
import '@unocss/reset/tailwind.css'

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'
import VueWriter from "vue-writer";

library.add(fas, far, fab)

dom.watch()


const app = createApp(App)
    .use(VueWriter)
    .component("font-awesome-icon", FontAwesomeIcon)
    

// install all modules under `modules/`
Object.values(import.meta.globEager('/src/modules/*.ts')).forEach((module) => module.install?.(app))

app.mount('#app')
