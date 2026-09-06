<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ editId: Number, records: Array })
const emit = defineEmits(['submit', 'cancel'])

// Food Menu Item Fields — matches your Module 6 system!
const form = ref({
  name: '',
  category: '',
  price: '',
  description: ''
})

watch(() => props.editId, (id) => {
  if (id) {
    const rec = props.records.find(r => r.id === id)
    if (rec) form.value = { ...rec }
  } else {
    form.value = { name:'', category:'', price:'', description:'' }
  }
}, { immediate: true })

function submit() {
  emit('submit', form.value)
  form.value = { name:'', category:'', price:'', description:'' }
}
</script>

<template>
  <div class="bg-white p-5 rounded-lg shadow mb-6 border-t-4 border-orange-500">
    <h3 class="text-lg font-semibold mb-4 text-orange-700">
      {{ editId ? '✏️ Edit Menu Item' : '➕ Add New Menu Item' }}
    </h3>
    <div class="grid gap-3 mb-4">
      <input v-model="form.name" placeholder="🍽️ Item Name *" class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
      <select v-model="form.category" class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
        <option value="">Select Category *</option>
        <option value="🍔 Burgers">🍔 Burgers</option>
        <option value="🍕 Pizza">🍕 Pizza</option>
        <option value="🍜 Rice & Noodles">🍜 Rice & Noodles</option>
        <option value="🥗 Snacks">🥗 Snacks</option>
        <option value="🥤 Drinks">🥤 Drinks</option>
        <option value="🍰 Desserts">🍰 Desserts</option>
      </select>
      <input v-model="form.price" placeholder="₱ Price *" class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
      <input v-model="form.description" placeholder="📝 Description / Availability" class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
    </div>
    <div class="gap-2 flex flex-wrap">
      <button @click="submit" class="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700">
        {{ editId ? 'Update Menu Item' : 'Add to Menu' }}
      </button>
      <button v-if="editId" @click="$emit('cancel')" class="bg-gray-400 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-500">
        Cancel
      </button>
    </div>
  </div>
</template>