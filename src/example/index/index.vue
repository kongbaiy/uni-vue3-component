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

  <button @click="popupVisible = true">
    open popup
  </button>

  <popup v-model="popupVisible" show-mask>
    <view style="height: 200px;">
      popup
    </view>
  </popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const popupVisible = ref<boolean>(false)

function handleCodeButtonStart(next: () => void) {
  next()
}
</script>

<style lang="scss" scoped>
.btn {
  @apply bg-[var(--color-primary)] h56;
}
</style>
