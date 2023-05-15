<template>
  <div v-if="step==1">
    <h6 class="text-h6 q-mb-md">Регистрация</h6>
    <q-input
      v-model.trim="email"
      filled
      type="email"
      label="Email"
      :readonly="inLoading"
      color="teal"
      @keypress.enter="setEmail" />
    <q-btn
      class="full-width"
      color="teal"
      label="Продолжить"
      :disable="!emailIsValid"
      :loading="inLoading"
      @click="setEmail" />
  </div>
  <div v-if="step==2">
    <p>Для вас будет сгенерирован секретный ключ. Надёжно сохраните его и никогда и никому не показывайте.</p>
    <q-btn color="teal" label="Сгенерировать ключ" class="full-width q-mt-lg" @click="step = 3" />
  </div>

  <div v-if="step==3">
    <p>Ваш секретный ключ: </p>
    <q-skeleton v-if="!generatedAccount" type="QToolbar" />
    <pre v-else class="mnemonic shadow-1 q-pa-sm rounded-borders">{{
      generatedAccount.mnemonic
    }}</pre>
    <q-btn
      flat
      size="sm"
      color="secondary"
      label="Скопировать"
      icon="assignment"
      class="full-width"
      @click="copyMnemonic" />
    <q-checkbox
      v-model="hasSavedCheckbox"
      label="Я сохранил секретный ключ"
      class="q-mt-md" />

    <q-btn
      color="teal"
      label="Продолжить"
      :disable="!hasSavedCheckbox"
      class="full-width"
      @click="step = 4" />

  </div>
  <div v-if="step==4">
    <q-input
      v-model.trim="mnemonicToCheck"
      filled
      type="textarea"
      label="Введите ваш секретный ключ"
      class="q-pb-md"
       />
    <q-btn
      color="teal"
      flat
      size="sm"
      icon="arrow_back"
      class="full-width"
      label="Вернуться"
      @click="step = 3" />
    <q-btn
      class="full-width"
      color="teal"
      label="Создать аккаунт"
      :disable="mnemonicToCheck !== generatedAccount?.mnemonic"
      @click="completeRegister" />
  </div>
  <div v-if="step==5">
    <div class="flex flex-center q-pa-md">
      <q-circular-progress indeterminate size="50px" color="teal" />
    </div>
  </div>

</template>

<script setup lang="ts">
  import { copyToClipboard, Notify } from 'quasar'
  import { ref, watch, Ref, computed } from 'vue'
  import { generateAccount } from 'unicore'
  import emailRegex from 'email-regex'
  import { useRouter } from 'vue-router'

  import chains from '~/chainsMain'
  import { useUserStore } from '~/stores/user'

  const userStore = useUserStore()
  const router = useRouter()

  const step = ref(1)
  const generatedAccount = ref(null)
  const inLoading = ref(false)
  const hasSavedCheckbox = ref(false)
  const mnemonicToCheck = ref('')
  const email = ref('')

  const emailValidator = emailRegex({ exact: true })

  watch(step, async (newStep) => {
    if (newStep === 3) {
      generatedAccount.value = await generateAccount()
    }
  })

  const emailIsValid = computed(() => {
    return emailValidator.test(email.value)
  })

  const copyMnemonic = () => {
    copyToClipboard(generatedAccount.value?.mnemonic || '')
      .then(() => {
        Notify.create({
          message: 'Фраза скопирована',
          type: 'positive',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const setEmail = async () => {
    inLoading.value = true
    const { status } = await chains.registrator.checkEmail(email.value)
    if (status === 'ok') {
      step.value += 1
    } else {
      Notify.create({
        message: 'Email уже зарегистрирован!',
        type: 'negative',
      })
    }
    inLoading.value = false
  }

  const completeRegister = async () => {
    if (generatedAccount.value) {
      step.value += 1
      const account = generatedAccount.value
      const { status } = await chains.registrator.setAccount(
        account.name,
        account.pub,
        account.pub,
        email.value,
        userStore.referrer || null,
        window.location.origin,
        'guest'
      )
      if (status === 'ok') {
        await userStore.login(account)
        // await router.push({ name: 'lk-estate' })
        Notify.create({
          message: 'Успешная регистрация',
          type: 'positive',
        })
      } else {
        step.value -= 1
        Notify.create({
          message: 'Ошибка регистрации',
          type: 'negative',
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mnemonic {
    white-space: pre-wrap;
  }
</style>
