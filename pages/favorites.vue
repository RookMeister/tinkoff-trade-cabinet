<script setup lang="ts">
definePageMeta({ layout: false })

const title = 'Избранное'
useHead({ title })

const { data, pending, refresh } = useFetch('/api/favorites', { lazy: true })
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
        <van-cell-group
          v-else-if="data && !pending"
          inset
        >
          <template v-for="pos in data">
            <van-cell
              v-if="pos"
              :key="pos.figi"
              :title="pos.name"
              :value="`${useMoneyFormatKopek(pos.currentPrice)}`"
              center
            >
              <template #icon>
                <van-image
                  class="mr-4 h-8 w-8"
                  round
                  :src="getUrlImg(pos.isin)"
                />
              </template>
            </van-cell>
          </template>
        </van-cell-group>
      </van-pull-refresh>
    </template>
  </NuxtLayout>
</template>
