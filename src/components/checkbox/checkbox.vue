<template>
  <label :class="{ label: true!, label__active: checked }" @click="handleLabel">
    <view :style="checkboxStyle" class="checkbox">
      <slot name="icon" />

      <custom-icon
        v-if="!$slots.icon"
        v-show="checked"
        type="checkbox"
        :size="size"
        color="var(--color-active-checkbox)"
      />
    </view>
    <slot />
  </label>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { getCssDefaultUint } from '../common/index'

import customIcon from '../icon/icon.vue'

interface IProps {
  value?: any
  size?: number | string
}

const props = withDefaults(defineProps<IProps>(), {
  size: 26,
})
const setModel = inject<<T>(args: T) => void>('set')
const getModel = inject<() => any[]>('get')
const removeModel = inject<<T>(args: T) => void>('remove')

const checkboxStyle = computed(() => {
  const { size } = props
  const sizeValue = getCssDefaultUint(size)

  return {
    width: sizeValue,
    height: sizeValue,
  }
})

const checked = ref<boolean>(false)

function handleLabel() {
  const modelValue = getModel?.()

  if (modelValue?.includes(props.value)) removeModel?.(props.value)
  else setModel?.([...modelValue!, props.value])
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
    display: inline-flex;
    align-items: center;
    vertical-align: top;
  }

  .checkbox {
    transition: all 200ms ease-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-checkbox-border);
    background: var(--color-checkbox-background);
  }

  .label__active {
    .checkbox {
      color: var(--theme);
      border-color: var(--color-active-checkbox-border);
      background-color: var(--color-active-checkbox-background);
    }
  }
  </style>
