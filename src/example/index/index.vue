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

  <zs-button
    plain
    type="primary"
  >
    Button
  </zs-button>

  <zs-form
    ref="form"
    v-model="formData"
    :rules="rules"
    align="justify"
    label-width="200rpx"
    label-gap="20px"
    gap="20rpx"
  >
    <zs-form-item label="所属机构" prop="organization" required>
      <input
        v-model="formData.organization"
        type="text"
        placeholder="请选择所属机构"
        class="form-input"
      >
    </zs-form-item>

    <picker>
      <zs-form-item label="姓名" prop="name" required>
        <input
          v-model="formData.name"
          type="text"
          placeholder="请输入姓名"
          class="form-input"
        >
      </zs-form-item>
    </picker>

    <zs-button block type="primary" @click="handleSubmit">
      提交
    </zs-button>
  </zs-form>

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
import { reactive, ref } from 'vue'

import zsButton from '../../components/button/button.vue'
import zsForm from '../../components/form/form.vue'
import zsFormItem from '../../components/form-item/form-item.vue'

const popupVisible = ref<boolean>(false)
const formData = reactive<any>({
  organization: 'adad',
  name: '',
})
const rules: any = {
  organization: [
    { message: '请输入机构' },
  ],
  name: [
    { message: '请选择姓名' },
  ],
}
const form = ref()

function handleCodeButtonStart(next: () => void) {
  next()
}

function handleSubmit() {
  form.value.validate(() => {
    console.log('yes')
  })
}
</script>
