<template lang="pug">
div

  div#super.section.q-pa-lg
    div.row.full-height
      div.col-md-6.col-xs-12
        q-card(flat)
          h1.text-green Платформа 
            span.text-black токенизации 
            span.text-green бизнеса
          p.q-mt-lg 
          vueWriter(:array="hello" :typeSpeed="20" :eraseSpeed="20")
            
          q-separator
          q-card-actions.q-mt-lg
            q-btn(flat size="lg" style="padding: 20px;" @click="register").bg-green.q-pa-lg.text-white регистрация
            // q-btn(flat).text-grey-8
            //   i.fa-brands.fa-youtube.q-mr-xs
            //   span посмотреть видео
      div.col-md-6.q-pa-lg.image-container
        transition(name="fade")
          img(:src="main")#main.rotate
    

  // div#community.section.q-pa-lg
  //   div.section.text-center
  //     h1 VOSHOD
  //     p.q-mt-lg платформа токенизации бизнеса
  //     // под управлением сообщества на блокчейне учитывает вклады и распределяет прибыль
        

  div#voshod.section.q-pa-lg
    div.row.justify-center.section
      // div.col-md-4
      //   div.image-container
      //     img(:src="club1")

      div.col-md-8
        h2.text-green Токенизация 
          span.text-black бизнеса
        
        p.q-pt-lg - это метод учёта активов бизнеса, который позволяет привлекать новых клиентов и инвестиции без процентов.
        //Токены - это учётные единицы баллов лояльности бизнеса, которые распределяются за покупки товаров или интеллектуальный вклад участников в развитие бизнеса. 
        // Количество токенов на распределении определяется объемом продаж в бизнесе, от чего вклад каждого участника растёт в стоимости по плану. 
          // span.text-bold создают 
          // span и 
          // span.text-bold продвигают 
          // span участники сообщества. 
          //фиксируя вклады и распредяя доходы согласно вкладам. 
          // span Выбери свой клуб по интересу, прими участие в его развитии, совершай интеллектуальные вклады и получай доход. 
        // q-card(flat dark).col-6.q-mt-lg.q-pa-md
        //   p Каждый участник получает прирост баллов лояльности при выполнении общего для всех плана развития бизнеса. 

      


  div#flow.section.q-pa-lg
    div.row.section.justify-center
      div.full-width.text-center
        // h2.text-green Этапы 
        //   span.text-black продаж
        h2.text-green Как это 
          span.text-black работает
        
        // p.q-mt-lg на каждом этапе продаётся ограниченное и заранее известное количество NFT-билетов по установленному курсу
        // p.q-mt-lg на примере продажи билетов на мероприятие
      
      q-card(flat ).col-xs-12.col-md-8.q-mt-lg.q-pa-md.text-center
        p Цикл продаж ваших продуктов разделяется на последовательные этапы
        // : чёрные и белые. 
        // p 

      div(style="align-items: center;").row.q-mt-lg.justify-center.full-width

        div.q-pa-md.col-md-2.col-xs-12
          q-card(square flat).q-pa-md.text-center.pool
            div.text-center
              div.pool_white.size1
                p 1 этап
              p 100 продуктов
               // по 1 USDT на сумму 100 USDT

        div.q-pa-md.col-md-2.col-xs-12
          q-card(square flat).q-pa-md.text-center.pool
            div.text-center
              div.pool_black.size1
                p 2 этап
              p 100 продуктов
               // по 1.2 USDT на сумму 120 USDT
            
        div.q-pa-md.col-md-2.col-xs-12
          q-card(square flat).q-pa-md.text-center.pool
            div.text-center
              div.pool_white.size1
                p 3 этап
              p 44 продукта
               // по 1.5 USDT на сумму 66 USDT

        div.q-pa-md.col-md-2.col-xs-12
          q-card(square flat).q-pa-md.text-center.pool
            div.text-center
              div.pool_black.size1
                p 4 этап
              p 74 продукта 
              // по 2.06 USDT на сумму 152 USDT           
        
        div.q-pa-md.col-md-2.col-xs-12
          q-card(square flat).q-pa-md.text-center.pool
            div.text-center
              div.pool_white.size1
                p 5 этап
              p 113 продуктов
               // по 2.83 USDT на сумму 320 USDT
        
        div.q-pa-md.col-md-2.col-xs-12
          q-card(square flat).q-pa-md.text-center.pool
            div.text-center
              div.pool_black.size1
                p ... этап
              p ... продуктов
      
      q-card(flat dark).col-xs-12.col-md-8.q-mt-lg.q-pa-md.text-center
        p Когда этап продаж выполняется, владельцы токенов лояльности получают прирост +1%. 
        // Количество продуктов, которое должно быть продано на каждом этапе для переключения на следующий этап - определяется по математическому алгоритму.


  // div#flow.section.q-pa-lg
  //   div.row.section
  //     div.full-width.text-center
  //       h2.text-green Все клиенты 
  //         span.text-black делятся 
  //       // h2.text-green на 
  //       //   span.text-black команды
  //       // p.q-mt-lg так веселее
      
  //     // q-card(dark).col-xs-12.col-md-8.q-pa-md.text-center
  //     //   p.q-mt-lg 
      
  //     div.row.q-mt-lg.justify-center.full-width
  //       p на две команды
  //        // согласно этапу покупки продукта
      
      
  //     // div.row.q-mt-lg.justify-center.full-width
  //     //   p 
        
  //     div.row.q-mt-lg.justify-center.full-width
        
  //       div.q-pa-md.col-md-3.col-xs-12
  //         q-card(square flat).q-pa-md.text-center
  //           div.pool_white.size2              
  //           h4 Белая команда
  //           p.q-mt-md купили продукт на нечётном этапе 
  //             p (1, 3, 5, 7, ...)
        
  //       div.q-pa-md.col-md-3.col-xs-12
  //         q-card(square flat).q-pa-md.text-center
  //           div.pool_black.size2
  //           h4 Чёрная команда
  //           p.q-mt-md купили продукт на чётном этапе
  //             p (2, 4, 6, 8, ...) 
      
  //     div.row.q-mt-lg.justify-center.full-width
      
  //       q-card(flat dark).col-xs-12.col-md-8.q-mt-lg.q-pa-md.text-center
  //         p каждая команда получает прирост токенов лояности, когда выполняется этап продаж противоположной команды
        

  div#tickets.section.q-pa-lg
    div.row
      div.col-md-4
        div.image-container
          img(:src="flow2")
    
      div.col-md-8
        h2 Токены 
          span.text-green лояльности
          // span от продаж бизнеса
        // p.q-pt-lg токенов лояности, когда выполняется этап продаж противоположной команды. 
        // токены программы лояльности выдаются при выполнении плана продаж продуктов бизнеса. 
        //- это уникальные токены для доступа в закрытый клуб. Количество билетов строго ограниченно, а стоимость каждого увеличивается по плану от объема продаж. Каждый NFT-билет предоставляет силу голоса и вес при распределении прибыли клуба.

        q-card(flat dark).col-6.q-mt-lg.q-pa-md
          p можно потратить на покупку продуктов в сети партнёров программы лояльности VOSHOD.
            // | Как только белая команда выкупит все белые билеты, откроется второй этап продаж на 100 чёрных NFT-билетов по цене 1.2 USDT.

          // p.q-mt-lg Как только чёрная команда выкупит все чёрные билеты, белая команда получит прибыль +10%. 
          //   | Если прибыль не будет изъята до наступления следующего этапа продаж, то она будет автоматически ре-инвестирована, а на следующем белом этапе составит 21%, еще через один - 33.1%, и так далее. 
          // p.q-pt-lg На каждом последующем этапе продаж, команда с тем же цветом NFT-билетов, что и текущий этап, получает прибыль +10%. Количество этапов продаж не ограничено, а каждый участник может находиться в двух командах одновременно.
            

  // div#freelance.section.q-pa-lg
  //   div.row
  //     div.col-md-4
  //       div.image-container
  //         img(:src="daofree")

  //     div.col-md-8
  //       h2.text-green Пример 
  //         // span.text-black магазин продуктов
  //       q-card(flat dark).col-6.q-mt-lg.q-pa-md
        
  //         p Бизнес-клуб DAO FREELANCE создаёт платформу для фрилансеров, которой владеют и управляют фрилансеры. Для этого, клуб продаёт NFT-билеты, а выручку от продаж направляет на расширение аудитории телеграм-канала, что позволит стать крупнейшим информационным порталом о фрилансе и подготовить медиа-ресурс для информационной поддержки на запуске платформы. 
  //         p.q-pt-lg Кроме того, сам телеграм-канал является бизнес-активом, который генерирует прибыль от продаж рекламы в нём, обеспечивая рост стоимости NFT-билетов. 
  //         // p.q-pt-lg При достижении аудитории в 100 000 человек - клуб начнёт зарабатывать с продаж рекламы в канале, доходы от чего будут распределяться среди всех владельцев NFT-билетов. 
  //         // p.q-pt-lg Для создания платформы заказов, из числа участников бизнес-клуба, владельцами NFT-билетов набираются и утверждаются члены команды. Таким образом, успех клуба зависит от решений, которые принимаются владельцами NFT-билетов. 
        



   

  div#income.section.q-pa-lg
    div.row
      
      div.col-md-8
        h2 Привлекайте 
          span.text-green капитал
        p.q-pt-lg - в оборот без процентов. 
        
        q-card(flat dark).col-6.q-mt-lg.q-pa-md
          p.p-pt-lg Ваши клиенты получают возможность инвестировать в торговый оборот каждой единицы актива в вашем бизнесе. 
          // Клуб DAO FREELANCE завершил 14 этап продаж NFT-билетов и собрал 10 000 USDT, которые направляет на увеличение аудитории фрилансеров телеграм-канала. Прибыль от продаж рекламы в канале распределяется среди всех обладателей NFT-билетов согласно вкладу.

      div.col-md-4
        div.image-container
          img(:src="buycheaper")



  div#income.section.q-pa-lg
    div.row


      div.col-md-4
        div.image-container
          img(:src="bizsystem")



      
      div.col-md-8
        h2 Получайте   
          span.text-green рост 
          span продаж
        p.q-pt-lg - ваши клиенты становятся активными участниками продаж вашего бизнеса.  
        
        q-card(flat dark).col-6.q-mt-lg.q-pa-md
          p.p-pt-lg Также, вы получаете канал дополнительных продаж - сайт, или телеграм-бот, где собираются ваши клиенты.
          // Ваши клиенты получают возможность инвестировать в торговый оборот каждой единицы актива в вашем бизнесе. 
          // Клуб DAO FREELANCE завершил 14 этап продаж NFT-билетов и собрал 10 000 USDT, которые направляет на увеличение аудитории фрилансеров телеграм-канала. Прибыль от продаж рекламы в канале распределяется среди всех обладателей NFT-билетов согласно вкладу.


  // div#income.section.q-pa-lg
  //   div.row
      
  //     div.col-md-8
  //       h2 10% - 
  //         span.text-green стоимость
  //       p.q-pt-lg участия в программе лояльности. 
        
  //       // q-card(flat dark).col-6.q-mt-lg.q-pa-md
  //       //   p.p-pt-lg Клуб DAO FREELANCE завершил 14 этап продаж NFT-билетов и собрал 10 000 USDT, которые направляет на увеличение аудитории фрилансеров телеграм-канала. Прибыль от продаж рекламы в канале распределяется среди всех обладателей NFT-билетов согласно вкладу.
      
  //     div.col-md-4
  //       div.image-container
  //         img(:src="bizsystem")






    
  // div#insurance.section.q-pa-lg
    
  //   div.row.justify-center
  //     div.col-md-8.q-pa-lg.text-center
  //       h2.text-green Партнёрские 
  //         span.text-black программы
  //       p.q-pt-lg Программы поощрения партнёров бизнес-клубов управляются обладателями NFT-билетов в долгосрочных интересах развития бизнеса. 
    
  //   div.row.items-stretch
      
  //     div.col-md-6.q-mt-lg.q-mb-lg.q-pa-md
  //       h2.text-green Поэтапная 
          
  //       p.q-pt-lg Программа распределяет вознаграждения среди всех партнеров, чьи партнёры обладают NFT-билетами в момент переключения этапов продаж. Рассчёт производится на границе этапов, а уровни вознаграждений могут изменяться на каждом этапе.
       
  //       q-card(dark).q-pa-sm.q-mt-lg
  //         p Ваш партнёр купил NFT-билеты на сумму 100 USDT в 3-ем этапе продаж, а в момент начала 4-го этапа, вам начисляется вознаграждение в размере 15 USDT, 5-го этапа - 15 USDT, и так далее на каждом последующем этапе. 

  //     div.col-md-6.q-mt-lg.q-mb-lg.q-pa-md
  //       h2.text-green Моментальная 
          
  //       p.q-pt-lg Программа устанавливает уровни вознаграждений при личной продаже продуктов клуба партнёрами клуба. Распределение происходит в момент покупки продукта вашим партнёром. Распределение может изменяться для каждого продукта. 
        
  //       q-card(dark).q-pa-sm.q-mt-lg
  //         p Ваш партнёр купил размещение рекламы в телеграм-канале клуба за 100 USDT, от чего вы получаете 15 USDT.


      // div.col-md-6.q-mt-lg.q-mb-lg.q-pa-md
      //   h2.text-green Трудовая 
          
      //   p.q-pt-lg Программа поощрает партнёров тех партнеров, которые выполняют полезные действия для развития клуба. Распределение происходит в момент утверждения действия выполненным администрацией клуба. 
        
        
      //   q-card(dark).q-pa-sm.q-mt-lg
      //     p Ваш партнёр выполняет полезные действия в команде администрации клуба DAO FREELANCE и получает вознаграждение в размере 20 USDT за час, а вы получаете 3 USDT за каждый час его труда. 

      // div.col-md-6.q-mt-lg.q-mb-lg.q-pa-md
      //   h2.text-green Дивидендная 
          
      //   p.q-pt-lg Программа распределяет вознаграждения от всех продаж администрации клуба среди всех обладателей NFT-билетов. Размер вознаграждения рассчитывается исходя из количества вознаграждний вашего партнёра.
        
       
      //   q-card(flat dark).col-6.q-mt-lg.q-pa-md
      //     p Администрация клуба DAO FREELANCE построила платформу для фрилансеров на блокчейне, которая за месяц заработала 10 000 USDT от продаж рекламы и услуг сообщества, и теперь, эти средства распределяются среди всех обладателей NFT-билетов. Если 100 USDT из этой суммы направится вашему партнёру, то вы получите 15 USDT. 

  
      
  // div#insurance.section.q-pa-lg
  //   div.row.justify-center
  //     div.col-md-4
  //       div.image-container
  //         img(:src="blockchain")

  //     div.col-md-8.col-xs-12
  //       h2.text-green Блокчейн 
  //         span.text-black VOSHOD
  //       p.q-pt-lg Все операции на платформе производятся по смарт-контрактам на блокчейне с открытым исходным кодом. 
  //       q-card(flat dark).col-6.q-mt-lg.q-pa-md
  //         p Все учётные таблицы и исполняемый программный код всегда открыты, а каждый участник может проверить всё.

      


  // div#flow.section.q-pa-lg
  //   div.row.section
  //     div.full-width.text-center
  //       h2.text-green Как  
  //         span.text-black начать
          
  //     div.row.q-mt-lg.justify-center.full-width

  //       div.q-pa-md.col-md-3.col-xs-12
  //         q-card(square flat).q-pa-md.text-center
  //           div.image-container
  //             img(:src="flow1" style="max-width: 100px;")
  //           h4 Создаешь клуб
  //           p.q-mt-md и добавляешь продукты на VOSHOD
        
  //       div.q-pa-md.col-md-3.col-xs-12
  //         q-card(square flat).q-pa-md.text-center
  //           div.image-container
  //             img(:src="flow2" style="max-width: 100px;")
  //           h4 Выпускаешь токены
  //           p.q-mt-md программы лояльности для клуба
  //       div.q-pa-md.col-md-3.col-xs-12
  //         q-card(square flat).q-pa-md.text-center
  //           div.image-container
  //             img(:src="flow3" style="max-width: 100px;")
  //           h4 Приглашаешь в игру
  //           p.q-mt-md своих клиентов
        
  //       div.q-pa-md.col-md-3.col-xs-12
  //         q-card(square flat).q-pa-md.text-center
  //           div.image-container
  //             img(:src="flow4" style="max-width: 100px;")
  //           h4 Получаешь прирост
  //           p.q-mt-md клиентов и продаж
  //           //Бизнес-модели клуба создают доход, который распределяется между всеми участниками.




  div#super.section.q-pa-lg
    div.row.full-height
      div.col-md-6.col-xs-12
        q-card(flat)
          h1 Стань  
            span.text-green партнёром 
            // span.text-green или 
            // span дистрибьютором
          p.q-mt-lg 
          vueWriter(:array="goodbuy" :typeSpeed="20" :eraseSpeed="20")
            
          q-separator
          q-card-actions.q-mt-lg
            q-btn(flat size="lg" style="padding: 20px;" @click="register").bg-green.q-pa-lg.text-white регистрация
            // q-btn(flat).text-grey-8
            //   i.fa-brands.fa-youtube.q-mr-xs
            //   span посмотреть видео
      div.col-md-6.q-pa-lg.image-container
        transition(name="fade")
          img(:src="main")#main.rotate
    

  div#footer.section.q-pa-lg
    q-separator
    div.row.full-height
      div.col-md-4.col-xs-12.q-pt-sm
        p.text-bold VOSHOD
        p.q-pt-xs платформа токенизации бизнеса
        p.q-pt-xs welcome@voshod.io
        q-btn(flat size="lg" @click="goToTelegram")
          i.fa-brands.fa-telegram

        q-btn(flat size="lg" @click="goToGithub")
          i.fa-brands.fa-github
 

</template>

<script setup lang="ts">//
import {ref, onMounted} from 'vue'

import main from '~/assets/main.svg?url'
import club1 from '~/assets/club1.svg?url'
import daofree from '~/assets/dao_free.svg?url'
import flow1 from '~/assets/flow1.svg?url'
import flow2 from '~/assets/flow2.svg?url'
import flow3 from '~/assets/flow3.svg?url'
import flow4 from '~/assets/flow4.svg?url'
import ticket from '~/assets/ticket.svg?url'
import buycheaper from '~/assets/buycheaper.svg?url'
import sellmore from '~/assets/sellmore.svg?url'
import bizsystem from '~/assets/bizsystem.svg?url'
import systemgov from '~/assets/systemgov.svg?url'
import systemadmin from '~/assets/systemadmin.svg?url'
import systemfunds from '~/assets/systemfunds.svg?url'
import systemprojects from '~/assets/systemprojects.svg?url'
import systemgoals from '~/assets/systemgoals.svg?url'
import systemtasks from '~/assets/systemtasks.svg?url'
import blockchain from '~/assets/blockchain.svg?url'
import anime from 'animejs'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()


let hello = ref([
  'для привлечения новых клиентов и оборотного капитала без процентов'
  // 'Управляй развитием бизнеса и получай доход', 
  // 'Учись новому на практике',
  // 'Создавай прогресс',
  // 'Играй в дополненной реальности',
  // 'Совладей',
  ])


let goodbuy = ref([
  'прогрессивной программы лояльности для бизнеса'
  // 'Управляй развитием бизнеса и получай доход', 
  // 'Учись новому на практике',
  // 'Создавай прогресс',
  // 'Играй в дополненной реальности',
  // 'Совладей',
  ])

let options = ref(
  {
      mouseControls: true,
      touchControls: true,
      minHeight: 500.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00
  }
)

let register = () => {
  userStore.setRegisterNow(!userStore.registerNow)
}

let goToTelegram = () => {
  window.location = "https://t.me/voshod_news"
}

let goToGithub = () => {
  window.location = "https://github.com/unicore"
}


onMounted(async () => {

  // anime({
  //   targets: '#main',
  //   keyframes: [
  //     { rotate: '360deg', scale: 1 },
  //     { rotate: '720deg', scale: 1.5 },
  //     { rotate: '1080deg', scale: 1 },
  //   ],
  //   loop: true,
  //   duration: 5000,
  //   easing: 'linear',
  // });

})
</script>

<style scoped>

.section{
  padding-top: 150px;
  padding-bottom: 150px;
}

.section h1{
  font-size: 80px;
}

.section h2{
  font-size: 70px;
  font-weight: 500;
}

.section h3{
  font-size: 30px;
  font-weight: 500;
}

.section h4 {
  font-size: 26px;
  font-weight: 500;
}

.section h5 {
  font-size: 24px;
  font-weight: 500;
}


@media (max-width: 768px) {
  h1 {
    font-size: 48px !important;
  }

  h2 {
    font-size: 32px !important;
  }
}



.section img {
  max-height: 300px;
}

.section .image-container{
  margin: auto;
  text-align: -webkit-center;
}

.background-green{
  background: #0AC05E;
}

.section .size1 {
  width: 100px; 
  height: 100px;  
  border-radius: 50px; 
}

.section .size2 {
  width: 120px; 
  height: 120px;  
  border-radius: 60px; 
}

.section .size3 {
  width: 44px; 
  height: 44px;  
  border-radius: 22px; 
}

.section .size4 {
  width: 74px; 
  height: 74px;
  border-radius: 37px;   
}

.section .size5 {
  width: 114px; 
  height: 114px;  
  border-radius: 57px; 
}

.section .size6 {
  width: 170px; 
  height: 170px;  
  border-radius: 85px; 
}


.section .size7 {
  width: 60px; 
  height: 60px;  
  border-radius: 30px; 
}


.section .pool p{
  font-size: 12px !important;
}

.section .pool_white{
  border: 2px solid black; 
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto !important;
  margin-bottom: 10px !important;
  
}


.section .pool_black{
  border: 2px solid grey; 
  background: black;
  margin: auto !important;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-bottom: 10px !important;
}


</style>