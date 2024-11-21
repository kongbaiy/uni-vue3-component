<template>
  <view
    v-if="show"
    :class="{
      dialog: true!,
      dialog__active: active,
    }"
    @transitionend="handleTransitionend"
  >
    <view class="dialog-title">
      {{ title }}
    </view>

    <view :style="{ height: contentHeight }" class="dialog-content">
      <slot />
    </view>

    <slot v-if="$slots.footer" name="footer" />
    <view v-else class="dialog-footer">
      <view class="dialog-confirm" @click="handleConfirm">
        {{ confirmText }}
      </view>
      <view class="dialog-cancel" @click="handleCancel">
        {{ cancelText }}
      </view>
    </view>
  </view>

  <view
    v-if="showMask && show" catchtouchmove="emptyFunction"
    :class="['dialog-mask'!, active ? 'dialog-mask__active' : '']" @click="clickMaskClose && handleClose()"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { NodeSelector } from '../common/index'

import { fontSize, style } from '../common/config'

interface IProps {
  title: string
  modelValue: boolean
  showMask: boolean
  clickMaskClose?: boolean
  contentHeight?: string
  contentPadding?: string
  cancelText?: string
  confirmText?: string
}

const props = withDefaults(defineProps<IProps>(), {
  showMask: true,
  contentPadding: style.dialog?.padding || '0 20rpx 20rpx 20rpx',
  cancelText: '取消',
  confirmText: '确定',
})

const emits = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const show = ref<boolean>(false)
const active: Ref = ref<boolean>(false)
const getNode = new NodeSelector()
const { normal, large } = fontSize

watch(props, (newProps: any) => {
  const { modelValue } = newProps

  if (modelValue) {
    show.value = true
    getNode.query('.dialog', () => {
      active.value = newProps.modelValue
    })
  }
  else {
    active.value = false
  }
}, {
  deep: true,
  immediate: true,
})

function handleClose() {
  emits('update:modelValue', false)
}

function handleTransitionend() {
  if (!props.modelValue && !active.value) show.value = false
}

function handleConfirm() {
  emits('confirm')
  emits('update:modelValue', false)
}

function handleCancel() {
  emits('cancel')
  emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.dialog {
  overflow: hidden;
  opacity: 0;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  z-index: 62;
  width: 80%;
  background-color: white;
  border-radius: 14rpx;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog__active {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.dialog-content {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: v-bind(contentPadding);
}

.dialog-mask {
  position: fixed;
  top: 0;
  z-index: 60;
  opacity: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-mask__active {
  opacity: 1;
}

.dialog-title {
  height: 80rpx;
  font-size: v-bind(normal);
  color: var(--color-h1);
  font-weight: 600;
  text-align: center;
  line-height: 80rpx;
}

.dialog-footer {
  display: flex;
  align-items: center;
}

.dialog-confirm,
.dialog-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 80rpx;
  font-size: v-bind(large);
  font-weight: 600;
}

.dialog-confirm {
  background-color: var(--theme);
  color: white;
}

.dialog-cancel {
  color: var(--color-h1);
}
</style>
