import { createSSRApp } from 'vue'

import App from './App.vue'
import 'uno.css'
import './components/index.scss'

export function createApp() {
  const app = createSSRApp(App)

  return {
    app,
  }
}
