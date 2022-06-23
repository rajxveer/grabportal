<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import Login from './components/Login.vue'
// import Dashboard from './components/Dashboard.vue'
// import History from './components/History.vue'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div>
    <Navbar v-if="!$route.meta.hideNavbar"/>
    <router-view />
  </div>
</template>
