<script setup>
import { onMounted, ref, computed} from 'vue';

const props = defineProps({
  fetchFn: Function, 
  userId: Number, 
});

const transactions = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const selectedType = ref('');
const totalTransactions = ref(0);
const isLoading = ref(false);

const totalPages = computed(() => {
  return Math.ceil(totalTransactions.value / itemsPerPage.value);
});

const paginatedTransactions = computed(() => {
  return transactions.value;
});

const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const params = {
      page: currentPage.value,
      itemsPerPage: itemsPerPage.value,
      type: selectedType.value,
      userId: props.userId, 
    };
    const response = await props.fetchFn(params); 
    transactions.value = response.transactions;
    totalTransactions.value = response.total;
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
  } finally {
    isLoading.value = false;
  }
};

const filterTransactions = async () => {
  currentPage.value = 1; 
  await fetchTransactions(); 
};

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await fetchTransactions();
  }
};

const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await fetchTransactions();
  }
};


onMounted(fetchTransactions);
</script>

<template>
  <div class="overflow-x-auto p-6 bg-gray-800 text-white rounded-lg mx-auto max-w-6xl mt-2">
    <div class="mb-1">
      <label for="transaction-type" class="mr-2 text-sm">Filter by Type:</label>
      <select
        id="transaction-type"
        v-model="selectedType"
        @change="filterTransactions"
        class="border p-1 text-sm bg-gray-700 text-white rounded"
      >
        <option value="">All</option>
        <option value="B">Bonus</option>
        <option value="P">Purchases</option>
        <option value="I">Internal Spending/Earnings</option>
      </select>
    </div>
    
    <table class="w-full text-left border-collapse border border-gray-700 mb-4 text-sm">
      <thead>
        <tr class="bg-gray-700">
          <th class="border border-gray-700 px-2 py-2">Type</th>
          <th class="border border-gray-700 px-2 py-2">Date</th>
          <th class="border border-gray-700 px-2 py-2">Game ID</th>
          <th class="border border-gray-700 px-2 py-2">Euros</th>
          <th class="border border-gray-700 px-2 py-2">Payment Type</th>
          <th class="border border-gray-700 px-2 py-2">Payment Reference</th>
          <th class="border border-gray-700 px-2 py-2">Brain Coins</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transaction in paginatedTransactions"
          :key="transaction.id"
          class="odd:bg-gray-800 even:bg-gray-700"
        >
          <td class="border border-gray-700 px-2 py-2 capitalize">
            {{ transaction.type === 'B' ? 'Bonus' : transaction.type === 'P' ? 'Purchase' : 'Internal' }}
          </td>
          <td class="border border-gray-700 px-2 py-2">
            {{ new Date(transaction.transaction_datetime).toLocaleString() }}
          </td>
          <td class="border border-gray-700 px-2 py-2">{{ transaction.game_id || 'N/A' }}</td>
          <td class="border border-gray-700 px-2 py-2">
            {{ transaction.type === 'P' ? transaction.euros : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-2 py-2">
            {{ transaction.type === 'P' ? transaction.payment_type || 'N/A' : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-2 py-2">
            {{ transaction.type === 'P' ? transaction.payment_reference || 'N/A' : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-2 py-2">{{ transaction.brain_coins }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-center mt-4">
      <button
        class="px-4 py-1 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>
      <span class="px-4 py-2 mx-1 text-gray-300">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>
