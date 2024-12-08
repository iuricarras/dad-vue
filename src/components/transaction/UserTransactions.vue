<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'  


const props = defineProps({
  id: 0, 
})
const emit = defineEmits(['close'])

const userStore = useUserStore()  
const transactions = ref([])  
const filteredTransactions = ref([]) 
const currentPage = ref(1) 
const itemsPerPage = ref(10)  
const selectedType = ref('')  


const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
})


const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})

const filterTransactions = () => {
  currentPage.value = 1

  if (selectedType.value) {
    filteredTransactions.value = transactions.value.filter(transaction => transaction.type === selectedType.value)
  } else {
    filteredTransactions.value = transactions.value
  }
}


onMounted(async () => {
  transactions.value = await userStore.fetchUserTransactions(props.id) 
  filteredTransactions.value = transactions.value 
})


const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
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
          <td class="border border-gray-700 px-2 py-2 capitalize text-xs">
            {{ transaction.type === 'B' ? 'Bonus' : transaction.type === 'P' ? 'Purchase' : 'Internal' }}
          </td>
          <td class="border border-gray-700 px-2 py-2 text-xs">
            {{ new Date(transaction.transaction_datetime).toLocaleString() }}
          </td>
          <td class="border border-gray-700 px-2 py-2 text-xs">{{ transaction.game_id || 'N/A' }}</td>
          <td class="border border-gray-700 px-2 py-2 text-xs">
            {{ transaction.type === 'P' ? transaction.euros : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-2 py-2 text-xs">
            {{ transaction.type === 'P' ? transaction.payment_type || 'N/A' : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-2 py-2 text-xs">
            {{ transaction.type === 'P' ? transaction.payment_reference || 'N/A' : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-2 py-2 text-xs">{{ transaction.brain_coins }}</td>
        </tr>
        <tr v-if="filteredTransactions.length === 0">
          <td colspan="7" class="text-center text-gray-500 p-4">
            No transactions found for this user.
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-center mt-4">
      <button
        class="px-4 py-1 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>
      <span class="px-4 py-2 mx-1 text-gray-300 text-xs">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

