import type { App, Component } from 'vue'

import button from './button/button.vue'
import form from './form/form.vue'
import formItem from './form-item/form-item.vue'
import popover from './popover/popover.vue'
import popup from './popup/popup.vue'
import slideAction from './slide-action/slide-action.vue'
import slideDelete from './slide-delete/slide-delete.vue'
import tabNav from './tab/nav.vue'
import text from './text/text.vue'
import verifyCode from './verify-code/verify-code.vue'

export {
  button,
  form,
  formItem,
  popover,
  popup,
  slideAction,
  slideDelete,
  tabNav,
  text,
  verifyCode,
}

const components: Component = [
  button,
  form,
  formItem,
  popover,
  popup,
  slideAction,
  slideDelete,
  tabNav,
  text,
  verifyCode,
]

const componentPlugin = {
  install(app: App, prefix: string) {
    components.forEach((component: Component | any) => {
      const name = prefix ? `${prefix}-${component.__name}` : component.__name
      app.component(name, component)
    })
  },
}

export default componentPlugin
