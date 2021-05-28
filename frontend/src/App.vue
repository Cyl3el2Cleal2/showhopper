<template>
  <disney />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Disney from './pages/Disney.vue'

export default defineComponent({
  name: 'App',
  components: {
    Disney
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-y: auto;
}
</style>
