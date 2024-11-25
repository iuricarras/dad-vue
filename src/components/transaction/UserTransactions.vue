<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'  // Importando o store

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
  transactions.value = await userStore.fetchUserTransactions(props.user.id)  // Chama a função do store
  filteredTransactions.value = transactions.value // Inicializa com todas as transações
  console.log('Transactions fetched:', transactions.value) // Para debug
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
  
      <div class="mb-4">
        <label for="transaction-type" class="mr-2">Filter by Type:</label>
        <select id="transaction-type" v-model="selectedType" @change="filterTransactions" class="border p-2">
          <option value="">All</option>
          <option value="B">Bonus</option>
          <option value="P">Purchases</option>
          <option value="I">Internal Spending/Earnings</option>
        </select>
      </div>

      <table class="w-full border-collapse border border-gray-300 text-sm">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-400 px-4 py-2 text-left">Type</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Date</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Game ID</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Euros</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Payment Type</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Payment Reference</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Brain Coins</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="transaction in paginatedTransactions"
            :key="transaction.id"
            class="odd:bg-gray-100 even:bg-gray-50"
          >
            <td class="border border-gray-300 px-4 py-2">{{ transaction.type }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ new Date(transaction.transaction_datetime).toLocaleString() }}
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ transaction.game_id || 'N/A' }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ transaction.type === 'P' ? transaction.euros : 'N/A' }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {{ transaction.type === 'P' ? transaction.payment_type || 'N/A' : 'N/A' }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {{ transaction.type === 'P' ? transaction.payment_reference || 'N/A' : 'N/A' }}
            </td>
            <td class="border border-gray-300 px-4 py-2">{{ transaction.brain_coins }}</td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="7" class="text-center text-gray-500 p-4">
              No transactions found for this user.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginacão -->
      <div class="flex justify-center mt-4">
        <button
          class="px-4 py-2 mx-1 bg-gray-800 text-white rounded hover:bg-gray-300"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          Prev
        </button>
        <span class="px-4 py-2 mx-1 text-black">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          class="px-4 py-2 mx-1 bg-gray-800 text-white rounded hover:bg-gray-300"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    
</template>
