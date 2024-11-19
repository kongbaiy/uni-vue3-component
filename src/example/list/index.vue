<template>
  <list
    v-model="data"
    :action="action"
    :query="query"
    :response-config="getListResponseConfig"
    no-more-data-text="!!"
    height="100vh"
  >
    <view
      v-for="item in data.data"
      :key="item.assistUserCode"
      style="height: 300rpx;background-color: #ddd;"
    >
      {{ item.productAlias }}
    </view>
  </list>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'

import list from '../../components/list/list.vue'

const data = ref<any>({})
const query = reactive({
  page: 1,
  limit: 15,
  statusCode: 2,
})
watch(data, (newValue: any[]) => {
  console.log(newValue)
}, {
  deep: true,
})

function getListResponseConfig(res: any) {
  return {
    pageCount: res.data.page?.page,
    data: res.data?.data,
  }
}

async function action(data: any) {
  return uni.request({
    url: 'https://lightsoft.life/k2/invitation/1.0/authRecord',
    header: {
      authorization: 'eyJhbGciOiJIUzI1NiJ9.J89iVrrNAxPLDWD1Iodrl0tTK2rXoodBPoS7FPiNY66xwaFB2lbuliYsyWy6dJOx3gwNlmmEbu88Hej/s6hnWrqTAbERKVv2LECOz/R/nqFQG9JAE+TiwOXByP/+LChiRfeUMM+xkjfr9fvjQ0oMLcH1LK9nOHv6szYPt0giw7Qpe+ume32WBib26kIyeI94lOFRzjakvfqFk3bXbr3ntwX/PFTfWelUoTgZHGKSKv6Tr96DXvZWPnqyeeguBcU+e01RMZuCcMKn65bg8m1UUn2okR+E44Glu99a7s6k6bnZgMUrn0jxiRIte81IqUxXKjGCB0MFOvG1CR8a/1NaDxkzLsO5vy5fIeWyLHL4oye4EsClUtkWA8sUx6+5r4No+R04w+Gn+LoRvfBk9fqBLA==.uTf89Awp6lV7GIrh0Wh7QJHUuT9Bc8C4DkYev2Kj-yA',
      sessionId: '1829193062744592384',
    },
    data,
  })
}
</script>

<style lang="scss" scoped>
.list-item {
    margin-top: 1px;
    height: 80rpx;
    background-color: #ddd;
}
</style>
