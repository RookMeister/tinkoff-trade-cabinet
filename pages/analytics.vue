<script setup lang="ts">
import type { OperationItem } from 'tinkoff-invest-api/src/generated/operations'
import type { SerializeObject } from 'nitropack'

definePageMeta({ layout: false })

const title = 'Аналитика'
useHead({ title })

const { data, pending, refresh } = useFetch('/api/analytics', { lazy: true })
// setInterval(() => { refresh() }, 5000)

const show = ref(false)
const currentIsin = ref('')
const operations = ref<SerializeObject<OperationItem>[]>([])

function openOperations(value: SerializeObject<OperationItem>[], isin: string) {
  currentIsin.value = isin
  operations.value = value
  show.value = true
}

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
          <van-cell
            v-for="pos in data"
            :key="pos.figi"
            :title="pos.name"
            :label="`${useMoneyFormatKopek(toNumber(pos.currentPrice))}`"
            center
            @click="openOperations(pos.operations, pos.isin)"
          >
            <template #icon>
              <van-image class="mr-4 h-8 w-8" round :src="getUrlImg(pos.isin)" />
            </template>
            <template #value>
              <div :style="{ color: colorText(pos.allYield + pos.expectedYield) }">
                {{ `${useMoneyFormatKopek(pos.allYield + pos.expectedYield, true)}` }}
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-popup
          v-model:show="show"
          position="bottom"
          round closeable
          :style="{ maxHeight: '90%' }"
        >
          <van-cell-group v-if="operations.length" style="margin-top: 54px;">
            <van-cell
              v-for="op in operations"
              :key="op.id"
              :title="op.description"
              center
              @click="show = true"
            >
              <template #label>
                <span v-if="toNumber(op.commission)">
                  {{ `Коммисия: ${useMoneyFormatKopek(toNumber(op.commission))}, ` }}
                </span>
                <span v-if="toNumber(op.price)">
                  {{ `Цена за шт. ${useMoneyFormatKopek(toNumber(op.price))}` }}
                </span>
              </template>
              <template #icon>
                <van-image class="mr-4 h-8 w-8" round :src="getUrlImg(currentIsin)" />
              </template>
              <template #value>
                <div :style="{ color: colorText(toNumber(op.payment)) }">
                  {{ useMoneyFormatKopek(toNumber(op.payment), true) }}
                </div>
              </template>
            </van-cell>
          </van-cell-group>
        </van-popup>
      </van-pull-refresh>
    </template>
  </NuxtLayout>
</template>
