<template>
  <view :class="`navbar ${isFixed && 'navbar-fixed'}`">
    <view
      v-if="navbarInnerHeight"
      :style="{
        paddingTop: navbarPaddingTop,
        height: navbarInnerHeight,
        background: backgroundValue,
        color,
      }"
      class="navbar-content"
    >
      <view
        :style="{ width: navbarLeftWidth }"
        class="navbar-left-content"
      >
        <view
          class="go-back-wrap"
          hover-class="active"
          hover-stay-time="100"
          aria-role="button"
          aria-label="返回"
        >
          <view
            v-if="isShowGoBack"
            :style="{ backgroundColor: getGoBackColor() }"
            class="go-back"
            @click="handleGoBack"
          />
          <view
            v-if="isShowGoBackHome && showHome"
            :style="{ backgroundColor: getGoBackColor() }"
            class="go-back-home"
            @click="handleGoBackHome"
          />
        </view>
      </view>

      <view class="navbar-center-content">
        <slot v-if="$slots.title" name="title" />
        <text v-else class="title">
          {{ title }}
        </text>
      </view>
      <view />
    </view>
  </view>

  <slot v-if="$slots.default" />

  <view
    v-else
    :style="{
      paddingTop: navbarPaddingTop,
      height: navbarInnerHeight,
      boxSizing: 'border-box',
    }"
  />
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, onMounted, ref } from 'vue'

// 打包编译后的路径
// unused-imports/no-unused-imports
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import pagesJSON from '@/pages.json'

interface IProps {
  title: string
  delta?: number
  isFixed?: boolean
  color?: string
  goBackColor?: string
  background?: string
  backgroundTransition?: boolean
  backgroundTransitionEnd?: number
  showHome?: boolean
  onPageScroll?: <T>(args: T) => void
}

const props = withDefaults(defineProps<IProps>(), {
  delta: 1,
  showHome: true,
  backgroundTransitionEnd: 100,
})

const isShowGoBack = ref<boolean>(false)
const navbarLeftWidth: Ref = ref<string>()
const navbarPaddingTop: Ref = ref<string>()
const navbarInnerHeight: Ref = ref<string>()
const scrollTop = ref<number>(0)
const isShowGoBackHome = ref<boolean>(false)

onMounted(() => {
  const pages = getCurrentPages()
  const { windowWidth = 0, safeArea = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
  } }: UniNamespace.GetSystemInfoResult = uni.getSystemInfoSync()
  const rect: UniApp.GetMenuButtonBoundingClientRectRes = uni.getMenuButtonBoundingClientRect()

  navbarLeftWidth.value = `${windowWidth - rect.left}px`
  navbarPaddingTop.value = `${safeArea.top}px`
  navbarInnerHeight.value = `${44 + (safeArea.top)}px`

  if (pages.length > 1) isShowGoBack.value = true
  isShowGoBackHome.value = getIsShowGoBackHome(pages[pages.length - 1].route!, pages)
})

props.onPageScroll?.((e: Page.PageScrollOption) => {
  if (props.backgroundTransition) scrollTop.value = e.scrollTop
})

const backgroundValue = computed(() => {
  const { backgroundTransition, background, backgroundTransitionEnd } = props

  if (!backgroundTransition) return background

  const alpha = (scrollTop.value - backgroundTransitionEnd) / backgroundTransitionEnd
  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group
  const rgb = background?.replace(/^rgba\(((,?\s*\d+){3}).+$/, '$1')

  if (alpha && rgb) return `rgba(${rgb}, ${alpha})`
  return `rgba(${rgb}, 0)`
})

function handleGoBack() {
  const { delta } = props

  if (delta) {
    uni.navigateBack({
      delta,
    })
  }
}

function getGoBackColor() {
  const { goBackColor = '', background = '' } = props

  if (goBackColor?.length) return goBackColor

  const newValue = background.includes('#') ? background.toLowerCase() : background
  const fffHexRegExp = /^#f{3,6}$/
  // eslint-disable-next-line regexp/no-unused-capturing-group
  const fffRegExp = /^(rgba|rgb)\(((,?\s*255){3}).+$/

  if (
    fffHexRegExp.test(newValue)
    || fffRegExp.test(newValue)
    || newValue === 'white'
    || (!goBackColor?.length && !background?.length)
  ) { return 'black'
  }

  return 'white'
}

function handleGoBackHome() {
  const { pages = [], tabBar } = pagesJSON || {}
  const tabBarPath = tabBar.list[0]?.path
  const pagePath = pages[0]?.path

  if (tabBarPath) {
    uni.switchTab({
      url: `/${tabBarPath}`,
    })
    return
  }

  uni.reLaunch({
    url: `/${pagePath}`,
  })
}

function getIsShowGoBackHome(pagePath: string, pageStack: Page.PageInstance<AnyObject, object>[]): boolean {
  const { pages, tabBar } = pagesJSON
  const homePath = pages?.[0]?.path
  const isTabBarHome = tabBar?.list?.some((item: any) => item.pagePath === pagePath)

  if (homePath !== pagePath && !isTabBarHome && pageStack.length === 1) return true
  return false
}
</script>

<style lang="scss" scoped>
.navbar {
  --color-black:rgba(0,0,0,.9);
  --color-white: rgba(255,255,255,0.9);
}

.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 320;
  width: 100%;
}

.active {
  opacity: 0.5;
}

.navbar-content {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding-right: 94px;
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-left-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  padding-left: 16rpx;
}

.go-back-wrap {
  display: flex;
  align-items: center;
  margin: -11px -18px 11px -16px;
  padding: 11px 18px 11px 16px;
}

.go-back {
  width: 12px;
  height: 24px;
  font-size: 12px;
  -webkit-mask: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E  %3Cpath fill-opacity='.9' fill-rule='evenodd' d='M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5 10 4.563 2.682 12 10 19.438z'/%3E%3C/svg%3E") no-repeat 50% 50%;
  mask: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E  %3Cpath fill-opacity='.9' fill-rule='evenodd' d='M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5 10 4.563 2.682 12 10 19.438z'/%3E%3C/svg%3E") no-repeat 50% 50%;
  -webkit-mask-size: cover;
  mask-size: cover;
}

.go-back-home {
  margin-left: 14rpx;
  width: 32rpx;
  height: 32rpx;
  font-size: 32rpx;
  -webkit-mask: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.278 30.954v-7.967c0-2.93-2.363-5.307-5.278-5.307-2.915 0-5.278 2.376-5.278 5.307v7.967a.88.88 0 0 1-.88.88H1.047a.88.88 0 0 1-.88-.88V11.077c0-.296.148-.572.392-.736L15.512.315a.876.876 0 0 1 .976 0l14.954 10.026c.244.164.391.44.391.736v19.877a.88.88 0 0 1-.88.88h-8.796a.88.88 0 0 1-.88-.88z' fill='%23FFF' fill-rule='evenodd'/%3E%3C/svg%3E");
  mask: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.278 30.954v-7.967c0-2.93-2.363-5.307-5.278-5.307-2.915 0-5.278 2.376-5.278 5.307v7.967a.88.88 0 0 1-.88.88H1.047a.88.88 0 0 1-.88-.88V11.077c0-.296.148-.572.392-.736L15.512.315a.876.876 0 0 1 .976 0l14.954 10.026c.244.164.391.44.391.736v19.877a.88.88 0 0 1-.88.88h-8.796a.88.88 0 0 1-.88-.88z' fill='%23FFF' fill-rule='evenodd'/%3E%3C/svg%3E");
  -webkit-mask-size: cover;
  mask-size: cover;
}

.navbar-center-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 0;
  font-size: 14px;
  text-align: center;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
