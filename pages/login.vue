<script setup lang="ts">
import { closeToast, showLoadingToast } from 'vant'

definePageMeta({
  layout: false,
})

const title = 'Профиль'
useHead({ title })
const router = useRouter()
const token = useCookie('token')

const { data, refresh } = await useFetch('/api/auth')

const tokenForm = ref(token.value || '')

async function onSubmit() {
  showLoadingToast({ message: 'Проверка токена...', forbidClick: true })
  token.value = tokenForm.value
  await refresh()
  if (data.value)
    data.value.success ? router.push('/') : showFailToast(data.value.message)
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header>
      <van-nav-bar :title="title" :border="false" safe-area-inset-top fixed />
    </template>
    <template #default>
      <!-- t.62es2hoyD5foyjQiKld1ihmIpxqmPie_tpTeXDmrEGn3ZxJTSZ_yywRyZFNci7rpURZGVsxF-17cwesxK8DSNA -->
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="tokenForm"
            name="Токен"
            label="Токен"
            :rules="[{ required: true, message: 'Отсутствует токен' }]"
          >
            <template #button>
              <van-button size="small" round block type="primary" native-type="submit">
                Применить
              </van-button>
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
    </template>
  </NuxtLayout>
</template>
