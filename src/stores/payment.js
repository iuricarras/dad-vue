import { defineStore } from 'pinia';
import { useToast } from '@/components/ui/toast/use-toast'
import { useErrorStore } from '@/stores/error'

export const usePaymentStore = defineStore('payment', () => {
  const { toast } = useToast()
  const storeError = useErrorStore()
  const processPayment = async (info) => {
    const paymentPayload = {
      type: info.value.type,
      reference: info.value.reference,
      value:info.value.value,
    };

    const isValid = validatePayment(paymentPayload);
    
    if (!isValid) {
      return; 
    }
    try {
      const response = await fetch('https://dad-202425-payments-api.vercel.app/api/debit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });
  
      if (response.status === 201) {
        toast({
          title: 'Payment Successful',
          description: 'The payment was completed successfully!',
        });
        return;
      }

      if (response.status === 422) {
        const errorData = await response.json();
        if (paymentPayload.type === 'MBWAY') {
          errorData.message += ': MbWay account funds are limited to 5€';
        }else if (paymentPayload.type === 'PAYPAL') {
          errorData.message += ': Paypal account funds are limited to 10€';
        }else if (paymentPayload.type === 'IBAN') {
          errorData.message += ': IBAN account funds are limited to 50€';
        }else if (paymentPayload.type === 'MB') {
          errorData.message += ': MB account funds are limited to 20€';
        }else if (paymentPayload.type === 'VISA') {
          errorData.message += ': VISA account funds are limited to 30€';
        }
        toast({
          title: 'Invalid Payment Method',
          description:  errorData.message,
          variant: 'destructive'  
      })
        return;
      }

    } catch (error) {
      storeError.setErrorMessages(
        error.response?.data?.message || 'Unexpected error occurred',
        error.response?.data?.errors || null,
        error.response?.status || 500,
        'Error processing the payment!'
      );
    }
  };

  const validatePayment = (paymentInfo) => {
    console.log(paymentInfo.type);
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
