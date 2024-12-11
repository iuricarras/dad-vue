import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { h } from 'vue'

export const useUserStore3 = defineStore('user', () => {
  const router = useRouter()
  const { toast } = useToast()
  const storeError = useErrorStore()


  const createUser = async (createData) => {
    try {
      console.log("JSON-create2", createData)
      const response = await axios.post(`/users`, createData);
      const createdUser = response.data;
      toast({
        title: 'Success!',
        description: createdUser.data.nickname + ' : created successfully.',
      });
      return createdUser;
    } catch (e) {
        storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status, 'Error creating user!');
        return null;
    }
  };

  return {
    createUser,
  }
})