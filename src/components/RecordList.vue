<script setup>
const props = defineProps({ records: Array })
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="bg-white p-5 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4 text-orange-700">📋 Menu List</h3>
    
    <p v-if="records.length === 0" class="text-gray-500 text-center py-8">
      🍽️ Your menu is empty. Add your first delicious item above!
    </p>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-orange-50 text-left">
          <tr>
            <th class="p-3 font-semibold text-orange-800">Item Name</th>
            <th class="p-3 font-semibold text-orange-800">Category</th>
            <th class="p-3 font-semibold text-orange-800">Price</th>
            <th class="p-3 font-semibold text-orange-800">Description</th>
            <th class="p-3 font-semibold text-orange-800 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in records" :key="item.id" class="border-t border-orange-100 hover:bg-orange-50">
            <td class="p-3 font-medium">{{ item.name }}</td>
            <td class="p-3">{{ item.category }}</td>
            <td class="p-3 font-bold text-orange-600">₱{{ item.price }}</td>
            <td class="p-3 text-gray-600 text-sm">{{ item.description || '—' }}</td>
            <td class="p-3 text-center">
              <button @click="$emit('edit', item)" class="text-orange-600 font-medium mr-3 hover:underline">Edit</button>
              <button @click="$emit('delete', item.id)" class="text-red-600 font-medium hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>