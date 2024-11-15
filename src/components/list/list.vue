<template>
  <scroll-view
    scroll-y
    enable-passiv
    scroll-anchoring
    :refresher-enabled="refresherEnabled"
    :refresher-threshold="refresherThreshold"
    :refresher-triggered="refresherTriggered"
    :upper-threshold="upperThreshold"
    :lower-threshold="lowerThreshold"
    :scroll-top="newScrollTop"
    :scroll-with-animation="scrollWithAnimation"
    :show-scrollbar="showScrollbar"
    :style="{ height }"
    :class="`${className} scroll-view-list`"
    @refresherrefresh="handleRefresherrefresh"
    @refresherabort="handleRefresherabort"
    @scrolltoupper="handleScrolltoupper"
    @scrolltolower="handleScrolltolower"
  >
    <slot />

    <slot
      v-if="scrolltolower && !scrolltolower.length && $slots.noData"
      name="noData"
    />
    <view
      v-else
      class="no-data"
    >
      —— 暂无数据 ——
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { fontSizes } from '../common/config'

interface IAnyObject {
  [key: string]: any
}

export interface IActionResponse extends IAnyObject {
  code: string | number
  data: any[]
}

interface IProps {
  // scroll-view 高度
  height?: string

  // 类名
  className?: string

  // 设置竖向滚动条位置
  scrollTop?: number | string

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

  // 双向绑定数据(字段名创建有误，易混淆、不易区分，后续优化)
  scrolltolower?: any

  // 请求方法
  action?: (<T>(params?: T) => Promise<any>)

  // 请求参数
  actionParams?: IAnyObject

  // 动态指定当前page字段
  currentPageFieldName?: string

  // 总页数
  pageCount?: number

  // 请求响应回调设置
  actionResponse?: <T>(response: T) => IActionResponse

  // 页面显示时是否重置
  pageShowReset?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  lowerThreshold: 60,
  currentPageFieldName: 'page',
  pageCount: 1,
  actionParams: () => ({}),
})
const emits = defineEmits(['refresh', 'refreshBort', 'scrolltoupper', 'scrolltolower', 'update:scrolltolower'])
const refresherTriggered = ref<boolean>(false)
const newScrollTop = ref<number | string>(0)
let isFirst = true
const { normal } = fontSizes

onShow(() => {
  if (props.pageShowReset && !isFirst) resetPageParams()
  isFirst = false
})

// 自定义下拉刷新被触发
function handleRefresherrefresh() {
  const {
    action,
    actionResponse,
    actionParams,
  } = props

  refresherTriggered.value = true

  if (typeof action === 'function') {
    resetPageParams()

    action(actionParams).then((res: any) => {
      if (typeof actionResponse === 'function') res = actionResponse(res)

      emits('update:scrolltolower', res.data)
    }).finally?.(() => {
      refresherTriggered.value = false
    })

    return
  }

  emits('refresh', handleRefresherEnd)
}

// 自定义下拉刷新被结束
function handleRefresherEnd(refresherEndCallback: () => void) {
  refresherTriggered.value = false
  refresherEndCallback?.()
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
  const {
    action,
    actionResponse,
    actionParams,
    currentPageFieldName,
    pageCount,
    scrolltolower,
  } = props

  if (!actionParams[currentPageFieldName]) actionParams[currentPageFieldName] = 1
  const currentPage = actionParams[currentPageFieldName]

  if (typeof action === 'function' && currentPage < pageCount) {
    actionParams[currentPageFieldName] += 1

    action(actionParams).then((res: any) => {
      if (typeof actionResponse === 'function') res = actionResponse(res)
      if (res.code === 200 && res.data?.length) emits('update:scrolltolower', scrolltolower.concat(res.data))
    })

    return
  }

  emits('scrolltolower')
}

function resetPageParams() {
  const {
    actionParams,
    currentPageFieldName,
  } = props

  actionParams[currentPageFieldName] = 1
  scrollToTop()
}

function scrollToTop() {
  newScrollTop.value = newScrollTop.value === -1 ? 0 : -1
}

defineExpose({
  scrollToTop,
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
