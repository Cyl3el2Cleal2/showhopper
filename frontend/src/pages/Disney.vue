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
        @click="navClick('movie')"
        class="px-1 align-middle"
        >Movies</spane
      >

      <spane
        :class="filter.type === 'series' ? 'underline' : ''"
        @click="navClick('series')"
        class="px-1 align-middle"
        >Series</spane
      >

      <spane
        :class="filter.type === 'episode' ? 'underline' : ''"
        @click="navClick('episode')"
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
      class="w-full grid gap-x-2.5 gap-y-4 grd-flow-col sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      <!-- component -->
      <tile
        class="relative rounded overflow-hidden border"
        v-for="disney in disneys"
        :key="disney.imdbId"
        v-bind="disney"
      />
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
import Tile from "../components/Tile.vue";
export default defineComponent({
  components: { Tile },
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

    const navClick = async (goto: string) => {
      if (goto !== filter.type) {
        await goToPage(goto);
      }
    };

    const goToPage = async (page: string) => {
      disneys.value = [];
      filter.language = "";
      filter.genre = "";
      filter.type = page;
      filter.skip = 0;
      await getDisney();
      getMetaGenre();
      getMetaLanguage();
    };

    onBeforeMount(async () => {
      await goToPage("movie");
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
      navClick,
    };
  },
});
</script>