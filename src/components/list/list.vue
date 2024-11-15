<template>
  <scroll-view
    scroll-y enable-passiv scroll-anchoring :refresher-enabled="refresherEnabled"
    :refresher-threshold="refresherThreshold" :refresher-triggered="refresherTriggered"
    :upper-threshold="upperThreshold" :lower-threshold="lowerThreshold" :scroll-top="newScrollTop"
    :scroll-with-animation="scrollWithAnimation" :show-scrollbar="showScrollbar" :style="{ height }"
    class="scroll-view-list" @refresherrefresh="handleRefresherrefresh" @refresherabort="handleRefresherabort"
    @scrolltoupper="handleScrolltoupper" @scrolltolower="handleScrolltolower"
  >
    <slot />

    <slot v-if="!listData.length && $slots.noData" name="noData" />

    <view v-if="!listData.length && !$slots.noData" class="no-data">
      —— 暂无数据 ——
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { fontSizes } from '../common/config'

interface IAnyObject {
  [key: string]: any
}

export interface IActionResponse extends IAnyObject {
  code: string | number
  data: any[]
}

export interface IFields {
  page: string
  pageCount: string
  data: string
}

interface IProps {
  // scroll-view 高度
  height?: string

  // 设置竖向滚动条位置
  scrollTop?: number

  // 距顶部/左边多远时（单位px），触发 scrolltoupper 事件
  upperThreshold?: number | string

  // 距底部/右边多远时（单位px），触发 scrolltolower 事件
  lowerThreshold?: number | string

  // 在设置滚动条位置时使用动画过渡
  scrollWithAnimation?: boolean

  // 控制是否出现滚动条
  showScrollbar?: boolean

  // 开启自定义下拉刷新
  refresherEnabled?: boolean

  // 设置自定义下拉刷新阈值, 默认45
  refresherThreshold?: number

  // 请求方法
  action?: (<T>(params?: T) => Promise<any>)

  // 请求参数
  query?: IAnyObject

  // 字段
  fields: IFields

  responseFilter?: string[]

  // 绑定数据
  modelValue?: IAnyObject

  // 页面显示时是否重置
  pageShowReset?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  lowerThreshold: 60,
  refresherEnabled: true,
  fields: () => ({
    page: 'current',
    pageCount: 'page',
    data: 'data',
  }),
  query: () => ({}),
})
const emits = defineEmits([
  'refresh',
  'refreshBort',
  'scrolltoupper',
  'scrolltolower',
  'update:modelValue',
])

const refresherTriggered = ref<boolean>(false)
const newScrollTop = ref<number>(props.scrollTop!)

const listData = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue
  return props.modelValue?.[props.fields.data] || []
})

const { normal } = fontSizes
const pageCount = ref<number>(1)

reAction()

// 自定义下拉刷新被触发
function handleRefresherrefresh() {
  if (typeof props.action !== 'function') {
    emits('refresh', handleRefresherEnd)
    return
  }

  reAction()
}

// 自定义下拉刷新被结束
function handleRefresherEnd(callback: () => void) {
  refresherTriggered.value = false
  callback?.()
}

// 自定义下拉刷新被中止
function handleRefresherabort() {
  refresherTriggered.value = false
  emits('refreshBort')
}

// 滚动到顶部/左边触发
function handleScrolltoupper() {
  emits('scrolltoupper')
}

// 滚动到底部/右边触发
function handleScrolltolower() {
  if (typeof props.action !== 'function') {
    emits('scrolltolower')
    return
  }

  loadAction()
}

async function reAction() {
  const {
    action,
    query,
    fields,
    responseFilter,
  } = props

  scrollToTop()
  refresherTriggered.value = true
  query[fields.page] = 1

  const result = objectAttributeFilter(await action?.(query), responseFilter)

  refresherTriggered.value = false
  pageCount.value = result[fields.pageCount]
  emits('update:modelValue', result)
}

async function loadAction() {
  const {
    action,
    query,
    fields,
    modelValue,
    responseFilter,
  } = props

  if (!modelValue || query[fields.page] >= pageCount.value) return

  query[fields.page] += 1

  const result = objectAttributeFilter(await action?.(query), responseFilter)

  pageCount.value = result[fields.pageCount]
  if (result.data?.length) {
    emits('update:modelValue', {
      ...modelValue,
      [fields.data]: modelValue?.[fields.data].concat(result.data),
    })
  }
}

function objectAttributeFilter(obj: IAnyObject, keys: string[] = []) {
  let result = { ...obj }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    result = result[key]
  }

  return result
}

function scrollToTop() {
  newScrollTop.value = newScrollTop.value === -1 ? 0 : -1
}

defineExpose({
  scrollToTop,
  reAction,
})
</script>

<style lang="scss" scoped>
.scroll-view-list {
    overflow-anchor: auto;
}

.no-data {
    padding: 42rpx 0;
    font-size: v-bind(normal);
    color: var(--color-h3);
    text-align: center;
}

.no-data-msg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.no-data-title {
    margin-top: 40rpx;
    font-size: v-bind(normal);
    font-weight: 600;
    color: var(--color-h3);
    text-align: center;
}
</style>
