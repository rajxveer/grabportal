<template>
  <div class="bg-gray-800">
    <nav
      class="container px-4 py-2 mx-auto md:flex md:justify-between md:items-center"
    >
      <div
        class="text-xl font-bold text-gray-100 md:text-2xl hover:text-green-500"
      >
        <img alt="ATX logo" src="../assets/atx.ico" class="h-20" />
      </div>

      <ul
        class="flex-col text-lg mt-8 space-y-4 md:flex md:space-y-0 md:flex-row md:items-center md:space-x-5 md:mt-0 "
      >
        <router-link to="/dashboard">
          <li class="text-gray-100 hover:text-green-500 cursor-pointer">
            Dashboard
          </li>
        </router-link>

        <router-link to="/history">
          <li class="text-gray-100 hover:text-green-500 cursor-pointer">
            Transaction History
          </li>
        </router-link>

        <router-link to="/" @click="logout()">
          <li class="text-gray-100 hover:text-red-500 cursor-pointer">
            Logout
          </li>
        </router-link>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "Navbar",
  setup() {
    let showMenu = ref(false);
    const toggleNav = () => (showMenu.value = !showMenu.value);
    function logout() {
      localStorage.removeItem("token");
    }
    return { showMenu, toggleNav, logout };
  },
};
</script>
