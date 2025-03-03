import { createApp } from 'vue'
import pinia from '@/stores/index'
import App from './App.vue'
import router from './router'
import { directive } from '@/directive/index'
import other from '@/utils/other'

// import ElementPlus from 'element-plus'
// import locale from 'element-plus/lib/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import VueViewer from 'v-viewer'
import '@/assets/icons/iconfont.css'
import '@/assets/icons/iconfont.js'
import 'element-plus/dist/index.css'
import '@/theme/index.scss'
import '@/assets/global.css'
import 'uno.css'
import { rememberLastVisitedPage } from './utils/recordLastVisitedPage'
import 'viewerjs/dist/viewer.css'

rememberLastVisitedPage()

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

directive(app)
other.elSvg(app)

app
  .use(pinia)
  // .use(ElementPlus, { locale })
  .use(router)
  .use(VueViewer)
  .mount('#app')
