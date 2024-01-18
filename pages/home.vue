<script setup lang="ts">
definePageMeta({
  layout: false,
})

const title = 'Главная'
useHead({ title })

const { data, pending } = useFetch('/api/portfolio', { lazy: true })
</script>

<template>
  <NuxtLayout name="default">
    <template #header>
      <van-nav-bar :title="title" :border="false" safe-area-inset-top fixed />
    </template>
    <template #default>
      <van-loading v-if="pending" class="text-center" />
      <template v-else-if="data && !pending">
        <van-cell-group v-if="data" title="Акции" inset>
          <van-cell
            v-for="pos in data.positions.filter(pos => pos.instrumentType === 'share')"
            :key="pos.figi"
            :title="pos.name"
            :label="`${toNumber(pos.quantity)} • ${useMoneyFormatKopek(toNumber(pos.averagePositionPrice))} &#8594; ${useMoneyFormatKopek(toNumber(pos.currentPrice))}`"
            center
          >
            <template #icon>
              <van-image class="mr-4 h-8 w-8" round :src="getUrlImg(pos.isin)" />
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
      </template>
    </template>
  </NuxtLayout>
</template>
