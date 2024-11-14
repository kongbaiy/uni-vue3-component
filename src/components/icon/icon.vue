<template>
  <view :class="`icon icon-${type}`" />
</template>

<script lang="ts" setup>
import { getCssDefaultUint } from '../common/index'

interface IProps {
  type: string
  size?: string | number
  color?: string
}

const props = withDefaults(defineProps<IProps>(), {
  size: '20rpx',
  color: '#dbdddb',
})

const iconFontSize = getCssDefaultUint(props.size)
</script>

<style lang="scss" scoped>
@import url('../assets/icons/index.scss');

.icon {
    font-size: v-bind(iconFontSize);
    color: v-bind(color);
}
</style>
