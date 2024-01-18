<script setup lang="ts">
// import { Helpers } from 'tinkoff-invest-api'
// import type { MoneyValue } from 'tinkoff-invest-api/src/generated/common'

// const { data, refresh } = await useFetch('/api/operations')

// // setInterval(() => {
// //   refresh()
// // }, 5000)
function moneyFormatKopek(price: number, isSign = false) {
  // const locale = 'ru-RU'
  const currency = '₽'
  const separator = '\u00A0'

  const num = Math.abs(price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ')

  const res = num.split('.')
  const sign = isSign && Number(price) === 0 ? Number(price) > 0 ? ' +' : ' –' : ''
  return `${sign}${res[0]},${res[1]}${separator}${currency}`
}
definePageMeta({
  layout: false,
})

const title = 'Операции'
useHead({ title })

const { data, pending } = useFetch('/api/operations', { lazy: true })
</script>

<template>
  <!-- <div v-if="data" style="border: 1px solid #dddfe0;border-radius: 24px;width: 100%;">
    <table style="width: 100%;">
      <thead>
        <tr>
          <th class="p-4 text-left">
            Название
          </th>
          <th class="p-4 text-center w-36">
            Цена за 1 шт.
          </th>
          <th class="p-4 text-center w-36">
            Относительная доходность
          </th>
          <th class="p-4 text-center w-36">
            Сумма операции
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ figi, state, name, description, type, isin, paymentNumber, priceNumber, yieldNumber } in data.operations" :key="figi" style="border-top: 1px solid #dddfe0;">
          <td>
            <div class="p-4 flex items-center">
              <img class="mr-4 h-12 w-12" :src="`https://invest-brands.cdn-tinkoff.ru/${isin}x160.png`" data-qa-file="InvestLogo" style="border-radius: 50%;">
              <div class="text-left">
                <div>{{ description }}</div>
                <div style="color: rgba(0,0,0,.54)">
                  {{ name }}
                </div>
              </div>
            </div>
          </td>
          <td class="text-center">
            <div v-if="priceNumber">
              {{ moneyFormatKopek(priceNumber) }}
            </div>
          </td>
          <td class="text-center">
            <div v-if="yieldNumber" :style="`color: ${yieldNumber > 0 ? '#00a127' : '#e31c1c'}`">
              {{ moneyFormatKopek(yieldNumber, true) }}
            </div>
          </td>
          <td v-if="paymentNumber" class="text-center" :style="`color: ${paymentNumber > 0 ? '#00a127' : '#e31c1c'}`">
            {{ moneyFormatKopek(paymentNumber, true) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div> -->
  <NuxtLayout name="default">
    <template #header>
      <van-nav-bar :title="title" :border="false" safe-area-inset-top fixed />
    </template>
    <template #default>
      <van-loading v-if="pending" class="text-center" />
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
    </template>
  </NuxtLayout>
</template>
