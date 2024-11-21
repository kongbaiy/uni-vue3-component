<template>
  <view
    :style="{ borderColor, background, borderRadius }"
    class="search-box"
  >
    <view class="search-prefix">
      <custom-icon
        type="search"
        :size="42"
      />
    </view>

    <input
      v-model="inputValue"
      type="text"
      :hold-keyboard="holdKeyboard"
      :focus="newFocus"
      :placeholder="placeholder"
      :placeholder-style="`color:${placeholderColor};`"
      :confirm-type="confirmType"
      class="search-input"
      @input="handleInput"
      @focus="handleFocus"
      @confirm="handleConfirm"
      @blur="handleBlur"
    >

    <view class="search-suffix">
      <custom-icon
        v-show="inputValue.length"
        type="search-clear"
        :size="42"
        @tap="handleClear"
      />
    </view>
  </view>
</template>

<script lang="ts" setup name="Search">
import { ref, watch } from 'vue'
import { fontSize, style } from '../common/config'

import customIcon from '../icon/icon.vue'

type ConfirmType = 'send' | 'search' | 'next' | 'go' | 'done'

interface IProps {
  focus?: boolean
  debounceTime?: number
  confirmType?: ConfirmType
  holdKeyboard?: boolean
  borderRadius?: string
  showIcon?: boolean
  placeholder?: string
  placeholderColor?: string
  borderColor?: string
  background?: string
}

const props = withDefaults(defineProps<IProps>(), {
  confirmType: 'search',
  debounceTime: 600,
  showIcon: true,
  placeholderColor: '#666',
  borderColor: '#ddd',
  background: '#fff',
  borderRadius: '34rpx',
  ...style.search,
})
const emits = defineEmits(['input', 'input:debounce', 'focus', 'blur', 'confirm', 'update:debounce'])

const inputValue = ref<string>('')
const newFocus = ref<boolean>(false)
const { normal } = fontSize

const inputDebounce = debounce((value: string) => {
  emits('input:debounce'!, value)
  emits('update:debounce'!, value)
}, props.debounceTime)

watch(() => props.focus, (newValue) => {
  newFocus.value = newValue as boolean
})

function handleInput(e: any) {
  const { value } = e.target

  emits('input', value)
  inputDebounce(value)
}

function debounce(fn: (value: string) => void, delay: number) {
  let time: any = null

  return (value: string) => {
    if (time !== null) {
      clearTimeout(time)
    }

    time = setTimeout(() => {
      fn?.(value)
    }, delay)
  }
}

function handleFocus(e: CustomEventInit) {
  emits('focus', e)
}

function handleConfirm(e: CustomEventInit) {
  emits('confirm', e)
}

function handleBlur(e: CustomEventInit) {
  newFocus.value = false
  emits('blur', e)
}

function handleClear() {
  inputValue.value = ''
  newFocus.value = true

  emits('input', '')
  emits('input:debounce'!, '')
  emits('update:debounce'!, '')
}
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  align-items: center;
  height: 68rpx;
  border: 1px solid;
}

.search-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8rpx;
  padding-left: 24rpx;
  height: 100%;
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: v-bind(normal);
}

.search-suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24rpx;
  height: 100%;
}
</style>
