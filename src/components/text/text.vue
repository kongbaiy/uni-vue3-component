<template>
  <view>
    <view
      v-if="!$slots.content"
      :class="[isExpand ? 'text-box' : 'text-box__active']"
    >
      <view class="content">
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
      v-else
      :class="[isExpand ? 'text-box' : 'text-box__active']"
    >
      <view class="text">
        <slot name="content" />
      </view>
    </view>

    <view
      v-if="showEllipsis"
      class="expand"
      @click="handleExpand(!isExpand)"
    >
      {{ isExpand ? collapseText : expandText }}
      <slot name="expand-icon" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { NodeSelector } from '../common/index'

import { fontSizes } from '../common/config'

interface IProps {
  content: string
  lineClamp?: number
  baseLineHeight?: number
  expandText?: string
  collapseText?: string
}

const props = withDefaults(defineProps<IProps>(), {
  lineClamp: 1,
  baseLineHeight: 40,
  expandText: '展开',
  collapseText: '收起',
})

const getNode = new NodeSelector()
const showEllipsis = ref<boolean>(false)
const isExpand = ref<boolean>(false)
const { normal, small } = fontSizes

const textBoxHeight = computed(() => `${props.lineClamp * props.baseLineHeight}rpx`)

onMounted(() => {
  const { windowWidth = 0 } = uni.getSystemInfoSync()
  const rpx = windowWidth / 750

  getNode.query('.text', (nodeInfo: UniApp.NodeInfo | undefined) => {
    const { height = 0 } = nodeInfo || {}
    const textHeight = Number.parseInt((height / rpx) as unknown as string)
    const row = Math.round(textHeight / props.baseLineHeight)

    if (row > props.lineClamp) {
      showEllipsis.value = true
    }
  })
})

function handleExpand(status: boolean) {
  isExpand.value = status
}
</script>

<style lang="scss" scoped>
  .content {
    font-size: v-bind(normal);
    color: var(--color-h1);
  }

  .ellipsis {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .expand {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8rpx;
    font-size: v-bind(small);
    color: var(--color-primary);
  }

  .text-box,
  .text-box__active {
    overflow: hidden;
    position: relative;
  }

  .text-box__active {
    height: v-bind(textBoxHeight);
  }
</style>
