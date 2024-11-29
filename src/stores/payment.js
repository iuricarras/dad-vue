import { defineStore } from 'pinia';
import { useToast } from '@/components/ui/toast/use-toast'
import { useErrorStore } from '@/stores/error'
import { useTransactionStore } from '@/stores/transactions';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router'

export const usePaymentStore = defineStore('payment', () => {
  const useUser=useUserStore()
  const storeAuth = useAuthStore()
  const router = useRouter()
  const useTransaction=useTransactionStore()
  const { toast } = useToast()
  const storeError = useErrorStore()
  
  const processPayment = async (info, amount, type) => {
    const paymentPayload = {
      type: info.value.type,
      reference: info.value.reference,
      value: info.value.value,
    }
    if (!validatePayment(paymentPayload)) return
    try {
      const response = await sendPaymentRequest(paymentPayload)
  
      if (response.status === 201) {
        await handleSuccessfulPayment(paymentPayload, amount, type)
      } else if (response.status === 422) {
        await handlePaymentError(response, paymentPayload)
      }
    } catch (error) {
      handleUnexpectedError(error);
    }
  }

  const sendPaymentRequest = async (paymentPayload) => {
    return await fetch('https://dad-202425-payments-api.vercel.app/api/debit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentPayload),
    })
  }

  const handleSuccessfulPayment = async (paymentPayload, amount, type) => {
    const transaction = {
      type,
      user_id: storeAuth.user.id,
      euros: paymentPayload.value,
      payment_type: paymentPayload.type,
      payment_reference: paymentPayload.reference,
      brain_coins: amount,
      transaction_datetime: new Date().toISOString(),
    }
  
    try {
      const createdTransaction = await useTransaction.insertTransaction(transaction);
  
      if (createdTransaction) {
        const updatedData = {
          name: storeAuth.user.name,
          email: storeAuth.user.email,
          nickname: storeAuth.user.nickname,
          blocked: storeAuth.user.blocked,
          brain_coins_balance: storeAuth.user.brain_coins_balance + amount,
        }
        const updatedUser = await useUser.updateUser(storeAuth.user.id, updatedData);
        if (updatedUser?.data?.brain_coins_balance !== undefined) {
          storeAuth.user.brain_coins_balance = updatedUser.data.brain_coins_balance;
          router.push({ name: 'home' })
        }
      }
    } catch (error) {
      storeError.setErrorMessages(
        error.response?.data?.message || 'Unexpected error occurred',
        error.response?.data?.errors || null,
        error.response?.status || 500,
        'Payment Successful, but Transaction Failed'
      )
    }
  }

  const handlePaymentError = async (response, paymentPayload) => {
    const errorData = await response.json();
    let message = errorData.message;
    switch (paymentPayload.type) {
      case 'MBWAY':
        message += ': MbWay account funds are limited to 5€';
        break;
      case 'PAYPAL':
        message += ': Paypal account funds are limited to 10€';
        break;
      case 'IBAN':
        message += ': IBAN account funds are limited to 50€';
        break;
      case 'MB':
        message += ': MB account funds are limited to 20€';
        break;
      case 'VISA':
        message += ': VISA account funds are limited to 30€';
        break;
    }
    toast({ title: 'Invalid Payment Method', description: message, variant: 'destructive' });
  }

  const handleUnexpectedError = (error) => {
    storeError.setErrorMessages(
      error.response?.data?.message || 'Unexpected error occurred',
      error.response?.data?.errors || null,
      error.response?.status || 500,
      'Error processing the payment!'
    )
  }
  
  

  const validatePayment = (paymentInfo) => {
    const validTypes = ["MBWAY", "PAYPAL", "IBAN", "MB", "VISA"];
    if (!validTypes.includes(paymentInfo.type)) {
      toast({
        title: 'Fill in the fields',
        description: 'Please select a valid payment method.',
        variant: 'destructive'  
    })
      return false;
    }
    const reference = paymentInfo.reference;
    if (paymentInfo.type === "MBWAY" && !/^[9]\d{8}$/.test(reference)) {
      storeError._fieldErrorMessages={
        ...storeError._fieldErrorMessages, 
        MBWAY: ['Invalid MBWAY reference. It should be 9 digits starting with 9.'], 
      };
      return false;
    }
    if (paymentInfo.type === "PAYPAL" && !/\S+@\S+\.\S+/.test(reference)) {
      storeError._fieldErrorMessages={
        ...storeError._fieldErrorMessages,
        PAYPAL: ['Invalid PAYPAL reference. It should be an email address.'],}
      return false;
    }
    if (paymentInfo.type === "IBAN" && !/^[A-Za-z]{2}\d{23}$/.test(reference)) {
      storeError._fieldErrorMessages={
        ...storeError._fieldErrorMessages,
        IBAN: ['Invalid IBAN reference. It should start with two letters and be followed by 23 digits.'],}
      return false;
    }
    if (paymentInfo.type === "MB" && !/^\d{5}-\d{9}$/.test(reference)) {
      storeError._fieldErrorMessages={
        ...storeError._fieldErrorMessages,
        MB: ['Invalid MB reference. It should be in the format XXXXX-XXXXXXXXX.'],}
      return false;
    }
    if (paymentInfo.type === "VISA" && !/^[4]\d{15}$/.test(reference)) {
      storeError._fieldErrorMessages={
        ...storeError._fieldErrorMessages,
        VISA: ['Invalid VISA reference. It should be 16 digits starting with 4.'],}
      return false;
    }
    return true;
  };

  return {
    validatePayment,
    processPayment,
  };
});
