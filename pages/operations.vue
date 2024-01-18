<script setup lang="ts">
definePageMeta({ layout: false })

const title = 'Операции'
useHead({ title })

const { data, pending, refresh } = useFetch('/api/operations', { lazy: true })
// setInterval(() => { refresh() }, 5000)
const loading = ref(false)
async function onRefresh() {
  await refresh()
  loading.value = false
  showToast('Refresh Success')
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header>
      <van-nav-bar :title="title" :border="false" safe-area-inset-top fixed />
    </template>
    <template #default>
      <van-pull-refresh v-model="loading" @refresh="onRefresh">
        <van-loading v-if="!data && pending" class="text-center" />
        <van-cell-group v-else-if="data && !pending" inset>
          <template v-for="operation in data.operations">
            <van-cell
              v-if="operation"
              :key="operation.figi"
              :title="operation.name"
              center
            >
              <template #icon>
                <van-image class="mr-4 h-8 w-8" round :src="getUrlImg(operation.isin)" />
              </template>
              <template #title>
                <div>{{ operation.description }}</div>
                <div>{{ operation.name }}</div>
              </template>
              <template #value>
                <!-- <div v-if="operation.priceNumber" :style="{ color: colorText(operation.priceNumber) }">
                {{ `${useMoneyFormatKopek(operation.priceNumber, true)}` }}
              </div>
              <div v-if="operation.yieldNumber" :style="{ color: colorText(operation.yieldNumber) }">
                {{ `${useMoneyFormatKopek(operation.yieldNumber, true)}` }}
              </div> -->
                <div v-if="operation.paymentNumber" :style="{ color: colorText(operation.paymentNumber) }">
                  {{ `${useMoneyFormatKopek(operation.paymentNumber, true)}` }}
                </div>
              </template>
            </van-cell>
          </template>
        </van-cell-group>
      </van-pull-refresh>
    </template>
  </NuxtLayout>
</template>
