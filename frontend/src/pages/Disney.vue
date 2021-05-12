<template>
  <nav>
      <a href="/movies">Movies</a>
      <a href="/series"></a>
  </nav>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
export default defineComponent({
  name: 'Disney',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup: () => {
    const count = ref(0)
    return { count }
  }
})
</script>

<style>

</style>