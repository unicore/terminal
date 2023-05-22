<template lang="pug">
div

  div.row.justify-center.q-ma-lg
    div.col-md-8.col-xs-12.q-pa-md
      q-card(flat bordered)
        q-card-section
          div(class="text-h3 q-mb-md text-center") Добро пожаловать на VOSHOD
          div(class="text-h5 q-mb-md text-center") Эволюция бизнес-сообществ
          div(class="text-subtitle1 q-mb-md text-center") Инновационная платформа для децентрализованных автономных организаций и бизнес-клубов
        q-card-section
          p(class="q-mb-md text-center") Мы предлагаем платформу, которая поддерживает создание, управление и рост децентрализованных автономных организаций и бизнес-клубов. Присоединяйтесь к одному из наших сообществ и начните создавать новое будущее вместе с нами.
          q-btn(label="Присоединиться сейчас" color="primary" to="/join" class="full-width")

  div#about.row.justify-center.q-ma-lg
    div.col-md-8.col-xs-12.q-pa-md
      q-card(flat bordered)
        q-card-section
          div(class="text-h3 q-mb-md text-center") О VOSHOD
          div(class="text-subtitle1 q-mb-md text-center") Инновационная платформа для децентрализованных автономных организаций и бизнес-клубов
        q-card-section
          p(class="q-mb-md") VOSHOD предоставляет платформу, которая поддерживает создание, управление и рост децентрализованных автономных организаций и бизнес-клубов. Будь то клуб для фрилансеров, как DAO FREELANCE, или иная организация, мы обеспечиваем инфраструктуру, которая упрощает совместную работу и продвижение ваших идей вместе.
          q-btn(label="Узнать больше" color="primary" to="/learn-more" class="full-width")

  div#benefits.row.justify-center.q-ma-lg
    div.col-md-8.col-xs-12.q-pa-md
      q-card(flat bordered)
        q-card-section
          div(class="text-h3 q-mb-md text-center") Что вы получите
          div(class="text-subtitle1 q-mb-md text-center") Преимущества участия в сообществах платформы VOSHOD
        q-card-section
          p(class="q-mb-md") 
            | На платформе VOSHOD вы можете обмениваться знаниями, идеями и ресурсами с другими членами сообщества. Наша цель - помочь вам расти и развиваться как профессионалу, а также поощрять инновации и предпринимательство. 
            | Приглашаем вас присоединиться к нашему экосистеме и воспользоваться следующими преимуществами:
          ul
            li(class="q-mb-md") Обмен знаниями и опытом с единомышленниками.
            li(class="q-mb-md") Возможность присоединиться к проектам, которые соответствуют вашим интересам и навыкам.
            li(class="q-mb-md") Доступ к обширной сети профессионалов и организаций.
            li(class="q-mb-md") Возможность получения дохода за свой вклад в развитие сообщества.
          q-btn(label="Присоединиться сейчас" color="primary" to="/join" class="full-width")


</template>

<script setup lang="ts">//
import HeaderLogo from '~/assets/logo.svg?url'
import { NotionRenderer, getPageBlocks } from "vue-notion";
import { ref, computed, watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import loader from '~/components/common/loader.vue'
let loading = ref(true)
import config from '~/config'

let promoVisible = ref(true)
let blockMap = ref(null)

onMounted(async () => {
  blockMap.value = await getPageBlocks(config.notionUrl);
  loading.value = false
})

</script>


<style scoped>
.section {
  padding: 2em 0; /* Добавить отступ сверху и снизу для каждого раздела */
  color: #333; /* Установить цвет текста */
  background-color: #f9f9f9; /* Установить цвет фона раздела */
  font-family: Arial, sans-serif; /* Установить шрифт для текста в разделе */
}

</style>
