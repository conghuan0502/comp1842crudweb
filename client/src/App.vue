<template>
  <div id="app" class="font-sans bg-gray-50">
    <router-view /> 

  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
