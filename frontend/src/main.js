import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes/routes.js";
import "./tailwind.css";
import VueApexCharts from "vue3-apexcharts";

createApp(App).use(router).use(VueApexCharts).mount("#app");
