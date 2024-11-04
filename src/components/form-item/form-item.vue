<template>
  <view :class="getContainerClass(newLayout as Layout)">
    <view
      :style="labelStyle"
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
import { computed, getCurrentInstance, ref } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import type { Layout } from '../form/form.vue'

interface IProps {
  prop?: string
  label?: string
  required?: boolean
  layout?: Layout
  labelClass?: string
  width?: string | number
  align?: string
  gap?: string
  lineHeight?: string
  border?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  layout: 'left',
  width: 'auto',
})
const instance: ComponentInternalInstance | any = getCurrentInstance()

const { exposed } = instance.parent || {}
const newLayout: IProps['layout'] = (exposed?.layout || props.layout) as Layout
const message = ref<string>('')

const labelStyle = computed(() => {
  const { width, align, gap } = props

  return {
    width: exposed?.width || width,
    textAlignLast: exposed?.align || align,
    marginRight: exposed?.gap || gap,
  }
})

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
  @apply text-base;
  color: var(--color-h1);
}

.required,
.message {
  color: var(var(--color-error));
}

.message {
  @apply text-base;
}

.layout-left {
  display: flex;
}

.layout-right {
  display: flex;
  text-align: right;
}

.layout-top {
  display: flex;
  flex-direction: column;
}
</style>
