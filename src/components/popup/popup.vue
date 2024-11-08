<template>
  <view
    v-if="show"
    :style="{
      width,
      height,
      background,
    }"
    :class="[
      'popup'!,
      `popup-${position}`,
      active ? `popup-${position}__active` : '',
    ]"
    @transitionend="handleTransitionend"
  >
    <view
      v-if="!$slots.header"
      class="popup-header"
    >
      {{ title }}
      <img
        src="../assets/images/delete@2x.png"
        alt="关闭"
        class="popup-close"
        @click="handleClose"
      >
    </view>

    <slot v-else name="header" />

    <view class="popup-content">
      <slot v-if="active" />
    </view>
  </view>

  <view
    v-if="showMask && show"
    :class="[
      'popup-mask'!,
      active ? 'popup-mask__active' : '',
    ]"
    catchtouchmove="emptyFunction"
    @click="clickClose && handleClose()"
  />
</template>

<script lang="ts" setup name="Popup">
import { type Ref, ref, watch, watchPostEffect } from 'vue'
import { NodeSelector } from '../common/index'

import { fontSizes } from '../common/config'

type Position = 'top' | 'bottom' | 'center' | 'right' | 'left'

interface IProps {
  modelValue: Ref<boolean>
  title?: string
  clickClose?: boolean
  position?: Position
  width?: string
  height?: string
  padding?: string
  background?: string
  showMask?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  clickClose: false,
  showMask: false,
  position: 'bottom',
  padding: '20rpx',
})
const emits = defineEmits<(e: 'update:modelValue', value: boolean) => void>()

const show = ref<boolean>(false)
const active: Ref = ref<boolean>(false)
const getNode = new NodeSelector()
const { large } = fontSizes

watch(() => props.modelValue, (newValue: IProps['modelValue']) => {
  if (newValue) show.value = true
  else active.value = false
})

watchPostEffect(() => {
  if (show.value) {
    getNode.query('.popup', () => {
      active.value = true
    })
  }
})

function handleClose() {
  emits('update:modelValue', false)
}

function handleTransitionend() {
  if (!props.modelValue && !active.value) show.value = false
}
</script>

  <style lang="scss" scoped>
  .popup-mask {
    opacity: 1;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 60;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .popup-mask__active {
    opacity: 1;
  }

  .popup {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 62;
    transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .popup-header {
    position: relative;
    margin-top: 40rpx;
    font-size: v-bind(large);
    text-align: center;
    color: var(--color-h1);
  }

  .popup-bottom {
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    width: 100%;
    border-top-left-radius: 32rpx;
    border-top-right-radius: 32rpx;
    background-color: white;
    transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .popup-bottom__active {
    transform: translateY(0);
  }

  .popup-content {
    flex: 1;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    padding: v-bind(padding);
  }

  .popup-close {
    position: absolute;
    top: -14rpx;
    right: 32rpx;
    width: 36rpx;
    height: 36rpx;
  }
  </style>
