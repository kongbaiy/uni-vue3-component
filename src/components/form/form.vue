<template>
  <form>
    <slot />
  </form>
</template>

<script lang="ts">
import { type ComponentInternalInstance, getCurrentInstance, isReactive } from 'vue'
import { type IFormValidatorOptions, formValidator } from './validator'

export default {
  behaviors: ['wx://form-field', 'wx://form-field-group', 'wx://form-field-button'],
}
</script>

<script lang="ts" setup>
export type PromptMode = 'toast' | 'message'
export type Layout = 'left' | 'right' | 'top'

interface IProps extends Pick<IFormValidatorOptions, 'rules'> {
  layout?: Layout
  modelValue: any
  promptMode: PromptMode
  labelWidth?: string
  labelGap?: string
  align?: string
  gap?: string
}

const props = withDefaults(defineProps<IProps>(), {
  promptMode: 'message',
})
const emits = defineEmits<(e: 'update:modelValue', value?: AnyObject) => void>()
const instance: ComponentInternalInstance | any = getCurrentInstance()

defineExpose({
  ...props,
  validate: (callback: <T>(data: T) => void) => {
    const { modelValue: formData = {}, rules, promptMode } = props
    const children = instance.proxy?.$children

    children.forEach((item: any) => {
      const rule = rules[item.prop]

      if (item.required && item.prop) {
        if (!rule?.length) rules[item.prop] = [{ message: '值不能未空', required: true }]
        else rule[0].required = true
      }

      item.setErrorMessage?.('')
    })

    formValidator({
      formData,
      rules,
    }).then(callback).catch((error) => {
      const { currentRule } = error

      if (promptMode === 'toast') {
        uni.showToast({
          title: currentRule.message,
          icon: 'none',
        })
        return
      }

      const { setErrorMessage } = children.find((item: any) => item.prop === error.key) || {}
      setErrorMessage?.(currentRule.message)
    })
  },
  resetForm: () => {
    if (isReactive(props.modelValue)) {
      for (const i in props.modelValue) {
        props.modelValue[i]! = null
      }

      return
    }

    emits('update:modelValue', {})
  },
})
</script>

<style lang="scss" scoped>
.form-item {
  &:last-child {
    border-color: transparent;
  }
}
</style>
