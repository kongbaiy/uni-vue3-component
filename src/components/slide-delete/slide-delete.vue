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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 140rpx;
    height: 100%;
    color: white;
    background-color: var(--color-error);
  }
</style>
