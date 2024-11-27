<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'  // Importando o store
import { useAuthStore } from '@/stores/auth';
const storeAuth = useAuthStore()
const props = defineProps({
  user: Object, // Recebe o usuário cujas transações serão exibidas
})
const emit = defineEmits(['close'])

const userStore = useUserStore()  // Usando o store user.js
const transactions = ref([])  // Todas as transações do usuário
const filteredTransactions = ref([]) // Transações filtradas
const currentPage = ref(1)  // Página atual
const itemsPerPage = ref(10)  // Quantidade de transações por página
const selectedType = ref('')  // Tipo de transação selecionado

// Computa o total de páginas com base no total de transações
const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
})

// Função para pegar as transações da página atual
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})

// Filtra as transações com base no tipo selecionado
const filterTransactions = () => {
  // Quando o filtro mudar, resetar a página para a primeira
  currentPage.value = 1

  if (selectedType.value) {
    filteredTransactions.value = transactions.value.filter(transaction => transaction.type === selectedType.value)
  } else {
    filteredTransactions.value = transactions.value
  }
}

// Busca as transações do usuário ao montar o componente
onMounted(async () => {
  console.log('UserTransactions mounted', storeAuth.user.id)
  transactions.value = await userStore.fetchUserTransactions(storeAuth.user.id)  // Chama a função do store
  filteredTransactions.value = transactions.value // Inicializa com todas as transações
})

// Função para ir para a página anterior
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Função para ir para a próxima página
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Fecha o modal
const close = () => {
  emit('close')
}
</script>

<template>
  <div class="p-6 bg-gray-800 text-white rounded-lg mx-auto max-w-6xl mt-10">
    <h2 class="text-xl mb-4">Your Transactions</h2>

    <div class="mb-4">
      <label for="transaction-type" class="mr-2">Filter by Type:</label>
      <select
        id="transaction-type"
        v-model="selectedType"
        @change="filterTransactions"
        class="border p-2 bg-gray-700 text-white rounded"
      >
        <option value="">All</option>
        <option value="B">Bonus</option>
        <option value="P">Purchases</option>
        <option value="I">Internal Spending/Earnings</option>
      </select>
    </div>

    <table class="w-full text-left border-collapse border border-gray-700 mb-4">
      <thead>
        <tr class="bg-gray-700">
          <th class="border border-gray-700 px-4 py-2">Type</th>
          <th class="border border-gray-700 px-4 py-2">Date</th>
          <th class="border border-gray-700 px-4 py-2">Game ID</th>
          <th class="border border-gray-700 px-4 py-2">Euros</th>
          <th class="border border-gray-700 px-4 py-2">Payment Type</th>
          <th class="border border-gray-700 px-4 py-2">Payment Reference</th>
          <th class="border border-gray-700 px-4 py-2">Brain Coins</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transaction in paginatedTransactions"
          :key="transaction.id"
          class="odd:bg-gray-800 even:bg-gray-700"
        >
          <td class="border border-gray-700 px-4 py-2 capitalize">
            {{ transaction.type === 'B' ? 'Bonus' : transaction.type === 'P' ? 'Purchase' : 'Internal' }}
          </td>
          <td class="border border-gray-700 px-4 py-2">
            {{ new Date(transaction.transaction_datetime).toLocaleString() }}
          </td>
          <td class="border border-gray-700 px-4 py-2">{{ transaction.game_id || 'N/A' }}</td>
          <td class="border border-gray-700 px-4 py-2">
            {{ transaction.type === 'P' ? transaction.euros : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-4 py-2">
            {{ transaction.type === 'P' ? transaction.payment_type || 'N/A' : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-4 py-2">
            {{ transaction.type === 'P' ? transaction.payment_reference || 'N/A' : 'N/A' }}
          </td>
          <td class="border border-gray-700 px-4 py-2">{{ transaction.brain_coins }}</td>
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
        class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600"
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
