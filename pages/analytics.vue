<script setup lang="ts">
import type { OperationItem } from 'tinkoff-invest-api/src/generated/operations'
import type { SerializeObject } from 'nitropack'
import { format } from 'date-fns'

definePageMeta({ layout: false })

const title = 'Аналитика'
useHead({ title })

const { data, pending } = useFetch('/api/analytics', { lazy: true })
// setInterval(() => { refresh() }, 5000)

const show = ref(false)
const currentIsin = ref('')
const operations = ref<SerializeObject<OperationItem>[]>([])

function openOperations(value: SerializeObject<OperationItem>[], isin?: string) {
  currentIsin.value = isin || ''
  operations.value = value
  show.value = true
}

const total = computed(() => {
  let total = 0
  if (data.value) {
    data.value.myOperations.forEach((op) => {
      total += op.allYield + op.expectedYield
    })
  }

  return total
})
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
          title="Общая статистика"
          inset
        >
          <van-cell
            key="total"
            title="Пополнение брокерского счёта."
            center
            @click="openOperations(data.allData.typeInputOp)"
          >
            <template #value>
              <div :style="{ color: colorText(data.allData.typeInput) }">
                {{ `${useMoneyFormatKopek(data.allData.typeInput, true)}` }}
              </div>
            </template>
          </van-cell>
          <van-cell
            key="total"
            title="Вывод денежных средств."
            center
            @click="openOperations(data.allData.typeOutputOp)"
          >
            <template #value>
              <div :style="{ color: colorText(data.allData.typeOutput) }">
                {{ `${useMoneyFormatKopek(data.allData.typeOutput, true)}` }}
              </div>
            </template>
          </van-cell>
          <van-cell
            key="total"
            title="Общая доходность за сделки"
            center
          >
            <template #value>
              <div :style="{ color: colorText(total) }">
                {{ `${useMoneyFormatKopek(total, true)}` }}
              </div>
            </template>
          </van-cell>
          <van-cell
            key="dividendYield"
            title="Дивиденды"
            center
            @click="openOperations(data.allData.dividendYieldOp)"
          >
            <template #value>
              <div :style="{ color: colorText(data.allData.dividendYield) }">
                {{ `${useMoneyFormatKopek(data.allData.dividendYield, true)}` }}
              </div>
            </template>
          </van-cell>
          <van-cell
            key="totalTax"
            title="Налоги"
            center
            @click="openOperations(data.allData.totalTaxOp)"
          >
            <template #value>
              <div :style="{ color: colorText(data.allData.totalTax) }">
                {{ `${useMoneyFormatKopek(data.allData.totalTax, true)}` }}
              </div>
            </template>
          </van-cell>
          <van-cell
            key="serviceFee"
            title="Комиссия за обслуживание"
            center
            @click="openOperations(data.allData.serviceFeeOp)"
          >
            <template #value>
              <div :style="{ color: colorText(data.allData.serviceFee) }">
                {{ `${useMoneyFormatKopek(data.allData.serviceFee, true)}` }}
              </div>
            </template>
          </van-cell>
          <van-cell
            key="brokerFee"
            title="Комиссия за операции"
            center
            @click="openOperations(data.allData.brokerFeeOp)"
          >
            <template #value>
              <div :style="{ color: colorText(data.allData.brokerFee) }">
                {{ `${useMoneyFormatKopek(data.allData.brokerFee, true)}` }}
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group
          title="Статистика по сделкам"
          inset
        >
          <van-cell
            v-for="pos in data.myOperations"
            :key="pos.share?.figi || pos.etf?.figi"
            :title="pos.share?.name || pos.etf?.name"
            center
            @click="openOperations(pos.operations, pos.share?.isin || pos.etf?.isin)"
          >
            <template #icon>
              <van-image
                class="mr-4 h-8 w-8"
                round
                :src="getUrlImg(pos.share?.isin || pos.etf?.isin || '')"
              />
            </template>
            <template #value>
              <div class="flex justify-end">
                <div v-if="pos.dividendYield">
                  <div>Торговля: {{ `${useMoneyFormatKopek(pos.allYield + pos.expectedYield, true)}` }}</div>
                  <div>Дивиденды: {{ `${useMoneyFormatKopek(pos.dividendYield, true)}` }}</div>
                </div>
                <div
                  class="w-32"
                  :style="{ color: colorText(pos.allYield + pos.expectedYield + pos.dividendYield) }"
                >
                  {{ `${useMoneyFormatKopek(pos.allYield + pos.expectedYield + pos.dividendYield, true)}` }}
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </template>
      <van-popup
        v-model:show="show"
        position="bottom"
        round
        closeable
        :style="{ maxHeight: '90%' }"
      >
        <van-cell-group
          v-if="operations.length"
          style="margin-top: 54px;"
        >
          <van-cell
            v-for="op in operations"
            :key="op.id"
            :title="`${op.description} ${op.name ? ': ' + op.name : ''}`"
            center
            @click="show = true"
          >
            <template #label>
              <span v-if="toNumber(op.commission)">
                {{ `Коммисия: ${useMoneyFormatKopek(op.commission)}, ` }}
              </span>
              <span v-if="toNumber(op.price)">
                {{ `Цена за шт. ${useMoneyFormatKopek(op.price)}` }}
              </span>
              <div v-if="op.date">
                {{ `Дата: ${format(new Date(op.date), 'dd.MM.yyyy')}` }}
              </div>
            </template>
            <template #icon>
              <van-image
                class="mr-4 h-8 w-8"
                round
                :src="getUrlImg(currentIsin)"
              />
            </template>
            <template #value>
              <div :style="{ color: colorText(toNumber(op.payment)) }">
                {{ useMoneyFormatKopek(op.payment, true) }}
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-popup>
    </template>
  </NuxtLayout>
</template>
