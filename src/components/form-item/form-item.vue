<template>
  <view :class="getContainerClass(newLayout as Layout)">
    <view
      :style="{ width: newLabelWidth }"
      class="label"
    >
      {{ label }}
      <text
        v-if="required"
        class="required"
      >
        *
      </text>
    </view>
    <view>
      <slot />
    </view>
  </view>
  <view class="message">
    <text v-if="message.length">
      {{ message }}
    </text>
  </view>
</template>

<script lang="ts" setup>
import { type ComponentInternalInstance, getCurrentInstance, ref } from 'vue'
import type { Layout } from '../form/form.vue'

interface IProps {
  prop?: string
  label?: string
  required?: boolean
  layout?: Layout
  labelClass?: string
  labelWidth?: string | number
}

const props = withDefaults(defineProps<IProps>(), {
  layout: 'left',
  labelWidth: 'auto',
})
const instance: ComponentInternalInstance | any = getCurrentInstance()
const { exposed } = instance.parent || {}
const newLayout: IProps['layout'] = (exposed?.layout || props.layout) as Layout
const newLabelWidth: IProps['labelWidth'] = (exposed?.labelWidth || props.labelWidth)
const message = ref<string>('')

function getContainerClass(layout: Layout) {
  const _unocss = {
    left: 'flex',
    right: 'flex text-right',
    top: 'flex flex-col',
  }

  return `${_unocss[layout]} ${props.labelClass || ''}`
}

defineExpose({
  ...props,
  setErrorMessage(text: string) {
    message.value = text
  },
})
</script>

<style lang="scss" scoped>
.label {
  @apply text-base text-[var(--color-h1)];
}

.required,
.message {
  @apply text-[var(--color-error)];
}

.message {
  @apply text-base;
}
</style>
