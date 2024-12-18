<script setup>
import UserTransactions from '@/components/transaction/UserTransactions.vue';
import { useTransactionStore } from '@/stores/transactions';

const useTrans = useTransactionStore();

const fetchTransaction = async (params) => {
  const { page, itemsPerPage, type } = params;
  try {
    const response = await useTrans.fetchTransaction({ page, itemsPerPage, type });
    return response;
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    return { transactions: [], total: 0 };
  }
};
</script>

<template>
  <h2 class="text-2xl font-bold text-white-800 mb-4 p-4">Your Transactions</h2>
  <UserTransactions :fetchFn="fetchTransaction" />
</template>


