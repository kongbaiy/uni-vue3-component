<template>
  <view
    :class="[
      'popover'!,
      `popover-position__${positionY}`,
      `popover-position__${positionX}`,
      block ? 'popover-block' : '',
      show && guide ? 'popover-guid' : '',

    ]"
  >
    <view
      :class="{
        'popover-content-guide': guide,
      }"
      @click="handlePopoverContent"
    >
      <slot />
    </view>

    <view
      v-if="show"
      :class="{
        'popover-list': true!,
        'popover-list__active': active,
      }"
      @transitionend="handleTransitionend"
    >
      <view v-if="$slots.actions">
        <slot
          name="actions"
          :close-popover="closePopover"
        />
      </view>

      <view v-else>
        <view
          v-for="item, index in options"
          :key="item[optionsKey || fieldNames?.value]"
          :class="{
            'popover-list-item': true!,
            'popover-list-item__disabled': item.disabled,
            'popover-list-item__active': activePopoverIndex === index,
          }"
          @click="handlePopoverListItem(item, index)"
        >
          {{ item?.[fieldNames?.label] }}
        </view>
      </view>
    </view>
  </view>

  <view
    v-if="show"
    :class="{
      'popover-mask': true!,
      'popover-mask__active': active,
      'popover-mask__show': (showMask || guide),
    }"
    catchtouchmove="emptyFunction"
    @click="closePopover"
  />
</template>

<script lang="ts" setup>
import { ref, watchPostEffect } from 'vue'
import { NodeSelector } from '../common/index'

  type Filter<Union, Exclude> = Union extends Exclude ? never : Union

  type Position = 'top' | 'bottom' | 'left' | 'right'

  type PositionY = Filter<Position, 'left' | 'right'>

  type PositionX = Filter<Position, 'top' | 'bottom'>

interface IOptions {
  disabled?: boolean
  [key: string]: any
}

interface IFieldNames {
  label: string
  value: any
}

interface IProps {
  boundaryOffset?: number
  options?: IOptions[]
  optionsKey?: string
  fieldNames?: IFieldNames
  modelValue?: any
  showMask?: boolean
  guide?: boolean
  position?: Position
  offsetY?: string
  offsetX?: string
  block?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  fieldNames: () => ({
    label: 'label',
    value: 'value',
  }),
  block: true,
})
const emits = defineEmits(['update:modelValue', 'popover', 'open'])

const { windowWidth = 0, windowHeight = 0 } = uni.getWindowInfo()
const show = ref<boolean>(false)
const active = ref<boolean>(false)
const getNode = new NodeSelector()
const positionY = ref<PositionY>(getPropPositionY())
const positionX = ref<PositionX>(getPropPositionX())
const isSetPosition = ref<boolean>(false)
const activePopoverIndex = ref<number>(-1)

watchPostEffect(() => {
  if (show.value) {
    getNode.query('.popover-list', async (plRes) => {
      if (!isSetPosition.value) {
        isSetPosition.value = true

        await getNode.query('.popover', (pRes) => {
          const { boundaryOffset = 0, position } = props
          const popperListOffsetLeft = plRes.left + plRes.width
          const popperListOffsetTop = pRes.top + pRes.height + plRes.height

          if (popperListOffsetLeft > windowWidth - boundaryOffset) positionX.value = 'right'
          else if (!position) positionX.value = 'left'

          if (popperListOffsetTop > windowHeight - boundaryOffset) positionY.value = 'top'
          else if (!position) positionY.value = 'bottom'
        })
      }

      active.value = true
    })
  }

  emits('open', show.value)
})

function handlePopoverContent() {
  if (!show.value) {
    show.value = true
  }
}

function handleTransitionend() {
  if (!active.value) show.value = false
}

function handlePopoverListItem(currentData: IOptions, currentIndex: number) {
  if (currentData.disabled) return

  const { fieldNames } = props
  const value = currentData?.[fieldNames.value]

  activePopoverIndex.value = currentIndex

  closePopover()
  emits('update:modelValue', value)
  emits('popover', currentData, currentIndex)
}

function getPropPositionY() {
  const { position } = props

  if (position === 'top' || position === 'bottom') return position
  return 'bottom'
}

function getPropPositionX() {
  const { position } = props

  if (position === 'left' || position === 'right') return position
  return 'left'
}

function getOffsetY(): string {
  const { offsetY } = props

  return offsetY || '20px'
}

function getOffsetX(): string {
  const { offsetX } = props

  return offsetX || '0'
}

function closePopover() {
  active.value = false
}

defineExpose({
  closePopover,
})
</script>

<style lang="scss" scoped>
  .popover {
    --offset-y: v-bind(getOffsetY());
    --offset-x: v-bind(getOffsetX());
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }

  .popover-block {
    display: block;
  }

  .popover-guide {
    z-index: 32;
  }

  .popover-content-guide {
    position: relative;
    z-index: 60;
    background-color: white;
  }

  .popover-list {
    opacity: 0;
    position: absolute;
    z-index: 32;
    padding: 16rpx;
    background-color: white;
    border-radius: 16rpx;
    transform: translateY(0);
    transition: all 200ms;
  }

  .popover-list-item {
      padding: 10rpx 36rpx;
      color: var(--color-h1);
      font-size: 32rpx;
      &:nth-child(n + 2) {
        margin-top: 8rpx;
      }
  }

  .popover-list-item__active {
      color: var(--color-primary);
      background-color: rgba(64,158,255,0.08);
  }

  .popover-position__top .popover-list {
      bottom: 80%;
  }

  .popover-position__top .popover-list::after {
      content: "";
      position: absolute;
      top: 99%;
      width: 0;
      height: 0;
      border: 14rpx solid transparent;
      border-top-color: white;
  }

  .popover-position__bottom .popover-list {
      top: 80%;
  }

  .popover-position__bottom .popover-list::after {
      content: "";
      position: absolute;
      bottom: 99%;
      width: 0;
      height: 0;
      border: 14rpx solid transparent;
      border-bottom-color: white;
  }

  .popover-position__left .popover-list {
      left: var(--offset-x);
  }

  .popover-position__left .popover-list::after {
      left: 20rpx;
  }

  .popover-position__right .popover-list {
      right: var(--offset-x);
  }

  .popover-position__right .popover-list::after {
      right: 20rpx;
  }

  .popover-position__top .popover-list__active {
    --y: calc(var(--offset-y) * -1);
      opacity: 1;
      transform: translateY(var(--y))
  }

  .popover-position__bottom .popover-list__active {
      opacity: 1;
      transform: translateY(var(--offset-y))
  }

  .popover-list-item__disabled {
    opacity: 0.3;
  }

  .popover-mask {
      opacity: 0;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 30;
      width: 100%;
      height: 100%;
      transition: all 200ms;
  }

  .popover-mask__active {
      opacity: 1;
  }

  .popover-mask__show {
      background-color: rgba(0,0,0,0.3);
  }
  </style>
