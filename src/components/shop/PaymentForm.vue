<script setup>
import { ref, onMounted} from 'vue';
import { usePaymentStore } from '@/stores/payment.js';// Importa as funções
import { useErrorStore } from '@/stores/error'


const storeError = useErrorStore()
onMounted(() => {
  console.log('PaymentForm mounted')
  storeError.resetMessages()
  //storeError._message = ''
})
const props = defineProps({
  selectedItem: Object,
});
const usePayment=usePaymentStore();

const paymentInfo = ref({
  type: '',
  reference: '',
  value: 0,
});

// Inicializa o valor do pagamento com o preço do item selecionado
paymentInfo.value.value = props.selectedItem.price;

const handlePayment = async () => {
  // Chama a função processPayment do arquivo payment.js
  await usePayment.processPayment(paymentInfo);
  
};
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-semibold text-center mb-8">Complete your Payment</h1>

    <div v-if="props.selectedItem">
      <div class="mt-8 text-center">
        <label for="paymentType" class="block text-lg font-medium mb-2">Payment Type</label>
        <select v-model="paymentInfo.type" id="paymentType" class="p-2 border rounded mb-4">
          <option value="MBWAY">MBWAY</option>
          <option value="PAYPAL">PayPal</option>
          <option value="IBAN">IBAN</option>
          <option value="MB">MB</option>
          <option value="VISA">VISA</option>
        </select>

        <label for="reference" class="block text-lg font-medium mb-2">Reference</label>
        <input 
          v-model="paymentInfo.reference" 
          id="reference" 
          type="text" 
          class="p-2 border rounded mb-4" 
          placeholder="Enter your reference" 
        />
       <ErrorMessage  :errorMessage="storeError.fieldMessage(paymentInfo.type)"></ErrorMessage>
        

        <label for="value" class="block text-lg font-medium mb-2">Value</label>
        <input 
          v-model="paymentInfo.value" 
          id="value" 
          type="number" 
          class="p-2 border rounded mb-4" 
          placeholder="Enter the amount to pay" 
          min="1" 
          max="99" 
          readonly 
        />

        <button 
          @click="handlePayment" 
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
          Confirm Payment
        </button>
      </div>
    </div>
  </div>
</template>
