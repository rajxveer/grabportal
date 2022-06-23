<template>
  <div>
    <apexchart type="bar" width="100%" height="200%" :options="options" :series="series"></apexchart>
  </div>
  <div class="bg-white p-6 rounded-xl shadow-lg mt-5">
    <div class="grid grid-cols-2 gap-6">
      <div class="flex flex-col">
        <label for="transactionDateFilter" class="font-medium text-sm text-stone-600">Transaction Date
          Start</label>
        <input v-model="dateFilter.startDate" type="date" id="transactionDateFilter"
          class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg text-black" />
      </div>

      <div class="flex flex-col">
        <label for="transactionDateFilter" class="font-medium text-sm text-stone-600">Transaction Date
          End</label>
        <input v-model="dateFilter.endDate" type="date" id="transactionDateFilter"
          class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg text-black" />
      </div>
    </div>

    <div class="grid md:flex grid-cols-2 justify-end space-x-4 w-full mt-6">
      <button @click="getDefaultMOPChart()"
        class="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 font-bold text-white shadow-lg shadow-gray-200 transition ease-in-out duration-200 translate-10">
        Last 30 days
      </button>

      <button @click="getFilterMOPChart()"
        class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-bold text-white shadow-lg shadow-green-200 transition ease-in-out duration-200 translate-10">
        Apply
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import DataService from "../services/DataService";
export default {

  setup() {
    onMounted(() => {
      getDefaultMOPChart();
    });

    const dateFilter = ref({
      isDefault: true,
      startDate: null,
      endDate: null
    });

    const options = ref({
      chart: {
        id: 'mode-of-payment'
      },
      xaxis: {
        categories: ['KiplePay', 'paynet']
      }
    });

    const series = ref([{
      name: 'series',
      data: [0, 0]
    }]);

    async function getDefaultMOPChart() {
      dateFilter.value.isDefault = true;
      await DataService.getMOPChart(dateFilter.value)
        .then((res) => {
          dateFilter.value.startDate = res.data[0].startDate
          dateFilter.value.endDate = res.data[0].endDate
          if (res.data[1].KiplePay) {
            series.value[0].data[0] = res.data[1].KiplePay.count
          }
          if (res.data[1].paynet) {
            series.value[0].data[1] = res.data[1].paynet.count
          }
        })
        .catch((e) => {
          console.warn(e)
        })
    };

    async function getFilterMOPChart() {
      dateFilter.value.isDefault = false;
      await DataService.getMOPChart(dateFilter.value)
        .then((res) => {
          console.log(res)
          if (res.data.KiplePay) {
            series.value[0].data[0] = res.data.KiplePay.count
          }
          if (res.data.paynet) {
            series.value[0].data[1] = res.data.paynet.count
          }
        })
        .catch((e) => {
          console.warn(e)
        })
    };

    return {
      dateFilter, options, series, getDefaultMOPChart, getFilterMOPChart
    };
  }
};
</script>
