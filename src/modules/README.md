## Modules

A custom user module system. Place a `.ts` file with the following template, it will be installed automatically.

```ts
import { VueModuleInstaller } from '~/types'

export const install: VueModuleInstaller = (app) => {
  app.use(SomeModule)
}
```