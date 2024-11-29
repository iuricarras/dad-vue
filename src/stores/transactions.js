import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { h } from 'vue'
import { useAuthStore } from '@/stores/auth';

export const useTransactionStore = defineStore('transaction', () => {
    const router = useRouter()
    const { toast } = useToast()
    const storeError = useErrorStore()
    const storeAuth = useAuthStore()
    const transactions = ref([])

    const totalTransactions = computed(() => {
        return transactions.value.length
    })

    const fetchTransactions = async () => {
        storeError.resetMessages();
        try {
          console.log('Fetching transactions...');
          const response = await axios.get('transactions');
      
          if (Array.isArray(response.data)) {
            transactions.value = response.data; 
          } else {
            console.error('Invalid data format:', response.data);
            transactions.value = []; 
          }
        } catch (e) {
          storeError.setErrorMessages(e.response?.data?.message,e.response?.data?.errors,e.response?.status,'Error fetching transactions!');
        }
      };
      

      const fetchTransaction = async (userId) => {
        console.log(storeAuth.user.id)
        try {
          const response = await axios.get(`transactions/${storeAuth.user.id}`);
          if (Array.isArray(response.data)) {
            return response.data;
          } else {
            console.warn('Resposta da API não é um array');
            return []; 
          }
        } catch (e) {
          storeError.setErrorMessages(e.response?.data?.message,e.response?.data?.errors,e.response?.status,'Error fetching user transactions!');
          return []; 
        }
      }

      const insertTransaction = async (transaction) => {
        // Reiniciar mensagens de erro
        storeError.resetMessages();
    
        try {
            // Enviar transação para a API
            const response = await axios.post('/transactions', transaction);
    
            // Adicionar a nova transação ao estado local
            transactions.value.push(response.data.data);
    
            // Exibir notificação de sucesso
            toast({
                description: `Transaction #${response.data.data.id} has been created successfully!`,
                action: h(
                    ToastAction,
                    {
                        altText: `View transaction`,
                        onclick: () => {
                            router.push({
                                name: 'transactionDetail',
                                params: { id: response.data.data.id },
                            });
                        },
                    },
                    {
                        default: () => `View transaction`,
                    }
                ),
            });
    
            return response.data.data;
        } catch (e) {
            // Capturar erros e configurar mensagens
            storeError.setErrorMessages(
                e.response?.data?.message || 'An unexpected error occurred.',
                e.response?.data?.errors || null,
                e.response?.status || 500,
                'Error creating transaction!'
            );
    
            // Retornar falso em caso de erro
            return false;
        }
    };
    return {
        transactions, totalTransactions,
        fetchTransactions, fetchTransaction,
        insertTransaction,
    }
})
