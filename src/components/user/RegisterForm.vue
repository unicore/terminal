<template>
  <q-stepper v-model="step" vertical color="primary" animated active-icon="none">
    <q-step :name="1" title="Начало регистрации" icon="email" :done="step > 1">
      <q-input
        v-model.trim="email"
        filled
        type="email"
        label="Email"
        :readonly="inLoading"
        @keypress.enter="setEmail" />

      <q-stepper-navigation>
        <q-btn
          class="full-width"
          color="primary"
          label="Продолжить"
          :disable="!emailIsValid"
          :loading="inLoading"
          @click="setEmail" />
      </q-stepper-navigation>
    </q-step>

    <q-step :name="2" title="Введение" icon="info" :done="step > 2">
      Для вас будет сгенерирована секретная фраза, с помощью которой вы сможете выполнять вход в
      систему.
      <br />
      Надёжно сохраните её.

      <q-stepper-navigation>
        <q-btn color="primary" label="Сгенерировать" class="full-width" @click="step = 3" />
      </q-stepper-navigation>
    </q-step>

    <q-step :name="3" title="Генерация фразы" icon="lock" :done="step > 3">
      <q-skeleton v-if="!generatedAccount" type="QToolbar" />
      <pre v-else class="mnemonic shadow-1 q-pa-sm rounded-borders">{{
        generatedAccount.mnemonic
      }}</pre>
      <q-btn
        flat
        color="secondary"
        label="Скопировать"
        icon="assignment"
        class="full-width"
        @click="copyMnemonic" />
      <q-checkbox
        v-model="hasSavedCheckbox"
        label="Я надёжно сохранил секретную фразу"
        class="q-mt-md" />

      <q-stepper-navigation>
        <q-btn
          color="primary"
          label="Продолжить"
          :disable="!hasSavedCheckbox"
          class="full-width"
          @click="step = 4" />
      </q-stepper-navigation>
    </q-step>

    <q-step :name="4" title="Проверка фразы" icon="lock_open" :done="step > 4">
      <q-input
        v-model.trim="mnemonicToCheck"
        filled
        type="textarea"
        label="Секретная фраза"
        hint="Введите сохранённую секретную фразу" />

      <q-stepper-navigation>
        <q-btn
          color="primary"
          flat
          icon="arrow_back"
          class="full-width"
          label="Вернуться"
          @click="step = 3" />
        <q-btn
          class="full-width"
          color="primary"
          label="Завершить"
          :disable="mnemonicToCheck !== generatedAccount?.mnemonic"
          @click="completeRegister" />
      </q-stepper-navigation>
    </q-step>

    <q-step :name="5" title="Завершение регистрации" icon="done" :done="step > 5">
      <div class="flex flex-center q-pa-md">
        <q-circular-progress indeterminate size="50px" color="teal" />
      </div>
    </q-step>
  </q-stepper>
</template>

<script setup lang="ts">
  import { copyToClipboard, Notify } from 'quasar'
  import { ref, watch, Ref, computed } from 'vue'
  import { generateAccount } from 'unicore'
  import { AccountData } from 'unicore/ts/src/auth'
  import emailRegex from 'email-regex'

  import chains from '~/chainsMain'
  import { useUserStore } from '~/stores/user'

  const userStore = useUserStore()

  const step = ref(1)
  const generatedAccount: Ref<AccountData | null> = ref(null)
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
