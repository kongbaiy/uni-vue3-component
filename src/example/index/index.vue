<template>
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

  <btn
    plain
    type="primary"
  >
    Button
  </btn>

  <ks-form
    line-height="100"
    border-color="blue"
    label-width="113rpx"
    label-align="justify"
  >
    <ks-form-item label="所属机构" border>
      <input
        type="text"
        placeholder="请选择所属机构"
        class="form-input"
      >
    </ks-form-item>

    <picker>
      <ks-form-item label="姓名" border>
        <input
          type="text"
          placeholder="请输入姓名"
          class="form-input"
        >
      </ks-form-item>
    </picker>
  </ks-form>

  <popup
    v-model="popupVisible"
    show-mask
  >
    <view style="height: 200px;">
      popup
    </view>
  </popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import btn from '../../components/button/button.vue'

const popupVisible = ref<boolean>(false)

function handleCodeButtonStart(next: () => void) {
  next()
}
</script>
