<template>
  <view :class="getContainerClass(newLayout as Layout)">
    <view class="label">
      <text v-if="required" class="required">
        *
      </text>
      <view :style="labelStyle" class="label-text">
        {{ label }}
      </view>
    </view>

    <view class="value">
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

import { fontSizes } from '../common/config'

interface IProps {
  prop?: string
  label?: string
  required?: boolean
  layout?: Layout
  labelWidth?: string
  labelGap?: string
  align?: string
  border?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  layout: 'left',
  labelWidth: 'auto',
})
const instance: ComponentInternalInstance | any = getCurrentInstance()

const { exposed } = instance.parent || {}
const { gap } = exposed
const newLayout: IProps['layout'] = (exposed?.layout || props.layout) as Layout
const message = ref<string>('')
const { normal } = fontSizes

const labelStyle = computed(() => {
  const { labelWidth, align, labelGap } = props

  return {
    width: exposed?.labelWidth || labelWidth,
    textAlignLast: exposed?.align || align,
    marginRight: exposed?.labelGap || labelGap,
  }
})

function getContainerClass(layout: Layout) {
  const layoutClass = {
    left: 'layout-left',
    right: 'layout-right',
    top: 'layout-top',
  }

  return `layout ${layoutClass[layout]}`
}

defineExpose({
  ...props,
  setErrorMessage(text: string) {
    message.value = text
  },
})
</script>

<style lang="scss" scoped>
.layout {
  margin-bottom: v-bind(gap);
}

.layout-left {
  display: flex;
}

.layout-right {
  display: flex;
  .label-text {
    text-align: right;
  }
}

.layout-top {
  display: flex;
  flex-direction: column;
}

.label {
  display: flex;
}

.label-text {
  font-size: v-bind(normal);
  color: var(--color-h1);
}

.value {
  flex: 1;
  display: flex;
  align-items: center;
}

.required,
.message {
  color: var(--color-error);
}

.message {
  font-size: v-bind(normal);
}
</style>
