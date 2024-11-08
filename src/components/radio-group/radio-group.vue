<template>
  <view>
    <slot />
  </view>
</template>

<script lang="ts" setup>
// import { nextTick, provide, watch, watchPostEffect } from 'vue'
import { provide, watchPostEffect } from 'vue'

import { type ComponentInternalInstance, getCurrentInstance } from 'vue'

interface IProps {
  modelValue: any
}

const props = defineProps<IProps>()
const emits = defineEmits(['update:modelValue'])

const instance: ComponentInternalInstance | any = getCurrentInstance()

// watch(() => props.modelValue, (newValue: boolean) => {
//   nextTick(() => {
//     onChecked(newValue)
//   })
// }, {
//   immediate: true,
// })

watchPostEffect(() => {
  onChecked(props.modelValue)
})

function set(value: IProps['modelValue']) {
  emits('update:modelValue', value)
}

function onChecked(value: any) {
  console.log('value')
  instance.proxy?.$children.forEach((item: any) => {
    item.onChecked(item.value === value)
  })
}

provide('set', set)
</script>
