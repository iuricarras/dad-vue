import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { h } from 'vue'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const { toast } = useToast()
  const storeError = useErrorStore()

  const users = ref([])
  const userDetails = ref(null)

  const totalUsers = computed(() => {
    return users.value.length
  })


  const fetchUsers = async () => {
    storeError.resetMessages();
    try {
      const response = await axios.get('users');
      if (Array.isArray(response.data)) {
        users.value = response.data; 
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        users.value = response.data.data;
      } else {
        console.error('Invalid data format:', response.data);
        users.value = []; 
      }
    } catch (e) {
      storeError.setErrorMessages(
        e.response?.data?.message,
        e.response?.data?.errors,
        e.response?.status,
        'Error fetching users!'
      );
    }
  };
  
  const updateUser = async (userId, updatedData) => {
    try {
      updatedData.blocked = updatedData.blocked === true || updatedData.blocked === 'true'; 
      const response = await axios.put(`/users/${userId}`, updatedData);
      console.log('Response data:', response.data);
      const updatedUser = response.data;
      const userIndex = users.value.findIndex(user => user.id === userId);
      toast({
        title: 'Success!',
        description: 'User: ' + users.value[userIndex].nickname + ' updated successfully.',
      });
      return updatedUser;
    } catch (e) {
        storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status, 'Error updating user!');
        return null;
    }
  };
  
  const fetchUser = async (userId) => {
    storeError.resetMessages()
    try {
      const response = await axios.get(`/users/${userId}`)
      const userIndex = users.value.findIndex(user => user.id === userId);
      users[userIndex].value = response.data
    } catch (e) {
      storeError.setErrorMessages(
        e.response?.data?.message,
        e.response?.data?.errors,
        e.response?.status,
        'Error fetching user!'
      )
      return null
    }
  }


  const fetchUserTransactions = async (userId) => {
    storeError.resetMessages()
    try {
      const response = await axios.get(`/users/${userId}/transactions`)
      return response.data 
    } catch (e) {
      storeError.setErrorMessages(
        e.response?.data?.message,
        e.response?.data?.errors,
        e.response?.status,
        'Error fetching user transactions!'
      )
      return []
    }
  }


  const fetchUserSingleplayerGames = async (userId) => {
    storeError.resetMessages()
    try {
      const response = await axios.get(`/users/${userId}/singleplayerGames`)
      return response.data 
    } catch (e) {
      storeError.setErrorMessages(
        e.response?.data?.message,
        e.response?.data?.errors,
        e.response?.status,
        'Error fetching singleplayer games!'
      )
      return []
    }
  }

  const fetchUserMultiplayerGames = async (userId) => {
    storeError.resetMessages()
    try {
      const response = await axios.get(`/users/${userId}/multiplayerGames`)
      return response.data 
    } catch (e) {
      storeError.setErrorMessages(
        e.response?.data?.message,
        e.response?.data?.errors,
        e.response?.status,
        'Error fetching multiplayer games!'
      )
      return []
    }
  }
  const toggleBlockStatus = async (user) => {
    try {
      const updatedData = {
        name: user.name, 
        email: user.email, 
        nickname: user.nickname,
        blocked: !user.blocked, 
      };
      const updatedUser = await updateUser(user.id, updatedData);
      const userIndex = users.value.findIndex((u) => u.id === user.id);
      if (userIndex >= 0) {
        users.value[userIndex] = { ...users.value[userIndex], ...updatedUser.data };
      }
      toast({
        title: 'Success!',
        description: 'User: ' + users.value[userIndex].nickname + ' field blocked updated successfully.',
      });
    
    } catch (e) {
      storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status,"Error updating user's blocked field!");
    }
  }

  const deleteUser = async (userId) => {
    storeError.resetMessages(); 
    try {
      const response = await axios.delete(`/users/${userId}`);
      const userIndex = users.value.findIndex((user) => user.id === userId);
      if (userIndex >= 0) {
        users.value.splice(userIndex, 1);
      }
  
      const message = response.status === 204 
        ? 'User permanently deleted successfully.' 
        : 'User has transactions or games, soft deleted.';
        
      toast({
        title: 'Success!',
        description: message,
      });
  
      return true;
    } catch (e) {
      storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status,"Error updating user's blocked field!");
      return false;
    }
  };

  const fetchPersonalScoreboard = async (userId) => {
    try {
        const response = await axios.get(`/games/scoreboard/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching personal scoreboard:', error);
        return {
            single_player: [],
            multiplayer: { total_victories: 0, total_losses: 0 },
        };
    }
  };

  
  
  
  return {
    users,
    userDetails,
    totalUsers,
    fetchUsers,
    fetchUser,
    fetchUserTransactions,
    fetchUserSingleplayerGames,
    fetchUserMultiplayerGames,
    updateUser,
    toggleBlockStatus,
    fetchPersonalScoreboard,
    deleteUser,
  }
})