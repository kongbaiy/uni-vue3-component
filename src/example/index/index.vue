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
    @click="popupVisible = true"
  >
    Button
  </zs-button>

  <zs-button
    plain
    type="primary"
    @click="popupVisible = true"
  >
    Button
  </zs-button>

  <zs-form
    ref="form"
    v-model="formData"
    prompt-mode="toast"
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

    <zs-button block type="primary" @click="handleReset">
      重置
    </zs-button>
  </zs-form>

  <slide-delete>
    <view class="h-60 bg-#ddd">
      删除
    </view>
  </slide-delete>

  <popup
    v-model="popupVisible"
    show-mask
  >
    <view style="height: 200px;">
      popup
    </view>
  </popup>

  <tab-nav :data="tabData" data-key="title">
    <template #default="row">
      <view :style="{ margin: '0 1px', width: '200rpx', height: '60rpx', fontSize: '20rpx', background: '#ddd' }">
        {{ row.currentData.title }}{{ row.currentIndex }}
      </view>
    </template>
  </tab-nav>

  <zs-button type="danger" @click="handleDialog">
    dialog
  </zs-button>
  <zs-dialog v-model="dialogVisible" show-mask title="dialog">
    dialog
  </zs-dialog>

  <zs-radio-group v-model="radioValue">
    <zs-radio value="a" active-color="red">
      a
    </zs-radio>
    <zs-radio value="b">
      b
    </zs-radio>
  </zs-radio-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import zsButton from '../../components/button/button.vue'
import zsForm from '../../components/form/form.vue'
import zsFormItem from '../../components/form-item/form-item.vue'
import slideDelete from '../../components/slide-delete/slide-delete.vue'
import tabNav from '../../components/tab/nav.vue'
import zsDialog from '../../components/dialog/dialog.vue'
import zsRadioGroup from '../../components/radio-group/radio-group.vue'
import zsRadio from '../../components/radio/radio.vue'

const popupVisible = ref<boolean>(false)
const formData = ref<any>({
  organization: 'organization',
  name: '',
})
const rules: any = {
  organization: [
    { message: '请输入机构' },
  ],
  name: [
    { message: '请输入择姓名' },
  ],
}
const form = ref()
const tabData = ref<any[]>([
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
  { title: '笔记本' },
])
const dialogVisible: any = ref<boolean>(false)
const radioValue = ref<string>('b')

function handleCodeButtonStart(next: () => void) {
  next()
}

function handleSubmit() {
  form.value.validate(() => {
    console.log('yes')
  })
}

function handleReset() {
  form.value.resetForm()
}

function handleDialog() {
  dialogVisible.value = true
}
</script>
