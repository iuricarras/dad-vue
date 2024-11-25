<script setup>
import { ref, computed, watch } from 'vue';
import User from '@/components/user/User.vue';

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([ 'viewTransactions']);

const currentPage = ref(1);
const itemsPerPage = ref(10);

const filterType = ref('');
const filterBlocked = ref('');

const filteredUsers = computed(() => {
  return props.users.filter((user) => {
    const matchesType = filterType.value ? user.type === filterType.value : true;
    const matchesBlocked = filterBlocked.value
      ? filterBlocked.value === 'Yes'
        ? user.blocked
        : !user.blocked
      : true;
    return matchesType && matchesBlocked;
  });
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => {
  const total = filteredUsers.value.length;
  return Math.ceil(total / itemsPerPage.value);
});

watch([filterType, filterBlocked], () => {
  currentPage.value = 1; // Reinicia para a primeira página ao alterar os filtros
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleViewTransactions = (user) => {
  emit('viewTransactions', user);
};
</script>

<template>
  <div class="bg-gray-800 text-black p-7 rounded-lg w-full max-w-screen-lg shadow-lg mt-12">
    <h2 class="text-xl mb-6 text-center font-semibold text-white">Users</h2>

    <div class="mb-4 flex justify-between items-center">
      <div>
        <label for="filterType" class="block text-white mb-1">User Type</label>
        <select id="filterType" v-model="filterType" class="px-3 py-2 border rounded-lg" >
          <option value="">All</option>
          <option value="A">Administrator</option>
          <option value="P">Player</option>
        </select>
      </div>

      <div>
        <label for="filterBlocked" class="block text-white mb-1">Blocked</label>
        <select id="filterBlocked" v-model="filterBlocked" class="px-3 py-2 border rounded-lg" >
          <option value="">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>

    <table class="w-full border-collapse border border-gray-300 text-sm">
      <thead class="bg-gray-200">
        <tr>
          <th class="border border-gray-400 px-4 py-2 text-left">Type</th>
          <th class="border border-gray-400 px-4 py-2 text-left">Nickname</th>
          <th class="border border-gray-400 px-4 py-2 text-left">Blocked</th>
          <th class="border border-gray-400 px-4 py-2 text-left">Photo</th>
          <th class="border border-gray-400 px-4 py-2 text-left">Brain Coins</th>
          <th class="border border-gray-400 px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <User v-for="user in paginatedUsers" :key="user.nickname" :user="user" @viewTransactions="handleViewTransactions"/>
        <tr v-if="paginatedUsers.length === 0">
          <td colspan="6" class="text-center text-gray-500 p-4">No users found.</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-center mt-4">
      <button class="px-4 py-2 mx-1 bg-gray-800 text-white rounded hover:bg-gray-300" @click="prevPage" :disabled="currentPage === 1">
        Prev
      </button>
      <span class="px-4 py-2 mx-1 text-white">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button class="px-4 py-2 mx-1 bg-gray-800 text-white rounded hover:bg-gray-300" @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
</template>
