<template>
  <list
    v-model="data"
    :action="action"
    :query="query"
    :response-filter="['data']"
    height="20vh"
  >
    <view style="height: 300rpx;background-color: #ddd;">
      view
    </view>
  </list>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'

import list from '../../components/list/list.vue'

const data = ref({})
const query = reactive({
  page: 1,
  limit: 15,
  statusCode: 2,
})

watch(data, (newValue: any) => {
  console.log('newValue:', newValue)
}, {
  deep: true,
})

async function action(data: any) {
  return uni.request({
    url: 'https://lightsoft.life/k2/invitation/1.0/authRecord',
    header: {
      authorization: 'eyJhbGciOiJIUzI1NiJ9.J89iVrrNAxPLDWD1Iodrl0tTK2rXoodBPoS7FPiNY66xwaFB2lbuliYsyWy6dJOx3gwNlmmEbu88Hej/s6hnWrqTAbERKVv2LECOz/R/nqFQG9JAE+TiwOXByP/+LChiRfeUMM+xkjfr9fvjQ0oMLcH1LK9nOHv6szYPt0giw7R4Vf7p92oBm/ZklvU3an6w128HnC9J7wzmCub7FDd9KmYK7d9M1LK7MKId0UNptiVk6LcTZUjCkUulEeqaKitbw7z6MIch2LaP4R3OeSvqywEKCriG1Dn00Lvlmv0zFUn7ROu4tQU0nIyxgg6oRdHj2aQM4qZjqzEU0mF/RePWNXOz9NUo3nHCnT4eD28iIfkezS5O8v39AzJSD/IDUFmcTiwKKkjEfDy7wkNvYrp36g==.6C27tjvgk-US-HgQjFG_o6ZRfk9JUKYDv5SXIMXGNDM',
      sessionId: '1827766279604277248',
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
