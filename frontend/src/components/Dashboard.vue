<template>
  <div class="min-h-screen bg-slate-300">
    <div class="dashboard p-4">
      <div class="mt-5 w-full mb-5">
        <h1 class="text-2xl text-black font-medium">Dashboard</h1>
      </div>

      <!-- Transaction History -->
      <div class="mt-2 flex gap-2">
        <div class="mt-2 bg-gray-800 p-5 w-full rounded-md box-border shadow">
          <!-- Loading animation starts here -->
          <div
            v-if="loading"
            class="pt-10 h-screen-full text-center justify-center overflow-hidden"
          >
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
          <!-- Ends of loading animation -->
          <!-- grid wrapper card -->
          <div v-else class="wrapper-card grid grid-cols-3 md:gap-2 mt-5 mb-5">
            <!-- Total payouts card  -->
            <div class="card bg-gray-800 w-full rounded-md px-5 shadow flex">
              <div class="block p-2 w-full">
                <p class="font-semibold text-white text-xl">
                  {{ totalPayout }}
                </p>
                <h2 class="font-normal text-gray-400 text-md mt-1">
                  Total Payouts
                </h2>
              </div>
            </div>
            <!-- end card -->

            <!-- Total sales card  -->
            <div class="card bg-gray-800 w-full rounded-md px-5 shadow flex">
              <div class="block p-2 w-full">
                <p class="font-semibold text-white text-xl">
                  {{ totalTransaction }}
                </p>
                <h2 class="font-normal text-gray-400 text-md mt-1">
                  Total Transactions
                </h2>
              </div>
            </div>
            <!-- end card -->

            <!-- Total customers card  -->
            <div class="card bg-gray-800 w-full rounded-md px-5 shadow flex">
              <div class="block p-2 w-full">
                <p class="font-semibold text-white text-xl">
                  {{ totalCustomer }}
                </p>
                <h2 class="font-normal text-gray-400 text-md mt-1">
                  Total Customers
                </h2>
              </div>
            </div>
            <!-- end card -->
            <!-- end wrapper card -->
          </div>
          <!-- end of card grid -->
          <!-- Filter card for total cards -->
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

            <div
              class="grid md:flex grid-cols-2 justify-end space-x-4 w-full mt-6"
            >
              <button
                @click="getTotalCard(true)"
                class="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 font-bold text-white shadow-lg shadow-gray-200 transition ease-in-out duration-200 translate-10"
              >
                Last 30 days
              </button>

              <button
                @click="getTotalCard(false)"
                class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-bold text-white shadow-lg shadow-green-200 transition ease-in-out duration-200 translate-10"
              >
                Apply
              </button>
            </div>
          </div>
          <!-- End of filter card for total cards -->
        </div>
      </div>
      <!-- ENd of card filter -->

      <!-- Four Main Charts -->
      <div
        class="wrapper-card grid lg:grid-cols-2 grid-cols-2 md:gap-2 mt-5 sm:grid-cols-1 gap-2"
      >
        <!-- Transaction Status bar chart -->
        <div class="card bg-gray-800 w-full h-fit rounded-md p-5 shadow">
          <h2 class="font-normal text-gray-400 text-lg mt-1">
            Transaction Status
          </h2>
          <TransactionStatusChart />
        </div>

        <!-- Transaction Amount bar chart -->
        <div class="card bg-gray-800 w-full h-fit rounded-md p-5 shadow">
          <h2 class="font-normal text-gray-400 text-lg mt-1">
            Transaction Deno
          </h2>
          <TransactionAmountChart />
        </div>

        <!-- MI Transaction Status bar chart -->
        <div class="card bg-gray-800 w-full h-fit rounded-md p-5 shadow">
          <h2 class="font-normal text-gray-400 text-lg mt-1">
            MI Transaction Status
          </h2>
          <MITransactionStatusChart />
        </div>

        <!-- Mode Of Payment bar chart -->
        <div class="card bg-gray-800 w-full h-fit rounded-md p-5 shadow">
          <h2 class="font-normal text-gray-400 text-lg mt-1">
            Mode of Payment
          </h2>
          <ModeOfPaymentChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import router from "../routes/routes";
import DataService from "../services/DataService";
import MITransactionStatusChart from "./MITransactionStatusChart.vue";
import ModeOfPaymentChart from "./ModeOfPaymentChart.vue";
import TransactionAmountChart from "./TransactionAmountChart.vue";
import TransactionStatusChart from "./TransactionStatusChart.vue";
undefined;

export default {
  setup() {
    onMounted(() => {
      verifyUser();
    });
    const loading = ref(true);
    const dateFilter = ref({
      isDefault: true,
      startDate: null,
      endDate: null,
    });
    const totalAmount = ref({});
    const totalTransaction = ref("null");
    const totalCustomer = ref("null");
    const totalPayout = ref("null");
    const todayTransaction = ref({});

    async function getTotalCard(isDefault) {
      dateFilter.value.isDefault = isDefault;
      loading.value = true;
      await DataService.getTotalCard(dateFilter.value)
        .then((res) => {
          dateFilter.value.startDate = res.data[0].startDate;
          dateFilter.value.endDate = res.data[0].endDate;
          totalTransaction.value = res.data[1].totalTransaction;
          totalPayout.value = res.data[2].totalPayout;
          totalCustomer.value = res.data[3].totalCustomer;
          loading.value = false;
        })
        .catch((e) => {
          console.warn(e);
        });
    }

    async function verifyUser() {
      let token = localStorage.getItem("token");
      await DataService.auth({ headers: { authorization: token } })
        .then((response) => {
          console.log(response.data.message);
          getTotalCard(true);
        })
        .catch((e) => {
          router.push("/deniedAccess");
        });
    }

    return {
      dateFilter,
      totalAmount,
      totalTransaction,
      totalCustomer,
      totalPayout,
      todayTransaction,
      loading,
      verifyUser,
      getTotalCard,
    };
  },

  components: {
    MITransactionStatusChart,
    ModeOfPaymentChart,
    TransactionAmountChart,
    TransactionStatusChart,
  },
};
</script>
