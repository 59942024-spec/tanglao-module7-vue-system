<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// ============ CORE STATE ============
const isDarkMode = ref(false)
const showNotifications = ref(false)
const notifications = ref([
  { id: Date.now(), text: '✅ System ready — Menu Management loaded', time: 'Just now', read: false }
])

const currentView = ref('homepage')
const selectedCategory = ref(null)
const searchTerm = ref('')

const menuRecords = ref([])
const safetyArticles = ref([])
const editingItemId = ref(null)
const formName = ref('')
const formCategory = ref('')
const formPrice = ref('')
const formDesc = ref('')
const articleTitle = ref('')
const articleContent = ref('')
const editingArticleId = ref(null)

const orderStatus = ref([])

// ============ REGISTER CUSTOMER ============
const customerRecords = ref([])
const customerForm = ref({
  name: '',
  age: '',
  phone: '',
  orderDetails: '',
  note: '',
  payment: '',
  serviceType: '',
  tableNumber: '',
  // NEW Delivery fields
  driverName: '',
  driverContact: '',
  deliveryAddress: ''
})

const homeContent = ref({
  welcomeText: 'Welcome Dear Customer!',
  orderCaption: 'Order now, eat later! Fast & Very Easy!',
  shopName: 'Enchong Fast Food',
  ceoName: 'Angelica Tanglaw'
})

const bestSellers = ref([
  { id: 1, name: 'Ultimate Beef Burger', price: 85, category: 'Burgers', description: 'Juicy 100% Beef Patty with Fresh Veggies' },
  { id: 2, name: 'Deluxe Pepperoni Pizza', price: 199, category: 'Pizza', description: 'Loaded with Cheese & Premium Pepperoni' },
  { id: 3, name: 'Creamy Carbonara', price: 75, category: 'Rice & Noodles', description: 'Rich & Creamy Pasta with Bacon' },
  { id: 4, name: 'Chocolate Sundae', price: 45, category: 'Desserts', description: 'Creamy Ice Cream with Rich Chocolate' },
  { id: 5, name: 'Mango Shake', price: 50, category: 'Drinks', description: 'Fresh Ripe Mango — Best Seller!' },
  { id: 6, name: 'Crispy Fried Chicken', price: 95, category: 'Snacks', description: 'Golden Crispy Outside, Juicy Inside!' }
])

const categories = [
  { name: 'Burgers', icon: '🍔' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Rice & Noodles', icon: '🍜' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Drinks', icon: '🥤' },
  { name: 'Snacks', icon: '🥗' }
]

// ============ NOTIFICATION SYSTEM ============
const addNotification = (text) => {
  notifications.value.unshift({
    id: Date.now(),
    text: text,
    time: 'Just now',
    read: false
  })
  if (notifications.value.length > 15) notifications.value.length = 15
}

const feedback = ref({ show: false, type: '', message: '' })
const showFeedback = (type, message) => {
  feedback.value = { show: true, type, message }
  setTimeout(() => { feedback.value.show = false }, 8000)
}
const clearFeedback = () => {
  feedback.value = { show: false, type: '', message: '' }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  addNotification(`🎨 Theme changed to ${isDarkMode.value ? 'Dark' : 'Light'} Mode`)
}

// ============ DATA PERSISTENCE ============
const saveAllData = () => {
  localStorage.setItem('menu-items', JSON.stringify(menuRecords.value))
  localStorage.setItem('safety-articles', JSON.stringify(safetyArticles.value))
  localStorage.setItem('home-content', JSON.stringify(homeContent.value))
  localStorage.setItem('order-status', JSON.stringify(orderStatus.value))
  localStorage.setItem('customers', JSON.stringify(customerRecords.value))
}

const loadAllData = () => {
  const savedMenu = localStorage.getItem('menu-items')
  menuRecords.value = savedMenu ? JSON.parse(savedMenu) : [...bestSellers.value]

  const savedArticles = localStorage.getItem('safety-articles')
  if (savedArticles) safetyArticles.value = JSON.parse(savedArticles)

  const savedHome = localStorage.getItem('home-content')
  if (savedHome) Object.assign(homeContent.value, JSON.parse(savedHome))

  const savedOrders = localStorage.getItem('order-status')
  if (savedOrders) orderStatus.value = JSON.parse(savedOrders)

  const savedCustomers = localStorage.getItem('customers')
  if (savedCustomers) customerRecords.value = JSON.parse(savedCustomers)

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') isDarkMode.value = true
}

watch([menuRecords, safetyArticles, orderStatus, customerRecords], saveAllData, { deep: true })
watch(homeContent, saveAllData, { deep: true })
onMounted(() => {
  loadAllData()
  showFeedback('success', '✅ Welcome! Admin Dashboard loaded successfully.')
  addNotification('🔓 Admin Dashboard opened')
})

// ============ CUSTOMER REGISTRATION ============
 const validateCustomerForm = () => {
  if (!customerForm.value.name.trim()) {
    showFeedback('error', '⚠️ Please enter Name or Nickname!')
    return false
  }
  if (!customerForm.value.age || Number(customerForm.value.age) <= 0) {
    showFeedback('error', '⚠️ Please enter a valid Age!')
    return false
  }
  if (!customerForm.value.phone.trim()) {
    showFeedback('error', '⚠️ Please enter Contact Number!')
    return false
  }
  if (!customerForm.value.orderDetails.trim()) {
    showFeedback('error', '⚠️ Please enter Order Details!')
    return false
  }
  if (!customerForm.value.payment) {
    showFeedback('error', '⚠️ Please select Payment method!')
    return false
  }
  if (!customerForm.value.serviceType) {
    showFeedback('error', '⚠️ Please choose Takeout or Dine-in!')
    return false
  }

  // ✅ TAKEOUT: Require Driver & Delivery Info
  if (customerForm.value.serviceType === 'Takeout') {
    if (!customerForm.value.driverName.trim()) {
      showFeedback('error', '⚠️ Enter Driver Name for Delivery!')
      return false
    }
    if (!customerForm.value.driverContact.trim()) {
      showFeedback('error', '⚠️ Enter Driver Contact Number!')
      return false
    }
    if (!customerForm.value.deliveryAddress.trim()) {
      showFeedback('error', '⚠️ Enter Delivery Address!')
      return false
    }
  }

  // ✅ DINE-IN: Require Table Number
  if (customerForm.value.serviceType === 'Dine-in' && !customerForm.value.tableNumber.trim()) {
    showFeedback('error', '⚠️ Enter Table Number for Dine-in!')
    return false
  }

  return true
}


const saveCustomer = () => {
  if (!validateCustomerForm()) return
  
  // ✅ Save Bill & Money to record
  customerRecords.value.unshift({
    id: Date.now(),
    ...customerForm.value,
    totalBill: totalBill.value,
    customerMoney: Number(customerMoney.value) || 0,
    change: changeAmount.value,
    registeredAt: new Date().toLocaleString()
  })
  
  showFeedback('success', `✅ Customer "${customerForm.value.name}" registered! Total: ₱${totalBill.value}`)
  addNotification(`👤 New Customer: ${customerForm.value.name} — Total ₱${totalBill.value}`)
  resetCustomerForm()
}

const resetCustomerForm = () => {
  customerForm.value = {
    name: '', age: '', phone: '', orderDetails: '',
    note: '', payment: '', serviceType: '', tableNumber: '',
    driverName: '', driverContact: '', deliveryAddress: ''
  }
  selectedOrderItems.value = []
  showOrderMenu.value = false
  searchOrderMenu.value = ''
  customerMoney.value = ''
  clearFeedback()
}
// ============ EDIT REGISTERED CUSTOMER ============
const editingCustomerId = ref(null)
const editCustomerForm = ref({
  name: '', age: '', phone: '', orderDetails: '',
  note: '', payment: '', serviceType: '', tableNumber: '',
  driverName: '', driverContact: '', deliveryAddress: '',
  totalBill: '', customerMoney: '', change: ''
})

const startEditCustomer = (cust) => {
  editingCustomerId.value = cust.id
  editCustomerForm.value = {
    name: cust.name,
    age: cust.age,
    phone: cust.phone,
    orderDetails: cust.orderDetails,
    note: cust.note,
    payment: cust.payment,
    serviceType: cust.serviceType,
    tableNumber: cust.tableNumber,
    driverName: cust.driverName,
    driverContact: cust.driverContact,
    deliveryAddress: cust.deliveryAddress,
    totalBill: cust.totalBill,
    customerMoney: cust.customerMoney,
    change: cust.change
  }
}

const saveEditCustomer = (id) => {
  const idx = customerRecords.value.findIndex(c => c.id === id)
  if (idx !== -1) {
    customerRecords.value[idx] = {
      ...customerRecords.value[idx],
      ...editCustomerForm.value
    }
    showFeedback('success', '✅ Customer updated!')
  }
  editingCustomerId.value = null
}

const cancelEditCustomer = () => {
  editingCustomerId.value = null
}
// ============ MARK ORDER AS DONE & SERVED LIST ============
const servedOrders = ref([])
const searchServedName = ref('')

const markOrderAsDone = (cust) => {
  // Add to Served list
  servedOrders.value.unshift({
    ...cust,
    servedAt: new Date().toLocaleString()
  })
  // ✅ Remove from Registered Details list
  customerRecords.value = customerRecords.value.filter(c => c.id !== cust.id)
  showFeedback('success', `✅ Order for "${cust.name}" marked as Done!`)
  addNotification(`✅ Served: ${cust.name}`)
}

const filteredServedOrders = computed(() => {
  if (!searchServedName.value.trim()) return servedOrders.value
  const q = searchServedName.value.toLowerCase()
  return servedOrders.value.filter(c => c.name.toLowerCase().includes(q))
})

// ============ ORDER MENU SELECTOR ============
const showOrderMenu = ref(false)
const selectedOrderItems = ref([]) // [{ id, name, qty }]

// Get quantity for a menu item
const getOrderQty = (itemId) => {
  const found = selectedOrderItems.value.find(i => i.id === itemId)
  return found ? found.qty : 0
}

// + Button — Increase quantity
const increaseQty = (itemId, itemName) => {
  const found = selectedOrderItems.value.find(i => i.id === itemId)
  if (found) {
    found.qty++
  } else {
    selectedOrderItems.value.push({ id: itemId, name: itemName, qty: 1 })
  }
  updateOrderDetails()
}

// - Button — Decrease quantity
const decreaseQty = (itemId) => {
  const index = selectedOrderItems.value.findIndex(i => i.id === itemId)
  if (index !== -1) {
    if (selectedOrderItems.value[index].qty > 1) {
      selectedOrderItems.value[index].qty--
    } else {
      selectedOrderItems.value.splice(index, 1)
    }
    updateOrderDetails()
  }
}

// Auto-generate Order Details text
const updateOrderDetails = () => {
  if (selectedOrderItems.value.length === 0) {
    customerForm.value.orderDetails = ''
    return
  }
  const summary = selectedOrderItems.value.map(i => `${i.name} × ${i.qty}`).join('\n')
  customerForm.value.orderDetails = summary
}
const searchOrderMenu = ref('')

// Calculate Total Bill from selected items
const totalBill = computed(() => {
  return selectedOrderItems.value.reduce((sum, item) => {
    const menuItem = menuRecords.value.find(m => m.id === item.id)
    const price = menuItem ? Number(menuItem.price) : 0
    return sum + (price * item.qty)
  }, 0)
})

const customerMoney = ref('')
const changeAmount = computed(() => {
  const given = Number(customerMoney.value) || 0
  return given >= totalBill.value ? (given - totalBill.value).toFixed(2) : '0.00'
})

// Filter menu by search term
const filteredMenuForOrder = computed(() => {
  if (!searchOrderMenu.value.trim()) return menuRecords.value
  const q = searchOrderMenu.value.toLowerCase()
  return menuRecords.value.filter(i => 
    i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  )
})

// 👥 Counts ONLY currently registered customers
const activeCustomersCount = computed(() => {
  return customerRecords.value.length
})

// 💰 SUMS ALL ORDERS — Registered + Served/Done — NEVER loses amount!
const totalEarnings = computed(() => {
  const registeredSum = customerRecords.value.reduce((sum, customer) => {
    return sum + (Number(customer.totalBill) || 0)
  }, 0)
  const servedSum = servedOrders.value.reduce((sum, customer) => {
    return sum + (Number(customer.totalBill) || 0)
  }, 0)
  return registeredSum + servedSum
})
const menuCountByCategory = computed(() => {
  const counts = {}
  categories.forEach(cat => counts[cat.name] = 0)
  menuRecords.value.forEach(item => {
    if (counts[item.category] !== undefined) counts[item.category]++
  })
  return counts
})

const selectCategory = (catName) => {
  selectedCategory.value = catName
  searchTerm.value = ''
  currentView.value = 'list'
}

const validateForm = () => {
  if (!formName.value.trim()) { showFeedback('error', '⚠️ Item Name is required!'); return false }
  if (!formCategory.value) { showFeedback('error', '⚠️ Please select a Category!'); return false }
  if (!formPrice.value || Number(formPrice.value) <= 0) { showFeedback('error', '⚠️ Enter a valid Price > 0!'); return false }
  return true
}

const saveMenuItem = () => {
  if (!validateForm()) return
  if (editingItemId.value) {
    const i = menuRecords.value.findIndex(r => r.id === editingItemId.value)
    const oldName = menuRecords.value[i].name
    menuRecords.value[i] = {
      id: editingItemId.value, name: formName.value.trim(),
      category: formCategory.value, price: Number(formPrice.value),
      description: formDesc.value.trim()
    }
    editingItemId.value = null
    // ✅ USE BACKTICKS HERE!
    showFeedback('success', `✅ Menu item "${oldName}" updated successfully!`)
    addNotification(`✏️ Updated: ${oldName} → ${formName.value.trim()}`)
  } else {
    menuRecords.value.unshift({
      id: Date.now(), name: formName.value.trim(),
      category: formCategory.value, price: Number(formPrice.value),
      description: formDesc.value.trim()
    })
    // ✅ USE BACKTICKS HERE!
    showFeedback('success', `✅ Menu item "${formName.value.trim()}" added successfully!`)
    addNotification(`➕ Added Menu: ${formName.value.trim()}`)
  }
  resetMenuForm()
}

const resetMenuForm = () => {
  editingItemId.value = null
  formName.value = formCategory.value = formPrice.value = formDesc.value = ''
  // ✅ DELETE THE LINE: clearFeedback() ← THIS WAS HIDING YOUR ALERT!
}

const startEditItem = (item) => {
  editingItemId.value = item.id
  formName.value = item.name
  formCategory.value = item.category
  formPrice.value = item.price
  formDesc.value = item.description
  currentView.value = 'add'
  clearFeedback()
}

const cancelEdit = () => {
  resetMenuForm()
  currentView.value = 'list'
  showFeedback('info', 'ℹ️ Edit cancelled.')
}

const deleteItem = (id) => {
  if (confirm('⚠️ Delete this item? Cannot undo.')) {
    const item = menuRecords.value.find(i => i.id === id)
    menuRecords.value = menuRecords.value.filter(i => i.id !== id)
    showFeedback('success', '✅ Menu item deleted!')
    addNotification(`🗑️ Deleted: ${item?.name || 'Unknown'}`)
  }
}

const saveArticle = () => {
  if (!articleTitle.value.trim()) { showFeedback('error', '⚠️ Title required!'); return }
  if (!articleContent.value.trim()) { showFeedback('error', '⚠️ Content required!'); return }
  if (editingArticleId.value) {
    const i = safetyArticles.value.findIndex(a => a.id === editingArticleId.value)
    safetyArticles.value[i] = {
      id: editingArticleId.value, title: articleTitle.value.trim(),
      content: articleContent.value.trim(), date: new Date().toLocaleDateString()
    }
    editingArticleId.value = null
    showFeedback('success', '✅ Article updated!')
  } else {
    safetyArticles.value.unshift({
      id: Date.now(), title: articleTitle.value.trim(),
      content: articleContent.value.trim(), date: new Date().toLocaleDateString()
    })
    showFeedback('success', '✅ Article posted!')
    addNotification(`📰 New Article: ${articleTitle.value.trim()}`)
  }
  articleTitle.value = articleContent.value = ''
}

const startEditArticle = (art) => {
  editingArticleId.value = art.id
  articleTitle.value = art.title
  articleContent.value = art.content
}

const cancelArticleEdit = () => {
  editingArticleId.value = null
  articleTitle.value = articleContent.value = ''
  clearFeedback()
}

const deleteArticle = (id) => {
  if (confirm('⚠️ Delete this article?')) {
    safetyArticles.value = safetyArticles.value.filter(a => a.id !== id)
    showFeedback('success', '✅ Article deleted!')
  }
}

const filteredByCategory = computed(() => {
  let list = menuRecords.value
  if (selectedCategory.value) list = list.filter(i => i.category === selectedCategory.value)
  if (searchTerm.value.trim()) {
    const q = searchTerm.value.toLowerCase()
    list = list.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
  }
  return list
})

const returnToHome = () => {
  currentView.value = 'homepage'
  selectedCategory.value = null
  searchTerm.value = ''
  resetMenuForm()
  editingArticleId.value = null
}
const saveHomepageContent = () => {
  saveAllData() // Save to localStorage
  showFeedback('success', '✅ Homepage Updated! Header changed!')
  addNotification(`🏪 Shop name updated to: ${homeContent.shopName}`)
}
const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
}
</script>

<template>
 <div :class="['w-full px-3 sm:px-4 py-3 sm:py-4 min-h-screen transition-colors duration-300 flex flex-col', isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-red-50 to-gray-100']">
    <!-- HEADER -->
    <header class="bg-gradient-to-r from-red-600 to-rose-500 text-white py-4 sm:py-6 mb-6 sm:mb-8 shadow-lg rounded-b-2xl sm:rounded-b-3xl">
      <div class="max-w-7xl mx-auto px-3 sm:px-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div class="relative">
              <button @click="showNotifications=!showNotifications" class="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                <span class="text-xl sm:text-2xl">🔔</span>
                <span v-if="notifications.some(n=>!n.read)" class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-yellow-400 text-red-800 text-xs font-bold rounded-full flex items-center justify-center">!</span>
              </button>
              <div v-if="showNotifications" @click.outside="showNotifications=false" :class="['absolute right-0 top-12 w-80 sm:w-96 rounded-xl shadow-2xl z-50 p-4', isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-red-100']">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-bold text-base">🔔 Activity History</h4>
                  <button @click="markAllRead" class="text-sm text-blue-500 hover:underline">Mark all read</button>
                </div>
                <div class="space-y-3 max-h-96 overflow-y-auto">
                  <div v-for="n in notifications" :key="n.id" :class="['p-3 rounded-lg text-base border', n.read ? 'opacity-50' : 'bg-red-50 text-red-700 border-red-200']">
                    <p class="font-medium">{{ n.text }}</p>
                    <p class="text-sm opacity-60 mt-1">{{ n.time }}</p>
                  </div>
                </div>
              </div>
            </div>
            <button @click="toggleTheme" class="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-xl sm:text-2xl">
              {{ isDarkMode ? '☀️' : '🌙' }}
            </button>
                        <div class="ml-1 sm:ml-2">
              <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">{{ homeContent.shopName.toUpperCase() }}</h1>
              <p class="text-red-200 text-sm sm:text-base mt-0.5 hidden sm:inline">{{ homeContent.orderCaption }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- FEEDBACK -->
    <div v-if="feedback.show" class="max-w-7xl mx-auto mb-6 px-1">
  <div :class="['px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-bold shadow-md text-base sm:text-lg',
    feedback.type==='success' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
    feedback.type==='error' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
    'bg-blue-100 text-blue-800 border-2 border-blue-300']">
    {{ feedback.message }}
  </div>
</div>

    <!-- NAVIGATION -->
    <div class="max-w-7xl mx-auto mb-8 flex flex-wrap gap-3 px-1">
      <button @click="currentView='register-customer'" :class="['px-4 sm:px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 text-base sm:text-lg', isDarkMode ? 'bg-cyan-900/40 text-cyan-300 hover:bg-cyan-900/60' : 'bg-cyan-100 hover:bg-cyan-200']">📝 Register Customer</button>
      <button @click="returnToHome" :class="['px-4 sm:px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 text-base sm:text-lg', isDarkMode ? 'bg-amber-900/40 text-amber-300 hover:bg-amber-900/60' : 'bg-amber-100 hover:bg-amber-200']">Dashboard</button>
      <button @click="currentView='add'" :class="['px-4 sm:px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 text-base sm:text-lg', isDarkMode ? 'bg-rose-900/40 text-rose-300 hover:bg-rose-900/60' : 'bg-rose-100 hover:bg-rose-200']">{{ editingItemId ? 'Edit Menu' : 'Add Menu' }}</button>
      <button @click="currentView='list'" :class="['px-4 sm:px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 text-base sm:text-lg', isDarkMode ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-100 hover:bg-blue-200']">Menu List ({{ menuRecords.length }})</button>
      <button @click="currentView='safety'" :class="['px-4 sm:px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 text-base sm:text-lg', isDarkMode ? 'bg-teal-900/40 text-teal-300 hover:bg-teal-900/60' : 'bg-teal-100 hover:bg-teal-200']">Safety</button>
      <button @click="currentView='page'" :class="['px-4 sm:px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 text-base sm:text-lg', isDarkMode ? 'bg-purple-900/40 text-purple-300 hover:bg-purple-900/60' : 'bg-purple-100 hover:bg-purple-200']">Page</button>
    </div>

                  <!-- 🆕 REGISTER CUSTOMER — 2-COLUMN LAYOUT -->
    <div v-if="currentView==='register-customer'" class="max-w-6xl mx-auto mx-2 sm:mx-auto">
      <h3 :class="['text-xl sm:text-2xl font-bold mb-6 text-center', isDarkMode ? 'text-cyan-400' : 'text-cyan-700']">📝 Register Customer & Order</h3>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- ================================= LEFT COLUMN: REGISTER FORM ================================= -->
        <div :class="['rounded-2xl shadow-xl p-6 border-2', isDarkMode ? 'bg-cyan-900/20 border-cyan-800' : 'bg-cyan-50 border-cyan-200']">
          <h4 class="text-lg font-bold mb-5" :class="isDarkMode ? 'text-cyan-400' : 'text-cyan-700'">📝 Register Customer & Order</h4>
          <div class="space-y-4">

            <!-- 1. Name or Nickname -->
            <div>
              <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">👤 Name or Nickname *</label>
              <input v-model="customerForm.name" :class="['w-full p-3 text-base border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-cyan-200']" placeholder="Enter name or nickname" />
            </div>

            <!-- 2. Age -->
            <div>
              <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">🎂 Age *</label>
              <input v-model.number="customerForm.age" type="number" min="1" :class="['w-full p-3 text-base border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-cyan-200']" placeholder="Enter age" />
            </div>

            <!-- 3. Number -->
            <div>
              <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">📞 Number *</label>
              <input v-model="customerForm.phone" :class="['w-full p-3 text-base border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-cyan-200']" placeholder="Enter contact number" />
            </div>

                     <!-- 🆕 ADD ORDER — Button & Menu List -->
            <div>
              <button type="button" @click="showOrderMenu = !showOrderMenu" class="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
                {{ showOrderMenu ? '❌ Hide Menu' : '➕ Add Order from Menu' }}
              </button>

              <!-- 🆕 SEARCH BAR + Menu List with Quantity Buttons -->
              <div v-if="showOrderMenu" class="mt-3 p-4 rounded-xl border-2 space-y-3" :class="isDarkMode ? 'bg-gray-800 border-emerald-700' : 'bg-emerald-50 border-emerald-200'">
                <p class="font-bold" :class="isDarkMode ? 'text-emerald-400' : 'text-emerald-700'">📋 Select Items & Quantity</p>
                
                <!-- 🆕 SEARCH BAR -->
                <input v-model="searchOrderMenu" placeholder="🔍 Search menu items..." 
                  :class="['w-full p-3 text-base border-2 rounded-xl', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-emerald-200']" />

                <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
                  <div v-for="item in filteredMenuForOrder" :key="item.id" 
                    class="flex items-center justify-between p-2 rounded-lg border" 
                    :class="isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-emerald-100'">
                    <div class="flex-1">
                      <p class="font-bold text-sm">{{ item.name }}</p>
                      <p class="text-xs opacity-70">₱{{ item.price }} · {{ item.category }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button type="button" @click="decreaseQty(item.id)" 
                        class="w-8 h-8 rounded-full font-bold bg-red-100 text-red-700 hover:bg-red-200">-</button>
                      <span class="w-8 text-center font-bold">{{ getOrderQty(item.id) }}</span>
                      <button type="button" @click="increaseQty(item.id, item.name)" 
                        class="w-8 h-8 rounded-full font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 🆕 TOTAL BILL + CUSTOMER MONEY + CHANGE -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">💰 Total Bill</label>
                <input v-model="totalBill" type="text" readonly 
                  :class="['w-full p-3 text-base font-bold border-2 rounded-xl bg-gray-100', isDarkMode ? 'bg-gray-700 border-gray-600 text-yellow-400' : 'bg-yellow-50 border-yellow-300 text-yellow-800']" 
                  :value="'₱' + totalBill.toLocaleString()" />
              </div>
              <div>
                <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">💵 Customer Money *</label>
                <input v-model.number="customerMoney" type="number" min="0" step="1" 
                  :class="['w-full p-3 text-base border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-cyan-200']" 
                  placeholder="Amount given" />
              </div>
              <div>
                <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">💱 Change</label>
                <input type="text" readonly 
                  :class="['w-full p-3 text-base font-bold border-2 rounded-xl bg-gray-100', isDarkMode ? 'bg-gray-700 border-gray-600 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-800']" 
                  :value="'₱' + changeAmount" />
              </div>
            </div>

            <!-- 🆕 Order Details (Auto-Generated) -->
            <div>
              <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">🍽️ Order Details *</label>
              <textarea v-model="customerForm.orderDetails" rows="4" 
                :class="['w-full p-3 text-base border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-cyan-200']" 
                placeholder="Order auto-fills here..."></textarea>
            </div>

      

            <!-- 5. Note -->
            <div>
              <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">📝 Note</label>
              <textarea v-model="customerForm.note" rows="2" :class="['w-full p-3 text-base border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-cyan-200']" placeholder="Special instructions..."></textarea>
            </div>

            <!-- 6. Payment -->
            <div>
              <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">💳 Payment *</label>
              <select v-model="customerForm.payment" :class="['w-full p-3 text-base border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-cyan-200']">
                <option value="">— Select Payment Method —</option>
                <option value="Cash">💵 Cash</option>
                <option value="GCash">📱 GCash</option>
                <option value="Bank Transfer">🏦 Bank Transfer</option>
                <option value="E-Wallet">💳 E-Wallet</option>
              </select>
            </div>

            <!-- 7. Service Type -->
            <div>
              <label :class="['font-bold text-base block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">🏪 Service Type *</label>
              <div class="flex gap-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="customerForm.serviceType" value="Takeout" class="w-4 h-4" /> 📦 Takeout / Delivery
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="customerForm.serviceType" value="Dine-in" class="w-4 h-4" /> 🍽️ Dine-in
                </label>
              </div>
            </div>

            <!-- 📦 TAKEOUT ONLY: Driver & Delivery -->
            <div v-if="customerForm.serviceType === 'Takeout'" class="p-3 rounded-xl border-2 space-y-3" :class="isDarkMode ? 'bg-gray-800 border-orange-800' : 'bg-orange-50 border-orange-200'">
              <p class="font-bold" :class="isDarkMode ? 'text-orange-400' : 'text-orange-700'">🚚 Delivery Details</p>
              <div>
                <label class="text-sm font-bold">Driver Name *</label>
                <input v-model="customerForm.driverName" :class="['w-full p-2.5 rounded-lg mt-1 border-2', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-orange-200']" placeholder="Driver name" />
              </div>
              <div>
                <label class="text-sm font-bold">Driver Contact *</label>
                <input v-model="customerForm.driverContact" :class="['w-full p-2.5 rounded-lg mt-1 border-2', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-orange-200']" placeholder="09XX-XXX-XXXX" />
              </div>
              <div>
                <label class="text-sm font-bold">Delivery Address *</label>
                <textarea v-model="customerForm.deliveryAddress" rows="2" :class="['w-full p-2.5 rounded-lg mt-1 border-2', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-orange-200']" placeholder="Complete address..."></textarea>
              </div>
            </div>

            <!-- 🍽️ DINE-IN ONLY: Table Number -->
            <div v-if="customerForm.serviceType === 'Dine-in'">
              <label :class="['font-bold text-base block mb-1', isDarkMode ? 'text-gray-300' : 'text-gray-700']">🪑 Table Number *</label>
              <input v-model="customerForm.tableNumber" :class="['w-full p-3 text-base border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-cyan-200']" placeholder="Table number" />
            </div>

            <!-- BUTTONS -->
            <div class="flex gap-3 pt-3">
              <button type="button" @click="resetCustomerForm" :class="['px-5 py-3 rounded-xl font-bold transition-all', isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300']">🔄 Reset</button>
              <button type="button" @click="saveCustomer" class="flex-1 px-5 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-all cursor-pointer">✅ Register Customer</button>
            </div>
          </div>
        </div>

        <!-- ================================= RIGHT COLUMN: REGISTERED DETAILS ================================= -->
        <div :class="['rounded-2xl shadow-xl p-6 border-2', isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200']">
          <h4 class="text-lg font-bold mb-5" :class="isDarkMode ? 'text-blue-400' : 'text-blue-700'">📋 Registered Details & Orders — {{ customerRecords.length }}</h4>
          
          <div v-if="customerRecords.length===0" class="py-10 text-center rounded-xl" :class="isDarkMode ? 'bg-gray-800/50' : 'bg-white'">
            <p class="text-3xl mb-2">📭</p>
            <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">No customers registered yet.</p>
          </div>

                    <div v-else class="space-y-4 max-h-[650px] overflow-y-auto pr-1">
            <div v-for="cust in customerRecords" :key="cust.id" :class="['p-4 rounded-xl border-2', isDarkMode ? 'bg-gray-800 border-blue-900/30' : 'bg-white border-blue-100']">
              <!-- ✏️ EDIT MODE -->
              <div v-if="editingCustomerId === cust.id" class="space-y-2">
                <input v-model="editCustomerForm.name" :class="['w-full p-2 rounded-lg border', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200']" />
                <div class="flex gap-2">
                  <input v-model.number="editCustomerForm.age" type="number" class="w-20 p-2 rounded-lg border" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200'" placeholder="Age" />
                  <input v-model="editCustomerForm.phone" class="flex-1 p-2 rounded-lg border" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200'" placeholder="Phone" />
                </div>
                <textarea v-model="editCustomerForm.orderDetails" rows="3" :class="['w-full p-2 rounded-lg border', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200']"></textarea>
                <textarea v-model="editCustomerForm.note" rows="2" :class="['w-full p-2 rounded-lg border', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200']" placeholder="Note"></textarea>
                <input v-model="editCustomerForm.payment" class="w-full p-2 rounded-lg border" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200'" />

                <!-- 💰 Bill & Money Editable -->
                <div class="flex gap-2">
                  <input v-model="editCustomerForm.totalBill" class="flex-1 p-2 rounded-lg border" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-yellow-200'" placeholder="Total Bill" />
                  <input v-model="editCustomerForm.customerMoney" class="flex-1 p-2 rounded-lg border" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-yellow-200'" placeholder="Money Given" />
                  <input v-model="editCustomerForm.change" class="flex-1 p-2 rounded-lg border" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-emerald-200'" placeholder="Change" />
                </div>

                <!-- Service Type & Extra Fields -->
                <div class="flex gap-2">
                  <select v-model="editCustomerForm.serviceType" class="p-2 rounded-lg border" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200'">
                    <option value="Dine-in">🍽️ Dine-in</option>
                    <option value="Takeout">📦 Takeout</option>
                  </select>
                  <input v-model="editCustomerForm.tableNumber" class="flex-1 p-2 rounded-lg border" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200'" placeholder="Table #" />
                </div>
                <input v-model="editCustomerForm.driverName" class="w-full p-2 rounded-lg border mt-1" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200'" placeholder="Driver Name" />
                <input v-model="editCustomerForm.driverContact" class="w-full p-2 rounded-lg border mt-1" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200'" placeholder="Driver Contact" />
                <textarea v-model="editCustomerForm.deliveryAddress" rows="2" class="w-full p-2 rounded-lg border mt-1" :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-200'" placeholder="Address"></textarea>

                <!-- Buttons -->
                <div class="flex gap-2 mt-2">
                  <button @click="saveEditCustomer(cust.id)" class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold">✅ Save</button>
                  <button @click="cancelEditCustomer" class="px-4 py-2 bg-gray-500 text-white rounded-lg font-bold">❌ Cancel</button>
                </div>
              </div>

              <!-- 👁️ VIEW MODE (Normal Display) -->
              <div v-else>
                              <div class="flex gap-1">
                  <button @click="startEditCustomer(cust)" class="px-2 py-1 text-xs bg-blue-500 text-white rounded font-bold hover:bg-blue-600">✏️ Edit</button>
                  <!-- ✅ NEW DONE BUTTON -->
                  <button @click="markOrderAsDone(cust)" class="px-2 py-1 text-xs bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700">✅ Done</button>
                  <span class="text-sm px-2 py-0.5 rounded-full font-bold" :class="cust.serviceType==='Dine-in' ? 'bg-cyan-100 text-cyan-700' : 'bg-orange-100 text-orange-700'">
                    {{ cust.serviceType==='Dine-in' ? '🍽️ Dine-in' : '📦 Takeout' }}
                  </span>
                </div>
                <div class="flex justify-between items-start mb-2">
                  <p class="font-bold text-lg">{{ cust.name }}</p>
                  <div class="flex gap-1">
                    <button @click="startEditCustomer(cust)" class="px-2 py-1 text-xs bg-blue-500 text-white rounded font-bold hover:bg-blue-600">✏️ Edit</button>
                    <span class="text-sm px-2 py-0.5 rounded-full font-bold" :class="cust.serviceType==='Dine-in' ? 'bg-cyan-100 text-cyan-700' : 'bg-orange-100 text-orange-700'">
                      {{ cust.serviceType==='Dine-in' ? '🍽️ Dine-in' : '📦 Takeout' }}
                    </span>
                  </div>
                </div>
                <p class="text-sm">🎂 {{ cust.age }} years old | 📞 {{ cust.phone }}</p>
                <p class="text-sm mt-2 font-bold">🍽️ Order:</p>
                <p class="text-sm whitespace-pre-wrap">{{ cust.orderDetails }}</p>
                <p v-if="cust.note" class="text-sm italic mt-1">📝 {{ cust.note }}</p>
                <p class="text-sm mt-2">💳 Payment: <b>{{ cust.payment }}</b></p>
                <p class="text-sm mt-2">💰 Total Bill: <b>₱{{ cust.totalBill?.toLocaleString() || '0' }}</b></p>
                <p class="text-sm">💵 Given: <b>₱{{ cust.customerMoney?.toLocaleString() || '0' }}</b></p>
                <p class="text-sm text-emerald-600 font-bold">💱 Change: ₱{{ cust.change || '0.00' }}</p>

                <!-- Dine-in Table -->
                <p v-if="cust.serviceType==='Dine-in'" class="text-sm mt-1">🪑 Table: <b>{{ cust.tableNumber }}</b></p>

                <!-- Takeout Delivery Info -->
                <div v-if="cust.serviceType==='Takeout'" class="mt-2 p-2 rounded-lg text-sm" :class="isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'">
                  <p class="font-bold mb-1">🚚 Delivery Info</p>
                  <p>Driver: <b>{{ cust.driverName }}</b></p>
                  <p>Contact: {{ cust.driverContact }}</p>
                  <p>Address: {{ cust.deliveryAddress }}</p>
                </div>

                <p class="text-xs mt-2 opacity-60">{{ cust.registeredAt }}</p>
              </div>
            </div>
          </div>
           </div>
           </div>
           </div>

       <!-- ✅ SERVED / DONE ORDERS SECTION — ONLY ON REGISTER CUSTOMER PAGE -->
    <div v-if="currentView==='register-customer'" class="mt-8 rounded-2xl shadow-xl p-6 border-2" :class="isDarkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'">
      <h4 class="text-lg font-bold mb-4" :class="isDarkMode ? 'text-emerald-400' : 'text-emerald-700'">✅ Served / Done Orders — {{ servedOrders.length }}</h4>
      
      <!-- 🔍 SEARCH BY NAME -->
      <input v-model="searchServedName" placeholder="🔍 Search customer name..." 
        :class="['w-full p-3 text-base border-2 rounded-xl mb-4', isDarkMode ? 'bg-gray-800 border-emerald-700 text-white' : 'bg-white border-emerald-200']" />

      <div v-if="servedOrders.length===0" class="py-8 text-center rounded-xl" :class="isDarkMode ? 'bg-gray-800/50' : 'bg-white'">
        <p class="text-3xl mb-2">📭</p>
        <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">No orders marked as done yet.</p>
      </div>

      <div v-else class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        <div v-for="cust in filteredServedOrders" :key="cust.id" 
          class="p-3 rounded-xl border-2" 
          :class="isDarkMode ? 'bg-gray-800 border-emerald-700' : 'bg-white border-emerald-200'">
          <div class="flex justify-between items-start">
            <p class="font-bold">{{ cust.name }}</p>
            <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">✅ SERVED</span>
          </div>
          <p class="text-sm mt-1">🍽️ {{ cust.orderDetails }}</p>
          <p class="text-sm">💰 Bill: ₱{{ cust.totalBill?.toLocaleString() || '0' }} | 💱 Change: ₱{{ cust.change || '0.00' }}</p>
          <p class="text-xs mt-2 opacity-60">🕐 Served: {{ cust.servedAt }}</p>
        </div>
      </div>
    </div>

       <!-- DASHBOARD -->
    <div v-if="currentView==='homepage'" class="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-1">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        <!-- 💰 TOTAL EARNINGS — SUMS ALL ORDERS EVEN WHEN MARKED DONE -->
        <div :class="['rounded-2xl shadow-xl p-6 sm:p-8 border-t-4 text-center', isDarkMode ? 'bg-emerald-900/30 border-emerald-600' : 'bg-emerald-50 border-emerald-500']">
          <h3 :class="['text-lg sm:text-xl font-bold mb-3', isDarkMode ? 'text-emerald-400' : 'text-emerald-700']">💰 Total Earnings</h3>
          <p :class="['text-3xl sm:text-4xl font-extrabold', isDarkMode ? 'text-emerald-300' : 'text-emerald-800']">₱{{ totalEarnings.toLocaleString() }}</p>
        </div>

        <!-- 📦 MENU ITEMS COUNT -->
        <div :class="['rounded-2xl shadow-xl p-6 sm:p-8 border-t-4 text-center', isDarkMode ? 'bg-orange-900/30 border-orange-600' : 'bg-orange-50 border-orange-500']">
          <h3 :class="['text-lg sm:text-xl font-bold mb-3', isDarkMode ? 'text-orange-400' : 'text-orange-700']">📦 Menu Items</h3>
          <p :class="['text-3xl sm:text-4xl font-extrabold', isDarkMode ? 'text-orange-300' : 'text-orange-800']">{{ menuRecords.length }}</p>
        </div>

        <!-- 👥 CUSTOMERS REGISTERED COUNT -->
        <div :class="['rounded-2xl shadow-xl p-6 sm:p-8 border-t-4 text-center', isDarkMode ? 'bg-rose-900/30 border-rose-600' : 'bg-rose-50 border-rose-500']">
          <h3 :class="['text-lg sm:text-xl font-bold mb-3', isDarkMode ? 'text-rose-400' : 'text-rose-700']">👥 Pending Customers to Served</h3>
          <p :class="['text-3xl sm:text-4xl font-extrabold', isDarkMode ? 'text-rose-300' : 'text-rose-800']">{{ activeCustomersCount }}</p>
        </div>
      </div>

      <!-- 📊 MENU CATEGORY GRID -->
      <div :class="['rounded-2xl shadow-xl p-6 sm:p-8 border-2', isDarkMode ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200']">
        <h3 :class="['text-xl sm:text-2xl font-bold mb-6', isDarkMode ? 'text-amber-400' : 'text-amber-700']">📊 Menu Count by Category — Click to view items</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5">
          <div v-for="cat in categories" :key="cat.name" @click="selectCategory(cat.name)"
            :class="['p-4 sm:p-5 rounded-xl text-center shadow-sm transition-all cursor-pointer hover:scale-105', isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-amber-50', selectedCategory === cat.name ? 'ring-2 ring-red-500' : '']">
            <div class="text-3xl sm:text-4xl mb-2">{{ cat.icon }}</div>
            <div :class="['font-bold text-base sm:text-lg', isDarkMode ? 'text-gray-300' : 'text-gray-800']">{{ cat.name }}</div>
            <div class="text-2xl sm:text-3xl font-extrabold text-red-500 mt-1">{{ menuCountByCategory[cat.name] }}</div>
          </div>
        </div>
      </div>
    </div>

      <!-- ADD MENU FORM — ENLARGED & RESPONSIVE -->
    <div v-if="currentView==='add'" :class="['max-w-4xl w-full mx-auto rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border-2 mx-2 sm:mx-auto', isDarkMode ? 'bg-rose-900/20 border-rose-800' : 'bg-pink-50 border-pink-200']">
      <h3 :class="['text-xl sm:text-2xl md:text-3xl font-bold mb-8 text-center', isDarkMode ? 'text-rose-400' : 'text-rose-700']">{{ editingItemId ? '✏️ Edit Menu Item' : '➕ Add New Menu Item' }}</h3>
       <div class="space-y-5">
        <div>
          <label :class="['font-bold text-base sm:text-lg block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Item Name *</label>
          <input v-model="formName" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-pink-200']" placeholder="e.g. Ultimate Beef Burger" />
        </div>
        <div>
          <label :class="['font-bold text-base sm:text-lg block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Category *</label>
          <select v-model="formCategory" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-pink-200']">
            <option value="">— Select Category —</option>
            <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.icon }} {{ cat.name }}</option>
          </select>
        </div>
        <div>
          <label :class="['font-bold text-base sm:text-lg block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Price (₱) *</label>
          <input v-model="formPrice" type="number" step="0.01" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-pink-200']" placeholder="e.g. 85" />
        </div>
        <div>
          <label :class="['font-bold text-base sm:text-lg block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Description</label>
          <textarea v-model="formDesc" rows="4" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-pink-200']" placeholder="Brief description..."></textarea>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 mt-6">
          <button v-if="editingItemId" @click="cancelEdit" :class="['px-6 py-3.5 rounded-xl font-bold text-lg order-2 sm:order-1', isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300']">❌ Cancel</button>
          <button @click="saveMenuItem" class="flex-1 px-6 py-3.5 bg-rose-600 text-white rounded-xl font-bold text-lg hover:bg-rose-700 transition-all order-1 sm:order-2">
            {{ editingItemId ? '💾 Update Item' : '➕ Add Item' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MENU LIST -->
    <div v-if="currentView==='list'" :class="['max-w-5xl mx-auto rounded-2xl shadow-xl p-6 sm:p-8 border-2 mx-2 sm:mx-auto', isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200']">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h3 :class="['text-xl sm:text-2xl font-bold', isDarkMode ? 'text-blue-400' : 'text-blue-700']">📋 {{ selectedCategory ? `${selectedCategory} — ` : 'All Menu Items — ' }}{{ filteredByCategory.length }} record(s)</h3>
        <div class="flex gap-3 w-full sm:w-auto">
          <button v-if="selectedCategory" @click="selectedCategory=null" class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 whitespace-nowrap">Show All</button>
          <button @click="currentView='add'" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 whitespace-nowrap">+ Add New</button>
        </div>
      </div>
      <input v-model="searchTerm" placeholder="🔍 Search items by name or category..." :class="['w-full p-4 text-lg border-2 rounded-xl mb-6', isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-blue-200']" />
      <div v-if="filteredByCategory.length===0" class="text-center py-12 rounded-xl" :class="isDarkMode ? 'bg-gray-800/50' : 'bg-white'">
        <p class="text-3xl mb-3">📭</p>
        <p :class="isDarkMode ? 'text-gray-400 text-lg' : 'text-gray-500 text-lg'">No menu items found.</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="item in filteredByCategory" :key="item.id" :class="['p-5 rounded-xl border-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4', isDarkMode ? 'bg-gray-800 border-blue-900/30' : 'bg-white border-blue-100']">
          <div class="flex-1">
            <h4 :class="['font-bold text-xl', isDarkMode ? 'text-blue-400' : 'text-blue-800']">{{ item.name }}</h4>
            <p class="text-base mt-1" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ item.category }}</p>
            <p class="font-bold text-red-500 text-2xl mt-1">₱{{ item.price }}</p>
            <p v-if="item.description" class="text-base mt-2" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">{{ item.description }}</p>
          </div>
          <div class="flex gap-3 w-full sm:w-auto">
            <button @click="startEditItem(item)" class="flex-1 sm:flex-none px-4 py-2.5 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200">✏️ Edit</button>
            <button @click="deleteItem(item.id)" class="flex-1 sm:flex-none px-4 py-2.5 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200">🗑️ Delete</button>
          </div>
        </div>
      </div>
    </div>

       <!-- SAFETY ARTICLES — ENLARGED & RESPONSIVE -->
    <div v-if="currentView==='safety'" :class="['max-w-4xl w-full mx-auto rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border-2 mx-2 sm:mx-auto', isDarkMode ? 'bg-teal-900/20 border-teal-800' : 'bg-teal-50 border-teal-200']">
      <h3 :class="['text-xl sm:text-2xl md:text-3xl font-bold mb-8', isDarkMode ? 'text-teal-400' : 'text-teal-700']">📰 Food Safety Articles</h3>
      <div :class="['rounded-xl p-6 sm:p-8 mb-6 border-2', isDarkMode ? 'bg-gray-800 border-teal-900/30' : 'bg-white border-teal-100']">
       <h4 :class="['font-bold text-xl mb-5', isDarkMode ? 'text-teal-400' : 'text-teal-800']">➕ Post New Article</h4>
        <div class="space-y-4">
          <div>
            <label :class="['font-bold text-base block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Article Title *</label>
            <input v-model="articleTitle" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300']" placeholder="e.g. Food Safety Guidelines" />
          </div>
          <div>
            <label :class="['font-bold text-base block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Content *</label>
            <textarea v-model="articleContent" rows="6" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300']" placeholder="Write your article here..."></textarea>
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <button v-if="editingArticleId" @click="cancelArticleEdit" :class="['px-5 py-3 rounded-xl font-bold text-lg order-2 sm:order-1', isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300']">Cancel</button>
            <button @click="saveArticle" class="flex-1 px-5 py-3 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 order-1 sm:order-2">Post Article</button>
          </div>
        </div>
      </div>
      <div v-if="safetyArticles.length===0" class="text-center py-10 text-lg" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">No articles posted yet.</div>
      <div v-else class="space-y-4">
        <div v-for="art in safetyArticles" :key="art.id" :class="['rounded-xl p-5 border-2', isDarkMode ? 'bg-gray-800 border-teal-900/30' : 'bg-white border-teal-100']">
          <div class="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
            <h4 :class="['font-bold text-xl', isDarkMode ? 'text-teal-400' : 'text-teal-800']">{{ art.title }}</h4>
            <div class="flex gap-2">
              <button @click="startEditArticle(art)" class="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-bold hover:bg-amber-200">Edit</button>
              <button @click="deleteArticle(art.id)" class="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200">Delete</button>
            </div>
          </div>
          <p class="text-sm mb-3" :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'">Posted: {{ art.date }}</p>
          <p class="whitespace-pre-wrap text-base" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ art.content }}</p>
        </div>
      </div>
    </div>

                       <!-- PAGE EDITOR — ENLARGED & RESPONSIVE -->
    <div v-if="currentView==='page'" :class="['max-w-4xl w-full mx-auto rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border-2 mx-2 sm:mx-auto', isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200']">
      <h3 :class="['text-xl sm:text-2xl md:text-3xl font-bold mb-8', isDarkMode ? 'text-gray-200' : 'text-gray-700']">✏️ Edit Homepage Content</h3>
      <div class="space-y-6">

        <div>
          <label :class="['font-bold text-base block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Shop Name:</label>
          <input v-model="homeContent.shopName" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300']" />
        </div>

        <div>
          <label :class="['font-bold text-base block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Welcome Text:</label>
          <input v-model="homeContent.welcomeText" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300']" />
        </div>

        <div>
          <label :class="['font-bold text-base block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Order Caption:</label>
          <input v-model="homeContent.orderCaption" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300']" />
        </div>

        <div>
          <label :class="['font-bold text-base block mb-2', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Manager / CEO Name:</label>
          <input v-model="homeContent.ceoName" :class="['w-full p-4 text-lg border-2 rounded-xl mt-1', isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300']" />
        </div>

               <div class="mt-6 pt-4 border-t-2" :class="isDarkMode ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex flex-col sm:flex-row gap-4">
<button @click="saveHomepageContent" class="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all">💾 Save Changes</button>          
  <button @click="returnToHome" class="px-6 py-3 bg-gray-600 text-white rounded-xl font-bold text-lg hover:bg-gray-700 transition-all">← Back to Dashboard</button>
          </div>
        </div>
      </div>
    </div>

  </div>  <!-- ✅ ADDED: Closes the main wrapper div -->
</template>

<style>
* {
  box-sizing: border-box;
}
input, select, textarea, button {
  font-family: inherit;
}
</style>