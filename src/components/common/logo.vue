<template>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 339.85 362.92"><g id="Object"><circle class="cls-1" cx="169.55" cy="31.99" r="18.41"/><circle class="cls-1" cx="137.22" cy="50.4" r="18.41"/><circle class="cls-1" cx="169.55" cy="68.81" r="18.41"/><circle class="cls-1" cx="202.43" cy="50.4" r="18.41"/><circle class="cls-1" cx="201.97" cy="88.48" r="18.41"/><circle class="cls-1" cx="169.55" cy="106.89" r="18.41"/><circle class="cls-1" cx="137.22" cy="87.88" r="18.41"/><circle class="cls-1" cx="72.55" cy="87.85" r="18.41"/><circle class="cls-1" cx="40.22" cy="106.26" r="18.41"/><circle class="cls-1" cx="72.55" cy="124.67" r="18.41"/><circle class="cls-1" cx="105.43" cy="106.26" r="18.41"/><circle class="cls-1" cx="104.97" cy="144.33" r="18.41"/><circle class="cls-1" cx="72.55" cy="162.74" r="18.41"/><circle class="cls-1" cx="40.22" cy="143.73" r="18.41"/><circle class="cls-1" cx="267.14" cy="87.22" r="18.41"/><circle class="cls-1" cx="234.82" cy="105.63" r="18.41"/><circle class="cls-1" cx="267.14" cy="124.04" r="18.41"/><circle class="cls-1" cx="300.03" cy="105.63" r="18.41"/><circle class="cls-1" cx="299.56" cy="143.71" r="18.41"/><circle class="cls-1" cx="267.14" cy="162.12" r="18.41"/><circle class="cls-1" cx="234.82" cy="143.11" r="18.41"/><circle class="cls-1" cx="169.27" cy="143.71" r="18.41"/><circle class="cls-1" cx="136.94" cy="162.12" r="18.41"/><circle class="cls-1" cx="169.27" cy="180.53" r="18.41"/><circle class="cls-1" cx="202.15" cy="162.12" r="18.41"/><circle class="cls-1" cx="201.69" cy="200.19" r="18.41"/><circle class="cls-1" cx="169.27" cy="218.6" r="18.41"/><circle class="cls-1" cx="136.94" cy="199.59" r="18.41"/><circle class="cls-1" cx="266.87" cy="199.56" r="18.41"/><circle class="cls-1" cx="234.54" cy="217.97" r="18.41"/><circle class="cls-1" cx="266.87" cy="236.38" r="18.41"/><circle class="cls-1" cx="299.75" cy="217.97" r="18.41"/><circle class="cls-1" cx="299.28" cy="256.05" r="18.41"/><circle class="cls-1" cx="266.87" cy="274.46" r="18.41"/><circle class="cls-1" cx="234.54" cy="255.45" r="18.41"/><circle class="cls-1" cx="168.99" cy="255.42" r="18.41"/><circle class="cls-1" cx="136.66" cy="273.83" r="18.41"/><circle class="cls-1" cx="168.99" cy="292.24" r="18.41"/><circle class="cls-1" cx="201.88" cy="273.83" r="18.41"/><circle class="cls-1" cx="201.41" cy="311.91" r="18.41"/><circle class="cls-1" cx="168.99" cy="330.32" r="18.41"/><circle class="cls-1" cx="136.66" cy="311.31" r="18.41"/><circle class="cls-1" cx="72.27" cy="198.94" r="18.41"/><circle class="cls-1" cx="39.94" cy="217.34" r="18.41"/><circle class="cls-1" cx="72.27" cy="235.75" r="18.41"/><circle class="cls-1" cx="105.15" cy="217.34" r="18.41"/><circle class="cls-1" cx="104.69" cy="255.42" r="18.41"/><circle class="cls-1" cx="72.27" cy="273.83" r="18.41"/><circle class="cls-1" cx="39.94" cy="254.82" r="18.41"/></g></svg>
</template>

<script setup lang="ts">

import { computed, ref, onMounted, watch} from 'vue'
import { useUserStore } from '~/stores/user'
import { useHostStore } from '~/stores/host'
import { useRouter } from 'vue-router'
import userBalance from '~/components/core/oneUserBalance.vue'
import config from '~/config'
import chains from '~/chainsMain'
import animate from 'animejs';
const router = useRouter()

const hostStore = useHostStore()
const userStore = useUserStore()

onMounted(async () => {

})


</script>


<style>


@keyframes dash {
  to {
    stroke-dashoffset: 1000;
  }
}

.cls-1 {
  stroke: #00d6a0;
  stroke-miterlimit: 10;
  stroke-dasharray: 100;
  transform-origin: 50% 50%;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>