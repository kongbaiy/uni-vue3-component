<template>
  <slide-action ref="slideActionRef">
    <slot />

    <template #action>
      <view class="delete" @click="handleDelete">
        删除
      </view>
    </template>
  </slide-action>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SlideAction from '../slide-action/slide-action.vue'

const emits = defineEmits(['delete'])
const slideActionRef = ref()

function handleDelete() {
  const { closeSlideAction } = slideActionRef.value

  closeSlideAction()
  emits('delete', slideActionRef.value)
}
</script>

<style lang="scss" scoped>
  .delete {
    @apply flex flex-col justify-center items-center w-140rpx h-full color-white bg-[var(--color-error)];
  }
</style>
