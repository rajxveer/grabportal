<template>
  <div>
    <apexchart
      v-if="showChart"
      type="bar"
      width="100%"
      height="200%"
      :options="options"
      :series="series"
    ></apexchart>
    <!-- Loading animation starts here -->
    <div v-else class="text-center justify-center overflow-hidden">
      <svg
        role="status"
        class="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-green-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
    <!-- End of loading animation -->
  </div>
  <div class="bg-white p-6 rounded-xl shadow-lg mt-5">
    <div class="grid grid-cols-2 gap-6">
      <div class="flex flex-col">
        <label
          for="transactionDateFilter"
          class="font-medium text-sm text-slate-600"
          >Transaction Date Start</label
        >
        <input
          v-model="dateFilter.startDate"
          type="date"
          id="transactionDateFilter"
          class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg text-black"
        />
      </div>

      <div class="flex flex-col">
        <label
          for="transactionDateFilter"
          class="font-medium text-sm text-slate-600"
          >Transaction Date End</label
        >
        <input
          v-model="dateFilter.endDate"
          type="date"
          id="transactionDateFilter"
          class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg text-black"
        />
      </div>
    </div>

    <div class="grid md:flex grid-cols-2 justify-end space-x-4 w-full mt-6">
      <button
        @click="clearFilter()"
        class="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 font-bold text-white shadow-lg shadow-gray-200 transition ease-in-out duration-200 translate-10"
      >
        Last 30 days
      </button>

      <button
        @click="getMIStatusChart()"
        class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-bold text-white shadow-lg shadow-green-200 transition ease-in-out duration-200 translate-10"
      >
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
      getMIStatusChart();
    });
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7); // subtract 7 days from today's date
    const formattedStartDate = startDate.toISOString().slice(0, 10);
    const formattedEndDate = today.toISOString().slice(0, 10);
    const showChart = ref(false);
    const dateFilter = ref({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });

    const options = ref({
      chart: {
        id: "mi-transaction-status",
        background: "#1F2937",
      },
      title: {
        text: undefined,
        align: "center",
        style: {
          color: "#ffffff",
        },
      },
      xaxis: {
        categories: ["Success", "Failed", "Pending"],
        labels: {
          show: true,
          style: {
            colors: "#ffffff",
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: "#ffffff",
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#ffffff",
      },
    });

    const series = ref([
      {
        name: "count",
        data: [0, 0, 0],
      },
    ]);

    async function clearFilter(){
      dateFilter.value = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
      series.value[0].data = [0,0,0];
      
      getMIStatusChart();
    }

    async function getMIStatusChart() {
      showChart.value = false;
      await DataService.getMIStatusChart(dateFilter.value)
        .then((res) => {
          dateFilter.value.startDate = res.data.startDate;
          dateFilter.value.endDate = res.data.endDate;
          options.value.chart.id =
            "MI Transaction status from " +
            dateFilter.value.startDate +
            " to " +
            dateFilter.value.endDate;
          options.value.title.text =
            "Transaction status from " +
            dateFilter.value.startDate +
            " to " +
            dateFilter.value.endDate;
          if (res.data.data.success) {
            series.value[0].data[0] = res.data.data.success.count;
          }
          if (res.data.data.failed) {
            series.value[0].data[1] = res.data.data.failed.count;
          }
          if (res.data.data.pending) {
            series.value[0].data[2] = res.data.data.pending.count;
          }
          console.log(res.data.data);
          showChart.value = true;
        })
        .catch((e) => {
          console.warn(e);
        });
    }

    return {
      dateFilter,
      options,
      series,
      showChart,
      getMIStatusChart,
      clearFilter
    };
  },
};
</script>
