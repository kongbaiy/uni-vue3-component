<template>
  <label :class="{ label: true!, label__active: checked }" @click="handleLabel">
    <view :style="ksRadioStyle" class="radio" />
    <slot />
  </label>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'

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

const ksRadioStyle = computed(() => {
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
  position: relative;
}

.label__active {
  .radio {
    border-color: var(--activeBorderColor);
    background-color: var(--activeBgColor);
  }

  .radio::after {
    background-color: var(--activeColor);
  }
}

.radio {
  position: relative;
  display: inline-block;
  margin-top: -2rpx;
  vertical-align: middle;
  border: 1px solid var(--borerColor);
  background-color: var(--bgColor);
  border-radius: 50%;
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    background-color: var(--color);
    border-radius: 50%;
  }
}
</style>
