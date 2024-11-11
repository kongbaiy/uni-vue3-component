<template>
  <view>
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { provide, watchPostEffect } from 'vue'

import { type ComponentInternalInstance, getCurrentInstance } from 'vue'

interface IProps {
  modelValue: any
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

function onChecked(value: any) {
  instance.proxy?.$children.forEach((item: any) => {
    item.onChecked(item.value === value)
  })
}

provide('set', set)
</script>
