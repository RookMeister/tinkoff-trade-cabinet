<script setup lang="ts">
definePageMeta({
  layout: false,
})

const title = 'Избранное'
useHead({ title })

const { data, pending } = useFetch('/api/favorites', { lazy: true })
</script>

<template>
  <NuxtLayout name="default">
    <template #header>
      <van-nav-bar :title="title" :border="false" safe-area-inset-top fixed />
    </template>
    <template #default>
      <van-loading v-if="pending" class="text-center" />
      <van-cell-group v-else-if="data && !pending" inset>
        <template v-for="pos in data">
          <van-cell
            v-if="pos"
            :key="pos.figi"
            :title="pos.name"
            :value="`${useMoneyFormatKopek(toNumber(pos.currentPrice))}`"
            center
          >
            <template #icon>
              <van-image class="mr-4 h-8 w-8" round :src="getUrlImg(pos.isin)" />
            </template>
          </van-cell>
        </template>
      </van-cell-group>
    </template>
  </NuxtLayout>
</template>
