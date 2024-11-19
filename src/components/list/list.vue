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

    <!-- 暂无数据提示 -->
    <slot v-if="noData && $slots.noData" name="noData" />
    <view v-if="noData && !$slots.noData" class="no-data">
      {{ noDataText }}
    </view>

    <!-- 无更多数据提示 -->
    <slot v-if="noMoreData && $slots.noMoreData" name="noMoreData" />
    <view v-if="noMoreData && !$slots.noMoreData" class="no-more-data">
      {{ noMoreDataText }}
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

export interface IResponseConfig {
  pageCount: string | number
  data: IAnyObject[]
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

  // 动态指定页数字段
  pageField?: string

  // 响应设置
  responseConfig: <T>(res: T) => IResponseConfig

  // 绑定数据
  modelValue?: IAnyObject

  // 暂时数据文字提示
  noDataText?: string

  // 无更多数据文字提示
  noMoreDataText?: string
}

const props = withDefaults(defineProps<IProps>(), {
  lowerThreshold: 60,
  refresherEnabled: true,
  pageField: 'page',
  query: () => ({}),
  responseConfig: () => ({
    pageCount: 1,
    data: [],
  }),
  noDataText: ' —— 暂无数据 ——',
  noMoreDataText: '没有更多的数据啦~',
})
const emits = defineEmits([
  'refresh',
  'refreshBort',
  'scrolltoupper',
  'scrolltolower',
  'update:modelValue',
])

const newScrollTop = ref<number>(props.scrollTop!)
const refresherTriggered = ref<boolean>(false)
const response = ref<IResponseConfig>({
  pageCount: 0,
  data: [],
})
const reActioned = ref<boolean>(false)
const { normal } = fontSizes

const noData = computed(() => {
  if (!response.value.data?.length && reActioned.value) return true
  return false
})
const noMoreData = computed(() => {
  if (props.query[props.pageField] === response.value.pageCount) return true
  return false
})

reAction()

// 自定义下拉刷新被触发
function handleRefresherrefresh() {
  if (typeof props.action !== 'function') {
    emits('refresh', handleRefresherEnd)
    return
  }

  const reActionBefore = () => refresherTriggered.value = true
  const reActionAfter = () => refresherTriggered.value = false

  reAction(reActionBefore, reActionAfter)
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

async function reAction(before?: () => void, after?: () => void) {
  try {
    const {
      action,
      query,
      pageField,
      responseConfig,
    } = props

    scrollToTop()
    before?.()
    query[pageField] = 1

    const result = await action?.(query)

    reActioned.value = true
    response.value = responseConfig(result)
    emits('update:modelValue', response.value)
  } finally {
    after?.()
  }
}

async function loadAction() {
  const {
    action,
    query,
    pageField,
    responseConfig,
    modelValue,
  } = props

  if (!modelValue || query[pageField] >= response.value?.pageCount) return
  query[pageField] += 1

  const result = await action?.(query)
  response.value = responseConfig(result)

  if (modelValue.data?.length) {
    emits('update:modelValue', {
      ...modelValue,
      data: modelValue.data.concat(response.value.data),
    })
  }
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

.no-data,
.no-more-data {
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
