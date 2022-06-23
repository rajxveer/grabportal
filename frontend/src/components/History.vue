<template>
  <div class="h-screen-full bg-slate-300">
    <div class="dashboard p-4">
      <div class="mt-5 w-full">
        <h1 class="text-2xl text-black font-medium">Transaction History</h1>
      </div>

      <!-- Transaction History -->
      <div class="mt-2 flex gap-2">
        <div class="mt-2 bg-gray-800 p-5 w-full rounded-md box-border shadow">
          <h2 class="font-bold text-lg text-white">
            Search previous transactions
          </h2>

          <!-- Search box starts here -->
          <div class="bg-white p-6 rounded-xl shadow-lg mt-5">
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6"
            >
              <div class="flex flex-col">
                <label
                  for="userEmailFilter"
                  class="font-medium text-sm text-slate-600"
                  >User Email</label
                >
                <input
                  v-model="filter.userEmail"
                  type="email"
                  id="userEmailFilter"
                  placeholder="user@mail.com"
                  class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg text-black"
                />
              </div>

              <div class="flex flex-col">
                <label
                  for="userPhoneFilter"
                  class="font-medium text-sm text-slate-600"
                  >User Phone</label
                >
                <input
                  v-model="filter.userPhone"
                  type="text"
                  id="userPhoneFilter"
                  placeholder="6012345678"
                  class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg text-black"
                />
              </div>

              <div class="flex flex-col">
                <label
                  for="transactionDateFilter"
                  class="font-medium text-sm text-slate-600"
                  >Transaction Date Start</label
                >
                <input
                  v-model="filter.transactionStartDate"
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
                  v-model="filter.transactionEndDate"
                  type="date"
                  id="transactionDateFilter"
                  class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg text-black"
                />
              </div>

              <!-- Edit it so that users are able to unselect their option -->
              <div class="flex flex-col">
                <label
                  for="denoFilter"
                  class="font-medium text-sm text-slate-600"
                  >Deno</label
                >
                <select
                  v-model="filter.deno"
                  id="denoFilter"
                  class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg"
                >
                  <option value="null" selected>None</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <!-- Edit it so that users are able to unselect their option -->
              <div class="flex flex-col">
                <label
                  for="statusFilter"
                  class="font-medium text-sm text-slate-600"
                  >Status</label
                >
                <select
                  v-model="filter.status"
                  id="statusFilter"
                  class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg"
                >
                  <option value="null" selected>None</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              <div class="flex flex-col">
                <label
                  for="transactionIDFilter"
                  class="font-medium text-sm text-slate-600"
                  >Transaction ID</label
                >
                <input
                  v-model="filter.transactionID"
                  type="text"
                  id="transactionIDFilter"
                  placeholder="012345"
                  class="mt-2 w-full px-1 py-1 border-solid border-2 rounded-lg text-black"
                />
              </div>
            </div>

            <div
              class="grid md:flex grid-cols-2 justify-end space-x-4 w-full mt-6"
            >
              <button
                @click="resetFilter()"
                class="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 font-bold text-white shadow-lg shadow-gray-200 transition ease-in-out duration-200 translate-10"
              >
                Reset
              </button>

              <button
                @click="filterFunction()"
                class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-bold text-white shadow-lg shadow-green-200 transition ease-in-out duration-200 translate-10"
              >
                Search
              </button>
            </div>
          </div>
          <!-- Search box ends here -->
        </div>
      </div>

      <div class="flex flex-wrap relative space-x-4 mt-5 mb-5 float-right">
        <!-- Dropdown toggle button -->
        <button
          @click="dropDownShowColumn = !dropDownShowColumn"
          class="flex items-center p-2 text-white bg-gray-400 hover:bg-gray-500 rounded-md transition ease-in-out duration-200 translate-10"
        >
          <span class="mr-2 font-bold">Filter by Columns</span>
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- Download buttons with download icon -->
        <button
          @click="exportData(false)"
          class="flex items-center p-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition ease-in-out duration-200 translate-10"
        >
          <span class="mr-2 font-bold">Download as .xlsx</span>
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button
          @click="exportData(true)"
          class="flex items-center p-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition ease-in-out duration-200 translate-10"
        >
          <span class="mr-2 font-bold">Download as .csv</span>
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <!-- End of download buttons -->

        <!-- Dropdown column menu -->
        <!-- Select All dropdown -->
        <div
          v-show="dropDownShowColumn"
          class="absolute mt-10 bg-gray-600 rounded-md w-40"
        >
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="selectAll"
                @click="columnsSelectAll()"
              />
              <span class="ml-2 text-sm">Select All</span>
            </label>
          </div>

          <!-- Transaction Date dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.transactionDate"
                @click="
                  columnsChecked.transactionDate =
                    !columnsChecked.transactionDate
                "
              />
              <span class="ml-2 text-sm">Transaction Date</span>
            </label>
          </div>

          <!-- Transaction ID dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.transactionID"
                @click="
                  columnsChecked.transactionID = !columnsChecked.transactionID
                "
              />
              <span class="ml-2 text-sm">Transaction ID</span>
            </label>
          </div>

          <!-- Username dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.userName"
                @click="columnsChecked.userName = !columnsChecked.userName"
              />
              <span class="ml-2 text-sm">Username</span>
            </label>
          </div>

          <!-- User Phone dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.userPhone"
                @click="columnsChecked.userPhone = !columnsChecked.userPhone"
              />
              <span class="ml-2 text-sm">User Phone</span>
            </label>
          </div>

          <!-- User Email dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.userEmail"
                @click="columnsChecked.userEmail = !columnsChecked.userEmail"
              />
              <span class="ml-2 text-sm">User Email</span>
            </label>
          </div>

          <!-- Amount dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.amount"
                @click="columnsChecked.amount = !columnsChecked.amount"
              />
              <span class="ml-2 text-sm">Amount</span>
            </label>
          </div>

          <!-- Status dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.status"
                @click="columnsChecked.status = !columnsChecked.status"
              />
              <span class="ml-2 text-sm">Status</span>
            </label>
          </div>

          <!-- MI Transaction ID dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.miTransactionID"
                @click="
                  columnsChecked.miTransactionID =
                    !columnsChecked.miTransactionID
                "
              />
              <span class="ml-2 text-sm">MI Transaction ID</span>
            </label>
          </div>

          <!-- MI Status dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.miStatus"
                @click="columnsChecked.miStatus = !columnsChecked.miStatus"
              />
              <span class="ml-2 text-sm">MI Status</span>
            </label>
          </div>

          <!-- Mode of Payment dropdown -->
          <div
            class="flex block px-4 py-2 text-sm text-gray-100 hover:bg-gray-400"
          >
            <label class="flex items-center">
              <input
                class="flex item-center"
                type="checkbox"
                id="checkbox"
                v-model="columnsChecked.modeOfPayment"
                @click="
                  columnsChecked.modeOfPayment = !columnsChecked.modeOfPayment
                "
              />
              <span class="ml-2 text-sm">Mode of Payment</span>
            </label>
          </div>
        </div>
      </div>
      <!-- End of column dropdown -->

      <!-- Transaction history table starts here -->
      <div>
        <div
          class="table-fixed mt-5 w-full overflow-x-scroll lg:overflow-x-auto bg-gray-800"
        >
          <!-- Pagination starts here -->
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

            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ pager.startIndex + 1 }}</span>
                  to
                  <span class="font-medium">{{ pager.endIndex + 1 }}</span>
                  of
                  <span class="font-medium">{{ pager.totalItems }}</span>
                  results
                </p>
              </div>

              <div>
                <ul
                  v-if="pager.pages && pager.pages.length"
                  class="pagination z-0 inline-flex rounded-md shadow-sm -space-x-px"
                >
                  <li
                    :class="{ disabled: pager.currentPage === 1 }"
                    class="page-item first-item inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <router-link :to="{ query: { page: 1 } }" class="page-link"
                      >First</router-link
                    >
                  </li>

                  <li
                    :class="{ disabled: pager.currentPage === 1 }"
                    class="page-item previous-item inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <router-link
                      :to="{ query: { page: pager.currentPage - 1 } }"
                      class="page-link"
                      >Previous
                    </router-link>
                  </li>

                  <li
                    v-for="page in pager.pages"
                    :key="page"
                    class="page-item number-item"
                  >
                    <router-link
                      v-if="pager.currentPage === page"
                      :to="{ query: { page: page } }"
                      class="page-link z-10 bg-green-600 text-white inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {{ page }}</router-link
                    >
                    <router-link
                      v-else
                      :to="{ query: { page: page } }"
                      class="page-link z-10 bg-white border-gray-300 text-gray-500 inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {{ page }}</router-link
                    >
                  </li>

                  <li
                    :class="{
                      disabled: pager.currentPage === pager.totalPages,
                    }"
                    class="page-item next-item inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <router-link
                      :to="{ query: { page: pager.currentPage + 1 } }"
                      class="page-link"
                      >Next</router-link
                    >
                  </li>

                  <li
                    :class="{
                      disabled: pager.currentPage === pager.totalPages,
                    }"
                    class="page-item last-item inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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

            <!-- Loading animation starts here -->
            <div
              v-if="loading"
              class="text-center justify-center overflow-hidden"
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
            <!-- End of loading animation -->
          </div>
          <!-- Ends of Pagination -->

          <!-- Content of table -->
          <table class="w-full text-sm text-center text-gray-300">
            <!-- Header/Top row of table -->
            <thead class="text-xs text-gray-200 uppercase">
              <tr>
                <th
                  v-if="columnsChecked.transactionDate"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  Transaction Date
                </th>
                <th
                  v-if="columnsChecked.transactionID"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  Transaction ID
                </th>
                <th
                  v-if="columnsChecked.userName"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  Username
                </th>
                <th
                  v-if="columnsChecked.userPhone"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  User Phone
                </th>
                <th
                  v-if="columnsChecked.userEmail"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  User Email
                </th>
                <th
                  v-if="columnsChecked.amount"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  Amount
                </th>
                <th
                  v-if="columnsChecked.status"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  Status
                </th>
                <th
                  v-if="columnsChecked.miTransactionID"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  MI Transaction ID
                </th>
                <th
                  v-if="columnsChecked.miStatus"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  MI Status
                </th>
                <th
                  v-if="columnsChecked.modeOfPayment"
                  scope="col"
                  class="uppercase px-6 py-3 border-2 border-slate-500"
                >
                  Mode of Payment
                </th>
              </tr>
            </thead>

            <tbody v-for="(item, index) in pageOfItems" :key="index">
              <tr
                class="hover:bg-gray-500 bg-slate-600 h-10"
                v-if="index % 2 === 0"
              >
                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.transactionDate"
                >
                  {{ item[1].created_at }}
                </td>
                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.transactionID"
                >
                  {{ item[1].id }}
                </td>
                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.userName"
                >
                  {{ item[1].user_name }}
                </td>
                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.userPhone"
                >
                  {{ item[1].user_phone }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.userEmail"
                >
                  {{ item[1].user_email }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.amount"
                >
                  {{ item[1].amount_value }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.status"
                >
                  {{ item[1].status }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.miTransactionID"
                >
                  {{ item[1].agent_transaction_id }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.miStatus"
                >
                  {{ item[1].novati_status }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.modeOfPayment"
                >
                  {{ item[1].provider }}
                </td>

                <td class="pl-2">
                  <button
                    class="flex items-center p-1 text-white bg-green-600 hover:bg-green-700 rounded-md transition ease-in-out duration-200 translate-10"
                  >
                    <span class="font-bold">Resend</span>
                    <svg
                      class="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                      />
                      clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>

                <td>
                  <button
                    class="flex items-center mr-2 p-1 text-white bg-green-600 hover:bg-green-700 rounded-md transition ease-in-out duration-200 translate-10"
                  >
                    <span class="font-bold">Repush</span>
                    <svg
                      class="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>

              <tr class="hover:bg-gray-500 bg-slate-700 h-10" v-else>
                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.transactionDate"
                >
                  {{ item[1].created_at }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.transactionID"
                >
                  {{ item[1].id }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.userName"
                >
                  {{ item[1].user_name }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.userPhone"
                >
                  {{ item[1].user_phone }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.userEmail"
                >
                  {{ item[1].user_email }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.amount"
                >
                  {{ item[1].amount_value }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.status"
                >
                  {{ item[1].status }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.miTransactionID"
                >
                  {{ item[1].agent_transaction_id }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.miStatus"
                >
                  {{ item[1].novati_status }}
                </td>

                <td
                  class="border-2 border-slate-500"
                  v-if="columnsChecked.modeOfPayment"
                >
                  {{ item[1].provider }}
                </td>

                <td class="pl-2">
                  <button
                    class="flex items-center p-1 text-white bg-green-600 hover:bg-green-700 rounded-md transition ease-in-out duration-200 translate-10"
                  >
                    <span class="font-bold">Resend</span>
                    <svg
                      class="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                      />
                      clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>

                <td>
                  <button
                    class="flex items-center mr-2 p-1 text-white bg-green-600 hover:bg-green-700 rounded-md transition ease-in-out duration-200 translate-10"
                  >
                    <span class="font-bold">Repush</span>
                    <svg
                      class="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            class="flex items-center justify-center text-gray-200"
            v-if="pageOfItems.length === 0 && !loading"
          >
            No record found
          </div>
        </div>
      </div>

      <!-- Transaction history table ends here -->
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import router from "../routes/routes";
import DataService from "../services/DataService";
export default {
  setup() {
    const loading = ref(true);
    const dropDownShowColumn = ref(false);
    const todayTransaction = ref({});
    const selectAll = ref(false);

    const columnsChecked = ref({
      transactionDate: true,
      transactionID: true,
      userName: true,
      userPhone: true,
      userEmail: true,
      amount: true,
      status: true,
      miTransactionID: false,
      miStatus: false,
      modeOfPayment: false,
    });

    const route = useRoute();
    const pager = ref({
      currentPage: 0,
      endIndex: 0,
      endPage: 0,
      pageSize: 0,
      pages: 0,
      startIndex: 0,
      startPage: null,
      totalItems: 0,
      totalPages: 0,
    });

    const pageOfItems = ref([]);

    const filter = ref({
      transactionID: null,
      transactionStartDate: "2021-10-03", //always required, should be set as today
      transactionEndDate: "2021-10-04",
      userPhone: null,
      userEmail: null,
      deno: null,
      status: null,
      isCSV: null,
    });

    function columnsSelectAll() {
      selectAll.value = !selectAll.value;
      if (selectAll.value) {
        //Loop through each key of an columnsChecked and update each
        Object.keys(columnsChecked.value).forEach(
          (key) => (columnsChecked.value[key] = true)
        );
      } else {
        columnsChecked.value["miTransactionID"] = false;
        columnsChecked.value["miStatus"] = false;
        columnsChecked.value["modeOfPayment"] = false;
      }
    }

    function filterFunction() {
      if (!filter.value.transactionStartDate) {
        // set to today date
        filter.value.transactionStartDate = "2021-10-03";
      }
      loading.value = true;
      DataService.getFilteredData(pager.value.currentPage, filter.value)
        .then((response) => {
          pager.value = response.data["pager"];
          pageOfItems.value = response.data["pageOfItems"];
          if(pageOfItems.value.length === 0){
            pager.value.startIndex = -1
          }
          loading.value = false;
        })
        .catch((e) => {
          console.warn(e);
        });
    }

    function verifyUser() {
      let token = localStorage.getItem("token");
      DataService.auth({ headers: { authorization: token } })
        .then((response) => {
          console.log(response.data.message);
          filterFunction();
        })
        .catch((e) => {
          router.push("/deniedAccess");
        });
    }

    function exportData(asCSV) {
      filter.value.asCSV = asCSV;
      let fileType;
      let fileName;
      if (filter.value.asCSV) {
        fileType = "csv/plain";
        fileName = "transactionHistory.csv";
      } else {
        fileType = "application/vnd.ms-excel";
        fileName = "transactionHistory.xlsx";
      }
      DataService.exportData(filter.value).then((result) => {
        var fileURL = window.URL.createObjectURL(
          new Blob([result.data], { type: fileType })
        );
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);

        fileLink.click();
      });
    }
    function resetFilter() {
      filter.value = {
        transactionID: null,
        //always required, should be set as today
        transactionStartDate: "2021-10-03",
        transactionEndDate: "2021-10-04",
        userPhone: null,
        userEmail: null,
        deno: null,
        status: null,
        asCSV: null,
      };
    }

    //watch(source,callback,option)
    watch(
      //getter function return page value
      () => route.query.page,
      (page) => {
        pageOfItems.value = [];
        if (page !== pager.value.currentPage) {
          page = parseInt(page) || 1;
          loading.value = true;
          DataService.getFilteredData(page, filter.value)
            .then((response) => {
              pager.value = response.data["pager"];
              pageOfItems.value = response.data["pageOfItems"];
              
              loading.value = false;
            })
            .catch((e) => {
              console.warn(e);
            });
        }
      },
      {
        immediate: true,
      }
    );

    onMounted(() => {
      verifyUser();
    });

    return {
      loading,
      dropDownShowColumn,
      todayTransaction,
      columnsChecked,
      selectAll,
      filter,
      pager,
      pageOfItems,
      verifyUser,
      filterFunction,
      columnsSelectAll,
      exportData,
      resetFilter,
    };

  },
};
</script>
