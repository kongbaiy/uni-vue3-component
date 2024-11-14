<template>
  <label :class="{ label: true!, label__active: checked }" @click="handleLabel">
    <view :style="checkboxStyle" class="checkbox">
      <slot name="icon" />
      <custom-icon v-if="!$slots.icon" v-show="checked" type="checkbox" :color="color" />
    </view>
    <slot />
  </label>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'

import customIcon from '../icon/icon.vue'

interface IProps {
  value?: any
  size?: number
  color?: string
  activeColor?: string
  activeBorderColor?: string
  borderColor?: string
  background?: string
  activeBackground?: string
}

const props = withDefaults(defineProps<IProps>(), {
  color: '#fff',
  activeColor: '#fff',
  borderColor: '#BDBCBC',
  activeBorderColor: '#3884EB',
  background: '#BDBCBC',
  activeBackground: '#3884EB',
  size: 26,
})
const setModel = inject<<T>(args: T) => void>('set')

const checkboxStyle = computed(() => {
  const { size } = props

  return {
    width: `${size}rpx`,
    height: `${size}rpx`,
  }
})

const checked = ref<boolean>(false)

function handleLabel() {
  setModel?.(props.value)
}

function onChecked(status: boolean) {
  checked.value = status
}

defineExpose({
  onChecked,
})
</script>

  <style lang="scss" scoped>
.label {
    --color: v-bind(color);
    --activeColor: v-bind(activeColor);
    --borerColor: v-bind(borderColor);
    --activeBorderColor: v-bind(activeBorderColor);
    --bgColor: v-bind(background);
    --activeBgColor: v-bind(activeBackground);
    display: inline-flex;
    align-items: center;
    vertical-align: top;
  }

  .label__active {
    .checkbox {
      color: var(--color);
      border-color: var(--activeBorderColor);
      background-color: var(--activeBgColor);
    }
  }

  .checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--borerColor);
    background-color: var(--bgColor);
  }
  </style>
