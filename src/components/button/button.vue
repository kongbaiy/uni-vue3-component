<template>
  <button
    :open-type="openType"
    :form-type="formType"
    :disabled="disabled"
    :loading="loading"
    :style="getButtonStyle()"
    :class="getButtonClass()"
    hover-class="button__hover"
    @getphonenumber="emits('getphonenumber', $event)"
    @getuserinfo="emits('getuserinfo', $event)"
    @chooseavatar="emits('chooseavatar', $event)"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { type ComponentInternalInstance, getCurrentInstance } from 'vue'
import type { FormType, Size, Type } from '../common/type/button'
import { fontSizes, sizes, styles } from '../common/config'

export default {
  behaviors: ['wx://form-field-button'],
}
</script>

<script lang="ts" setup>
interface IConfig {
  paddingLeft?: string
  paddingRight?: string
}

interface IProps extends IConfig {
  type?: Type
  size?: Size
  block?: boolean
  plain?: boolean
  color?: string
  borderColor?: string
  background?: string
  shadow?: string
  radius?: string
  restyle?: AnyObject | string
  disabled?: boolean
  loading?: boolean
  openType?: string
  formType?: FormType
}

const props = withDefaults(defineProps<IProps>(), {
  size: 'small',
  paddingLeft: '36rpx',
  paddingRight: '36rpx',
  radius: '0',
  ...styles.button,
})
const emits = defineEmits(['getphonenumber', 'getuserinfo', 'chooseavatar', 'submit', 'reset', 'click'])

const instance: ComponentInternalInstance | any = getCurrentInstance()

const buttonHeight = sizes[props.size]
const buttonFontSize = fontSizes[props.size]

function handleClick() {
  const { formType } = props
  const { exposed } = instance.parent || {}

  switch (formType) {
    case 'submit':
      exposed?.validate?.((formValue: any) => emits('submit', formValue))
      break

    case 'reset':
      exposed?.resetForm?.()
      break
  }

  emits('click')
}

function getButtonStyle(): AnyObject {
  const { restyle, color, borderColor, background, radius, shadow } = props

  if (restyle) return restyle

  return {
    color,
    borderColor,
    background,
    borderRadius: radius,
    shadow,
  }
}

function getButtonClass(): string {
  const { restyle, plain, disabled, type, block, loading } = props
  const classNames = ['button', `${type}`]

  if (restyle) return ''
  if (!block) classNames.push('inline-block')
  if (loading) classNames.push('events-none')
  if (plain) classNames.push(`plain plain-${type}`)
  if (disabled) classNames.push('button__disabled')

  return classNames.join(' ')
}
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: v-bind(paddingLeft);
  padding-right: v-bind(paddingRight);
  height: v-bind(buttonHeight);
  font-size: v-bind(buttonFontSize);
  line-height: v-bind(buttonHeight);
  vertical-align: middle;
}

.primary {
  color: white;
  background-color: var(--color-primary);
}

.danger {
  color: white;
  background-color: var(--color-error)
}

.stop {
  color: white;
  background-color: var(--color-stop);
}

.plain {
  background-color: transparent;
}

.plain-primary {
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.plain-danger {
  color: var(--color-error);
  border: 1px solid var(--color-error);
}

.plain-stop {
  color: var(--color-stop);
  border: 1px solid var(--color-stop);
}

.button__hover {
  opacity: 0.6;
}

.button__disabled {
  border-color: transparent;
}

.inline-block {
  display: inline-block;
}

.events-none {
  pointer-events: none;
}
</style>
