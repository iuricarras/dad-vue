import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { h } from 'vue'

export const useUserStore2 = defineStore('user', () => {
  const router = useRouter()
  const { toast } = useToast()
  const storeError = useErrorStore()


  const updateUser = async (userId, updatedData) => {
    try {
      // Remove campos vazios do objeto JSON
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key] === '' || updatedData[key] === null || 
          updatedData[key] === undefined) {
            delete updatedData[key];
        }
      });
      
      console.log("JSON-update2", updatedData)
      const response = await axios.patch(`/users/${userId}`, updatedData);
      const updatedUser = response.data;
      toast({
        title: 'Success!',
        description: updatedUser.data.nickname + ' : updated successfully.',
      });
      return updatedUser;
    } catch (e) {
        storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status, 'Error updating user!');
        return null;
    }
  };


  return {
    updateUser,
  }
})