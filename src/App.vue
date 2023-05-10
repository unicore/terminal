<template lang="pug">
router-view
</template>

<script lang="ts">
  
export default {
  name: "App",
  mounted() {
    // удаление загрузчика после загрузки компонента
    this.removeLoader();
  },
  methods: {
    removeLoader() {
      const loaderContainer = document.querySelector(".loader-container");
      if (loaderContainer) {
        loaderContainer.remove();
      }
    },
  },
};

</script>
