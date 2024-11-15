<template>
  <view
    :class="[isExpand ? 'text-box' : 'text-box__active']"
  >
    <view :style="textContentStyle" class="text-content">
      {{ content }}
    </view>

    <view
      v-if="showEllipsis && !isExpand"
      class="ellipsis"
    >
      ...
    </view>
  </view>

  <view
    v-if="showEllipsis"
    class="expand"
    @click="handleExpand(!isExpand)"
  >
    <text v-if="!$slots.expand">
      {{ isExpand ? collapseText : expandText }}
    </text>
    <slot name="expand" />
  </view>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { NodeSelector } from '../common/index'

import { fontSizes } from '../common/config'

interface IProps {
  content: string
  lineClamp?: number
  lineHeight?: number
  expandText?: string
  collapseText?: string
  color?: string
}

const props = withDefaults(defineProps<IProps>(), {
  lineClamp: 1,
  lineHeight: Number.parseInt(fontSizes.normal) * 1.4,
  expandText: '展开',
  collapseText: '收起',
})

const getNode = new NodeSelector()
const showEllipsis = ref<boolean>(false)
const isExpand = ref<boolean>(false)
const { normal, small } = fontSizes

const textBoxHeight = computed(() => `${props.lineClamp * props.lineHeight}rpx`)
const textContentStyle = computed(() => {
  return {
    lineHeight: `${props.lineHeight}rpx`,
    color: props.color,
  }
})

onMounted(() => {
  const { windowWidth = 0 } = uni.getWindowInfo()
  const rpx = windowWidth / 750

  getNode.query('.text-content', (nodeInfo: UniApp.NodeInfo | undefined) => {
    const { height = 0 } = nodeInfo || {}
    const textHeight = Number.parseInt((height / rpx) as unknown as string)
    const row = Math.round(textHeight / props.lineHeight)

    if (row > props.lineClamp) showEllipsis.value = true
  })
})

function handleExpand(status: boolean) {
  isExpand.value = status
}
</script>

<style lang="scss" scoped>
  .text-box,
  .text-box__active {
    overflow: hidden;
    position: relative;
  }

  .text-box__active {
    height: v-bind(textBoxHeight);
  }

  .text-content {
    font-size: v-bind(normal);
    color: var(--color-h1);
  }

  .ellipsis {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 10rpx;
    background-color: white;
  }

  .expand {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: v-bind(small);
    color: var(--color-primary);
  }
</style>
