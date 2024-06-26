<script setup lang="ts">
definePageMeta({ layout: false })

const title = 'Главная'
useHead({ title })

const { data, pending } = useFetch('/api/portfolio', { lazy: true })
const { isMobile } = useDevice()
const currencies = computed(() => data.value?.positions.filter(pos => pos.instrumentType === 'currency') ?? [])
const etfs = computed(() => data.value?.positions.filter(pos => pos.instrumentType === 'etf') ?? [])
const shares = computed(() => data.value?.positions.filter(pos => pos.instrumentType === 'share') ?? [])
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
            v-for="pos in shares"
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
                <div v-if="!isMobile">
                  {{ `${useMoneyFormatKopek(pos.averagePositionPrice)} &#8594; ${useMoneyFormatKopek(pos.currentPrice)}` }}
                </div>
                <div
                  v-if="!isMobile"
                  class="w-32"
                >
                  <div>{{ `${useMoneyFormatKopek(toNumber(pos.currentPrice) * toNumber(pos.quantity))}` }}</div>
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
                <div v-if="!isMobile">
                  {{ `${useMoneyFormatKopek(pos.averagePositionPrice)} &#8594; ${useMoneyFormatKopek(pos.currentPrice)}` }}
                </div>
                <div
                  v-if="!isMobile"
                  class="w-32"
                >
                  <div>{{ `${useMoneyFormatKopek(toNumber(pos.currentPrice) * toNumber(pos.quantity))}` }}</div>
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
    </template>
  </NuxtLayout>
</template>
