<script setup lang="ts">
definePageMeta({ layout: false })

const title = 'Главная'
useHead({ title })

const { data, pending, refresh } = useFetch('/api/portfolio', { lazy: true })
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
        <template v-else-if="data && !pending">
          <van-cell-group v-if="data" title="Акции" inset>
            <van-cell
              v-for="pos in data.positions.filter(pos => pos.instrumentType === 'share')"
              :key="pos.figi"
              :title="pos.name"
              center
            >
              <template #icon>
                <van-image class="mr-4 h-8 w-8" round :src="getUrlImg(pos.isin)" />
              </template>
              <template #label>
                <div>
                  {{ `${useMoneyFormatKopek(toNumber(pos.averagePositionPrice))} &#8594; ${useMoneyFormatKopek(toNumber(pos.currentPrice))}` }}
                </div>
                <div>{{ `${toNumber(pos.quantity)}` }}</div>
              </template>
              <template #value>
                <div :style="{ color: colorText(toNumber(pos.expectedYield)) }">
                  {{ `${useMoneyFormatKopek(toNumber(pos.expectedYield), true)}` }}
                </div>
              </template>
            </van-cell>
          </van-cell-group>
          <van-cell-group v-if="data" title="Валюта" inset>
            <van-cell
              v-for="pos in data.positions.filter(pos => pos.instrumentType === 'currency')"
              :key="pos.figi"
              :title="pos.name"
              :value="`${toNumber(pos.quantity)}`"
              center
            >
              <template #icon>
                <van-image class="mr-4 h-8 w-8" round :src="getUrlImg(pos.figi)" />
              </template>
            </van-cell>
          </van-cell-group>
          <van-cell-group v-if="data" title="ETF" inset>
            <van-cell
              v-for="pos in data.positions.filter(pos => pos.instrumentType === 'etf')"
              :key="pos.figi"
              :title="pos.name"
              :value="`${toNumber(pos.quantity)}`"
              center
            >
              <template #icon>
                <van-image class="mr-4 h-8 w-8" round :src="getUrlImg(pos.figi)" />
              </template>
            </van-cell>
          </van-cell-group>
        </template>
      </van-pull-refresh>
    </template>
  </NuxtLayout>
</template>
