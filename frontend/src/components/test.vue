<template>
  <div class="card text-center m-3">
    <h3 class="card-header">Vue.js + Node - Server Side Pagination Example</h3>
    <div class="card-body">
      <!-- <div v-for="item in pageOfItems" :key="item[0]">
        {{ item[1].user_phone }}
      </div> -->
      <div class="wrapping-table mt-10 overflow-x-scroll lg:overflow-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="uppercase px-6 py-3">Transaction Date</th>
            </tr>
          </thead>
          <tbody v-for="(item, index) in pageOfItems" :key="index">
            <tr>
              <td>
                {{ item[1].created_at }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- pagination -->
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <a
          href="#"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ pager.startIndex + 1 }}</span>
            to
            <span class="font-medium">{{
              pager.startIndex + pageOfItems.length
            }}</span>
            of
            <span class="font-medium">{{ pager.totalItems }}</span>
            results
          </p>
        </div>
        <div>
          <ul
            v-if="pager.pages && pager.pages.length"
            class="pagination relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          >
            <li
              :class="{ disabled: pager.currentPage === 1 }"
              class="page-item first-item relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <router-link :to="{ query: { page: 1 } }" class="page-link"
                >First</router-link
              >
            </li>
            <li
              :class="{ disabled: pager.currentPage === 1 }"
              class="page-item previous-item relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <router-link
                :to="{ query: { page: pager.currentPage - 1 } }"
                class="page-link"
                >Previous</router-link
              >
            </li>
            <li
              v-for="page in pager.pages"
              :key="page"
              class="page-item number-item"
            >
              <router-link
                v-if="pager.currentPage === page"
                :to="{ query: { page: page } }"
                class="page-link z-10 bg-indigo-500 text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >{{ page }}</router-link
              >
              <router-link
                v-else
                :to="{ query: { page: page } }"
                class="page-link z-10 bg-white border-gray-300 text-gray-500 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >{{ page }}</router-link
              >
            </li>
            <li
              :class="{ disabled: pager.currentPage === pager.totalPages }"
              class="page-item next-item relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <router-link
                :to="{ query: { page: pager.currentPage + 1 } }"
                class="page-link"
                >Next</router-link
              >
            </li>
            <li
              :class="{ disabled: pager.currentPage === pager.totalPages }"
              class="page-item last-item relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <router-link
                :to="{ query: { page: pager.totalPages } }"
                class="page-link"
                >Last</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- end of pagination -->
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import DataService from "../services/DataService";
import { ref, watch } from "vue";
export default {
  setup() {
    const route = useRoute();
    const pager = ref({
      currentPage: null,
      endIndex: null,
      endPage: null,
      pageSize: null,
      pages: null,
      startIndex: null,
      startPage: null,
      totalItems: null,
      totalPages: null,
    });
    const pageOfItems = ref([]);
    //watch(source,callback,option)
    watch(
      //getter function return page value
      () => route.query.page,
      (page) => {
        if (page !== pager.value.currentPage) {
          page = parseInt(page) || 1;
          DataService.getAll(page.value).then((response) => {
            pager.value = response.data["pager"];
            pageOfItems.value = response.data["pageOfItems"];
            console.log(pageOfItems.value);
          });
        }
      },
      {
        immediate: true,
      }
    );
    return {
      pager,
      pageOfItems,
    };
  },
};
</script>
