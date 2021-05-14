<template>
  <!-- component -->
  <nav
    class="font-sans flex flex-col text-center content-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-white shadow sm:items-baseline w-full"
  >
    <div class="mb-2 sm:mb-0 inner">
      <a
        href="/home"
        class="text-2xl no-underline text-grey-darkest hover:text-blue-dark font-sans font-bold"
        >The ShowHopper</a
      ><br />
      <span class="text-xs text-grey-dark">powered by Natha.</span>
    </div>
    <div class="cursor-pointer">
      <spane
        :class="filter.type === 'movie' ? 'underline' : ''"
        @click="goToPage('movie')"
        class="px-1 align-middle"
        >Movies</spane
      >

      <spane
        :class="filter.type === 'series' ? 'underline' : ''"
        @click="goToPage('series')"
        class="px-1 align-middle"
        >Series</spane
      >

      <spane
        :class="filter.type === 'episode' ? 'underline' : ''"
        @click="goToPage('episode')"
        class="px-1 align-middle"
        >Episode</spane
      >
    </div>
  </nav>
  <div
    class="container px-6 py-4 mt-4 rounded-lg shadow-md mx-auto bg-gray-200"
  >
    <div class="grid gap-8 mt-6 sm:grid-cols-2 md:grid-cols-4">
      <select
        v-model="filter.genre"
        class="border-gray-300 px-1 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">All Genre</option>
        <option v-for="genre in metaGenre" :value="genre" :key="genre">
          {{ genre }}
        </option>
      </select>
      <select
        v-model="filter.language"
        class="border-gray-300 px-1 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">All Language</option>
        <option
          v-for="language in metaLanguage"
          :value="language"
          :key="language"
        >
          {{ language }}
        </option>
      </select>
      <button
        class="px-4 py-2 font-medium tracking-wide text-white capitalize bg-blue-600 rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
        @click="getDisney(filter.type)"
      >
        Search
      </button>
    </div>
    <div class="text-right text-sm">{{ disneyCount }} results</div>

    <div
      class="w-full grid gap-1 grd-flow-col sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      <!-- component -->
      <div
        class="relative rounded overflow-hidden border"
        v-for="disney in disneys"
        :key="disney.imdbId"
      >
        <img
          class="w-full bg-cover"
          :src="`/img/disney/${(disney.title.length % 11) + 1}.png`"
          loading="lazy"
        />
        <div class="relative px-3 pb-2">
          <div v-if="disney.imdbRating" class="absolute -top-3 right-2">
            <span
              class="items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
            >
              {{ disney.imdbRating.toFixed(1) }}</span
            >
          </div>

          <div class="py-2 mb-2">
            <div class="text-sm">
              <span class="font-semibold">{{ disney.title }}</span>
            </div>
          </div>
        </div>
        <div class="absolute bottom-1.5 right-3">
          <span class="text-xs text-gray-400 font-light"
            >{{ disney.runtime }} views</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AxiosStatic } from "axios";
import {
  ref,
  defineComponent,
  inject,
  onBeforeMount,
  reactive,
  onMounted,
} from "vue";
export default defineComponent({
  name: "Disney",
  setup: () => {
    const axios: AxiosStatic = inject("$axios") as AxiosStatic;

    const disneys = ref([]);
    const metaLanguage = ref([]);
    const metaGenre = ref([]);

    const disneyCount = ref(0);

    const filter = reactive({
      type: "",
      language: "",
      genre: "",
      skip: 0,
    });

    const getDisney = async (disneyType = filter.type, loadMore = false) => {
      filter.type = disneyType;
      const res = await axios.get("api/disney", {
        params: filter,
      });
      if (loadMore === false) {
        //Initial disney
        disneys.value = res.data.data;
        disneyCount.value = res.data.count;
      } else {
        //This is load more
        disneys.value = disneys.value.concat(res.data.data);
      }
    };

    const scrollToLoad = async () => {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;
        if (bottomOfWindow) {
          //Load More Disneys!
          if (disneys.value.length < disneyCount.value) {
            filter.skip = disneys.value.length;
            getDisney(filter.type, true);
          }
        }
      };
    };

    const getMetaByType = async (metaType: string): Promise<any[]> => {
      const res = await axios.get("api/meta/" + metaType, {
        params: { type: filter.type },
      });
      // console.log(data)
      return res.data[metaType];
    };

    const getMetaLanguage = async () => {
      return (metaLanguage.value = await getMetaByType("language"));
    };

    const getMetaGenre = async () => {
      return (metaGenre.value = await getMetaByType("genre"));
    };

    const goToPage = async (page: string) => {
      if (page !== filter.type) {
        disneys.value = [];
        filter.language = "";
        filter.genre = "";
        filter.type = page;
        filter.skip = 0;
        getDisney();
        getMetaGenre();
        getMetaLanguage();
      }
    };

    onBeforeMount(async () => {
      goToPage("movie");
    });

    onMounted(async () => {
      scrollToLoad();
    });

    return {
      filter,
      disneys,
      disneyCount,
      getDisney,
      metaLanguage,
      metaGenre,
      goToPage,
    };
  },
});
</script>