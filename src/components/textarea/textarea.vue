<template>
  <view class="textarea-container">
    <textarea
      :disabled="disabled" :placeholder="placeholder" :placeholderStyle="placeholderStyle"
      :maxlength="maxlength" class="textarea" @input="handleTextareaInput"
    />
    <view v-if="wordNumber && maxlength" class="word-number">
      {{ wordNumber }} / {{ maxlength }}
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { fontSizes, styles } from '../common/config'

interface IProps {
  modelValue?: string
  disabled?: boolean
  maxlength?: number
  placeholder?: string
  placeholderStyle?: string
  padding?: string
  height?: string
  borderRadius?: string
  background?: string
  wordNumber?: boolean
}

withDefaults(defineProps<IProps>(), {
  padding: '12rpx 20rpx',
  height: '240rpx',
  borderRadius: '8rpx',
  ...styles.textarea,
})
const emits = defineEmits(['update:modelValue'])

const wordNumber = ref<number>(0)
const { small, normal } = fontSizes

function handleTextareaInput(e: any) {
  wordNumber.value = e.target.value.length
  emits('update:modelValue', e.target.value)
}
</script>

<style lang="scss" scoped>
.textarea-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: v-bind(padding);
  height: v-bind(height);
  font-size: v-bind(normal);
  color: var(--color-h1);
  background: v-bind(background);
  border-radius: v-bind(borderRadius);

  .textarea {
    flex: 1;
    width: 100%;
  }

  .word-number {
    font-size: v-bind(small);
    color: var(--color-h3);
    text-align: right;
  }
}
</style>
