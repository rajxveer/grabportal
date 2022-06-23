<template>
  <div class="bg-slate-300">
    <div class="flex h-screen justify-center items-center">
      <div class="bg-gray-800 rounded-md p-5 text-center">
        <!-- Placing the Grab and PayHub images at the top of the Login page -->
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
          Login to Grab Reload Reporting Portal
        </h1>

        <!-- The username input box -->
        <div>
          <input
            v-model="user.username"
            type="text"
            placeholder="Enter your username"
            class="px-5 py-1 border-solid border-2 rounded-lg"
          />
        </div>

        <!-- The password input box -->
        <div class="m-5">
          <input
            v-model="user.password"
            type="password"
            placeholder="Enter your password"
            class="px-5 py-1 border-solid border-2 rounded-lg"
          />
        </div>
       <div class="text-white px-5 py-1 bg-red-400 rounded-lg" v-if="user.error">{{ user.errorMsg }}</div>

        <!-- The Login button -->
        <div class="m-5">
          <button
            @click="login()"
            class="px-3 py-1.5 btn ml-2 border-green-500 bg-green-500 rounded-lg"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import DataService from "../services/DataService";
export default {
  name: "Login",

  setup() {
    const user = ref({
      username: "",
      password: "",
      error: false,
      errorMsg: "",
    });

    const router = useRouter();
    const route = useRoute();
    
    function login() {
      DataService.login(user.value)
        .then((response) => {
          user.value.error = false;
          let token = response.data.token;
          localStorage.setItem("token", token);
          router.push("/dashboard");
        })
        .catch((e) => {
          user.value.error = true;
          user.value.errorMsg = e.response.data.message;
          console.warn(e);
        });
    }
    return {
      user,
      router,
      route,
      login,
    };
  },
};
</script>
