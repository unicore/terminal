import 'readable-stream'
import 'stream-browserify'
import 'stream'
import { createApp } from 'vue'

import App from './App.vue'
import config from './config'

import 'uno.css'
import '@unocss/reset/tailwind.css'

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'
import VueWriter from "vue-writer";

import * as Sentry from "@sentry/vue";
import { Integrations, Tracing } from "@sentry/tracing";
import router from '~/router'

import { useUserStore } from '~/stores/user'


library.add(fas, far, fab)


dom.watch()


const app = createApp(App)
    .use(VueWriter)
    .component("font-awesome-icon", FontAwesomeIcon)
    

Sentry.init({
  app,
  dsn: config.dsn,
  debug: false,
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      // tracePropagationTargets: ["localhost", /^https:\/\/voshod\.io\//],
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    // new Sentry.Replay(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  // tracesSampleRate: 0,

  // // Capture Replay for 10% of all sessions,
  // // plus for 100% of sessions with an error
  // replaysSessionSampleRate: 0.1,
  // replaysOnErrorSampleRate: 1.0,
});


// Перехват и отправка ошибок
function stringifyObject(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    // Обработка ошибки преобразования в JSON-строку
    console.error("Error converting object to JSON:", error);
    return String(obj);
  }
}

const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Вызов оригинальной функции console.error
  originalConsoleError.apply(console, args);

  // Отправка ошибки в Sentry только в режиме production
  if (config.production) {
    const userStore = useUserStore()
    const message = args.map((arg) => (typeof arg === "object" ? stringifyObject(arg) : String(arg))).join(" ");
    Sentry.captureException(new Error(message), {
      level: "error",
      extra: {
        username: userStore.username || 'не авторизован'
      }
    });
  }
};


// install all modules under `modules/`
Object.values(import.meta.globEager('/src/modules/*.ts')).forEach((module) => module.install?.(app))

app.mount('#app')
