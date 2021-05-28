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
    class="container px-6 py-1 md:mt-4 rounded-lg shadow-md mx-auto bg-gray-200"
  >
    <div class="mt-6 flex space-x-2 place-content-center">
      <!-- component -->
      <div class="relative flex-1">
        <input
          v-model="filter.title"
          type="text"
          class="bg-purple-white shadow-md rounded border-0 py-2 px-3 w-full"
          placeholder="Search by name..."
        />
        <div class="absolute right-3 top-3 text-purple-lighter">
          <svg
            version="1.1"
            class="h-4 text-dark"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 52.966 52.966"
            style="enable-background: new 0 0 52.966 52.966"
            xml:space="preserve"
          >
            <path
              d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21
        c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279
        C52.074,52.304,52.086,51.671,51.704,51.273z M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19
        S32.459,40,21.983,40z"
            />
          </svg>
        </div>
      </div>
      <button
        type="button"
        class="px-4 py-2 font-medium tracking-wide text-white capitalize bg-blue-600 rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500 shadow-md"
        @click="getDisney(filter.type)"
      >
        Search
      </button>
      <button
        type="button"
        @click="showFilter = !showFilter"
        class="shadow-md rounded-lg hover:shadow-xl w-10 h-10 bg-purple-400 hover:bg-purple-300 focus:outline-none"
      >
        <img src="/ico/filter.svg" class="w-full h-full" alt="Filter" />
      </button>
    </div>

    <div
      class="flex flex-row flex-wrap justify-items-stretch md:justify-center gap-x-4 gap-y-2 mt-2"
      v-if="showFilter"
    >
      <select
        v-model="filter.genre"
        class="border-gray-300 px-1 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:flex-grow md:flex-grow-0"
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
      <select
        v-model="filter.year"
        class="border-gray-300 px-1 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">All Year</option>
        <option v-for="year in metaYear" :value="year" :key="year">
          {{ year }}
        </option>
      </select>
      <select
        v-model="filter.min_imdb"
        class="border-gray-300 px-1 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">All Imdb</option>
        <option v-for="i in 9" :value="i" :key="i">
          {{ i }} and higer
        </option>
      </select>
    </div>

    <div class="text-right text-sm mt-2">{{ disneyCount }} results</div>

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
    const metaYear = ref([]);

    const disneyCount = ref(0);

    let showFilter = ref(false);

    const filter = reactive({
      type: "",
      language: "",
      genre: "",
      year: "",
      min_imdb: "",
      title: "",
      skip: 0,
    });

    const getDisney = async (disneyType = filter.type, loadMore = false) => {
      if (loadMore == false) {
        filter.skip = 0;
      }
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

    const getMetaYear = async () => {
      return (metaYear.value = await getMetaByType("year"));
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
      filter.year = "";
      filter.min_imdb = "";
      filter.title = "";
      filter.type = page;
      filter.skip = 0;
      await getDisney();
      getMetaGenre();
      getMetaLanguage();
      getMetaYear();
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
      metaYear,
      goToPage,
      navClick,
      showFilter,
    };
  },
});
</script>