<template>
  <view>
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { provide, watchPostEffect } from 'vue'

import { type ComponentInternalInstance, getCurrentInstance } from 'vue'

interface IProps {
  modelValue: any[]
}

const props = defineProps<IProps>()
const emits = defineEmits(['update:modelValue'])

const instance: ComponentInternalInstance | any = getCurrentInstance()

watchPostEffect(() => {
  onChecked(props.modelValue)
})

function set(value: IProps['modelValue']) {
  emits('update:modelValue', value)
}

function get(): IProps['modelValue'] {
  return props.modelValue
}

function remove(value: any) {
  const newModelValue = props.modelValue.filter((item: any) => item !== value)

  emits('update:modelValue', newModelValue)
}

function onChecked(modelValue: IProps['modelValue']) {
  instance.proxy?.$children.forEach((item: any) => {
    item.onChecked(modelValue.includes(item.value))
  })
}

provide('set', set)
provide('get', get)
provide('remove', remove)
</script>
