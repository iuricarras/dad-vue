import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { h } from 'vue'


export const useUserStore2 = defineStore('user', () => {
  const router = useRouter()
  const storeAuth = useAuthStore()
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
      const response = await axios.patch(`/users/${userId}`, updatedData);
      const updatedUser = response.data;
      toast({
        title: 'Success!',
        description: updatedUser.data.nickname + ' : updated successfully.',
      });



      // fazer um teste no laravel na parte da foto


      console.log("!!!StoreAuth!!!", storeAuth.user)
      console.log("!!!UpdatedUser!!!", updatedUser.data)

      storeAuth.user = updatedUser.data
      //storeAuth.user.photo_filename = updatedUser.data.photo_filename

      router.push({ name: 'home' })

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