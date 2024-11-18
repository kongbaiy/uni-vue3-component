<template>
  <list
    v-model="data"
    :action="action"
    :query="query"
    :response-config="(res: any) => {
      return {
        pageCount: res.data.page?.page,
        data: res.data?.data,
      }
    }"
    height="20vh"
  >
    <view style="height: 300rpx;background-color: #ddd;">
      view
    </view>
  </list>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

import list from '../../components/list/list.vue'

const data = ref({})
const query = reactive({
  page: 1,
  limit: 15,
  statusCode: 2,
})

async function action(data: any) {
  return uni.request({
    url: 'https://lightsoft.life/k2/invitation/1.0/authRecord',
    header: {
      authorization: 'eyJhbGciOiJIUzI1NiJ9.J89iVrrNAxPLDWD1Iodrl0tTK2rXoodBPoS7FPiNY66xwaFB2lbuliYsyWy6dJOx3gwNlmmEbu88Hej/s6hnWrqTAbERKVv2LECOz/R/nqFQG9JAE+TiwOXByP/+LChiRfeUMM+xkjfr9fvjQ0oMLcH1LK9nOHv6szYPt0giw7ScFetXssz8hZiLPsHCIaG6oATI86RpMwTsJqXTcTmTpGEnXxHgD0NpiTYcNG3RIDAY+4oV2rEmONnJTUbk7s7VgcNiR4cUdGCf0UoubKDB23c06KeNeLcrZxoWVX651CVHeFSkq3dfEjjRdzpiW5pQT60GdR6OAGG8n58CXY2ZMc25PAgF0+e8+XsduFBRfvcUfSJDa2XOgpTh14/SEHb42+Ox0UcH+7vw6EYVHQIHAw==.uLIZUtvTIqWbvHYBpXU0Qabs9QTorvXRSSIVTRtJTLk',
      sessionId: '1828765896655507456',
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
