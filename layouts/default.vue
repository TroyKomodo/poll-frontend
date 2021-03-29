<template>
  <div>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  mounted() {
    console.log(this);
  },
});
</script>
