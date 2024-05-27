<script setup lang="ts">
definePageMeta({ layout: false })

const title = 'Главная'
useHead({ title })

const { data, pending, refresh } = useFetch('/api/portfolio', { lazy: true })

const loading = ref(false)
async function onRefresh() {
  await refresh()
  loading.value = false
  showToast('Refresh Success')
}

const currencies = computed(() => data.value?.positions.filter(pos => pos.instrumentType === 'currency') ?? [])
const etfs = computed(() => data.value?.positions.filter(pos => pos.instrumentType === 'etf') ?? [])
</script>

<template>
  <NuxtLayout name="default">
    <template #header>
      <van-nav-bar
        :title="title"
        :border="false"
        safe-area-inset-top
        fixed
      />
    </template>
    <template #default>
      <van-pull-refresh
        v-model="loading"
        @refresh="onRefresh"
      >
        <van-loading
          v-if="!data && pending"
          class="text-center"
        />
        <template v-else-if="data && !pending">
          <van-cell-group
            v-if="data"
            title="Акции"
            inset
          >
            <van-cell
              v-for="pos in data.positions.filter(pos => pos.instrumentType === 'share')"
              :key="pos.figi"
              :title="pos.name"
              :label="pos.ticker"
              center
            >
              <template #icon>
                <van-image
                  class="mr-4 h-8 w-8"
                  round
                  :src="getUrlImg(pos.isin)"
                />
              </template>
              <template #value>
                <div class="flex justify-end">
                  <div>
                    {{ `${useMoneyFormatKopek(pos.averagePositionPrice)} &#8594; ${useMoneyFormatKopek(pos.currentPrice)}` }}
                  </div>
                  <div class="w-32">
                    <div>{{ `${useMoneyFormatKopek(pos.currentPrice * toNumber(pos.quantity))}` }}</div>
                    <div>{{ `${toNumber(pos.quantity)} шт.` }}</div>
                  </div>
                  <div
                    class="w-32"
                    :style="{ color: colorText(toNumber(pos.expectedYield)) }"
                  >
                    {{ `${useMoneyFormatKopek(pos.expectedYield, true)}` }}
                  </div>
                </div>
              </template>
            </van-cell>
          </van-cell-group>
          <van-cell-group
            v-if="currencies.length"
            title="Валюта"
            inset
          >
            <van-cell
              v-for="pos in currencies"
              :key="pos.figi"
              :title="pos.name"
              label="RUB"
              :value="`${useMoneyFormatKopek(pos.quantity)}`"
              center
            >
              <template #icon>
                <van-image
                  class="mr-4 h-8 w-8"
                  round
                  :src="getUrlImg(pos.figi)"
                />
              </template>
            </van-cell>
          </van-cell-group>
          <van-cell-group
            v-if="etfs.length"
            title="ETF"
            inset
          >
            <van-cell
              v-for="pos in etfs"
              :key="pos.figi"
              :title="pos.name"
              :label="pos.ticker"
              center
            >
              <template #icon>
                <van-image
                  class="mr-4 h-8 w-8"
                  round
                  :src="getUrlImg(pos.isin)"
                />
              </template>
              <template #value>
                <div class="flex justify-end">
                  <div>
                    {{ `${useMoneyFormatKopek(pos.averagePositionPrice)} &#8594; ${useMoneyFormatKopek(pos.currentPrice)}` }}
                  </div>
                  <div class="w-32">
                    <div>{{ `${useMoneyFormatKopek(pos.currentPrice * toNumber(pos.quantity))}` }}</div>
                    <div>{{ `${toNumber(pos.quantity)} шт.` }}</div>
                  </div>
                  <div
                    class="w-32"
                    :style="{ color: colorText(toNumber(pos.expectedYield)) }"
                  >
                    {{ `${useMoneyFormatKopek(pos.expectedYield, true)}` }}
                  </div>
                </div>
              </template>
            </van-cell>
          </van-cell-group>
        </template>
      </van-pull-refresh>
    </template>
  </NuxtLayout>
</template>
