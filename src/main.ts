import { createApp } from 'vue'
import App from '@src/App.vue'
import '@src/assets/main.less'

// ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// vuetify
import { vuetify } from '@src/plugins/vuetify'
import router from '@src/router'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(createPinia())
app.use(ElementPlus, { size: 'small', zIndex: 3000 })


app.mount('#app').$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'))
