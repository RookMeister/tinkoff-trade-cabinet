<script setup lang="ts">
const { data, refresh } = await useFetch('/api/portfolio')

// setInterval(() => {
//   refresh()
// }, 5000)

const columns = [{
  label: 'Название',
  key: 'name',
}, {
  label: 'Цена',
  key: 'price',
}, {
  label: 'Стоимость',
  key: 'cost',
}, {
  label: 'За всё время',
  key: 'all',
}]
</script>

<template>
  <div v-if="data" class="mb-8 flex" style="background-image: linear-gradient(225deg,#2f2f3a,#59595a);border-radius: 24px;height: 186px;padding: 32px;color: white">
    <div>
      <div>
        Общая стоимость в рублях
      </div>
      <div>{{ useMoneyFormatKopek(data.totalAmountShares + data.totalAmountCurrencies) }}</div>
    </div>
  </div>

  <UTable v-if="data" :columns="columns" :rows="data.positions" style="border: 1px solid #dddfe0;border-radius: 24px;">
    <template #name-data="{ row }">
      <div class="flex items-center">
        <img class="mr-4 h-12 w-12" :src="`https://invest-brands.cdn-tinkoff.ru/${row.isin}x160.png`" data-qa-file="InvestLogo" style="border-radius: 50%;">
        <div class="text-left">
          <div>{{ row.name }}</div>
          <div style="color: rgba(0,0,0,.54)">
            {{ row.ticker }}
          </div>
        </div>
      </div>
    </template>
    <template #price-data="{ row }">
      <div v-if="row.instrumentType !== 'currency'" class="flex items-center p-4">
        <div v-if="row.averagePositionPriceNumber" style="color: rgba(0,0,0,.54)">
          {{ useMoneyFormatKopek(row.averagePositionPriceNumber) }}
        </div>
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M9.589 7.001L8.297 5.706a1 1 0 111.416-1.412l2.29 2.295a2 2 0 01-.001 2.826l-2.29 2.292a1 1 0 11-1.414-1.414l1.29-1.292-5.587.004a1 1 0 01-.002-2L9.59 7z" fill="currentColor" /></svg>
        <div v-if="row.currentPriceNumber">
          {{ useMoneyFormatKopek(row.currentPriceNumber) }}
        </div>
      </div>
    </template>
    <template #cost-data="{ row }">
      <div v-if="row.currentPrice && row.quantity">
        <div>
          {{ useMoneyFormatKopek(row.currentPriceNumber * row.quantityNumber) }}
        </div>
        <div class="text-xs" style="color: rgba(0,0,0,.54)">
          {{ row.quantityNumber }} шт.
        </div>
      </div>
    </template>
    <template #all-data="{ row }">
      <div v-if="row.expectedYieldNumber" :style="`color: ${row.expectedYieldNumber ? '#00a127' : '#e31c1c'}`">
        <div v-if="row.instrumentType !== 'currency'">
          {{ useMoneyFormatKopek(row.expectedYieldNumber, true) }}
        </div>
      </div>
    </template>
  </UTable>
</template>
