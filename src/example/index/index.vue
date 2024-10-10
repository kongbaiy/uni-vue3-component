<template>
  <view class="btn">
    view
  </view>
  <verify-code
    :delay="60"
    @start="handleCodeButtonStart"
  />

  <popover
    :show-mask="true"
    :guide="true"
    :block="false"
    position="right"
  >
    <view>
      popover
    </view>
    <template #actions>
      <view>adc</view>
    </template>
  </popover>
<!--
  <custom-button type="danger">
    warning
  </custom-button> -->
</template>

<script lang="ts" setup>
// import customButton from 'uni-vue3-components/src/components/button/button.vue'

function handleCodeButtonStart(next: () => void) {
  next()
}
</script>

<style lang="scss" scoped>
.btn {
  @apply bg-[var(--color-primary)] h56;
}
</style>
