<template>
  <div class="relative rounded overflow-hidden border">
    <img
      class="w-full bg-cover"
      :src="`/img/disney/${(title.length % 11) + 1}.png`"
      loading="lazy"
    />
    <div class="relative px-3 pb-2">
      <div v-if="imdbRating" class="absolute -top-3 right-2">
        <span
          class="items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
        >
          {{ imdbRating.toFixed(1) }}</span
        >
      </div>

      <div class="py-2 mb-2">
        <div class="text-sm">
          <span class="font-semibold">{{ title }}</span>
        </div>
      </div>
    </div>
    <div class="absolute bottom-1.5 right-3">
      <span class="text-xs text-gray-400 font-light">{{ runtime }} views</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Tile",
  props: {
    imdbId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imdbRating: {
      type: Number,
      required: false,
    },
    runtime: {
      type: Number,
      required: false,
    },
  },
});
</script>