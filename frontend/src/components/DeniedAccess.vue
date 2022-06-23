<template>
  <div class="bg-slate-300">
    <div class="flex h-screen justify-center items-center">
      <div class="bg-gray-800 rounded-md p-5 text-center">
        <!-- Placing the Grab and PayHub images at the top of the Denied Access page -->
        <div class="flex flex-wrap space-x-5 justify-center p-12">
          <img 
            alt="Grab logo" 
            src="../assets/grab.png" 
            class="h-10 w-auto" 
          />
          <img
            alt="PayHub logo"
            src="../assets/payhub.png"
            class="h-11 w-auto"
          />
        </div>

        <!-- The title/main text right under the images -->
        <h1 class="text-white text-xl m-10 font-bold">
          Access denied, please login to proceed.
        </h1>

        <!-- The username input box -->
        <div>
          <router-link to="/">
            <li
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            >
              Back To Login Page
            </li>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "DeniedAccess",
  setup() {},
};
</script>
