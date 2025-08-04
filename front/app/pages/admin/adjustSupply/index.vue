<template>
    <div class="bg-stone-100 w-full my-2 rounded-md p-6">
        
        <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-800">Adjust Supply</h2>
                <div v-if="currentUser" class="text-sm text-green-600">
                    ✓ Logged in as: {{ currentUser.username }}
                </div>
                <div v-else class="text-sm text-red-600">
                    ⚠ Not authenticated
                </div>
            </div>
            <div class="relative">
            <div class="flex gap-4 mb-4">
       
                <select v-model="filters.category_name" class="p-2 border border-gray-300 rounded w-64">
                    <option value="">All Categories</option>
                    <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>

                <select v-model="filters.name" class="p-2 border border-gray-300 rounded w-64">
                    <option value="">All Items</option>
                    <option v-for="itemName in uniqueItemNames" :key="itemName" :value="itemName">{{ itemName }}</option>
                </select>
                </div>

                <input 
                    v-model="searchQuery" 
                    @input="searchSupplies"
                    type="text" 
                    placeholder="Search for supplies..." 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div v-if="searchResults.length > 0 && searchQuery" class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div 
                        v-for="item in searchResults" 
                        :key="item.id"
                        @click="selectSupply(item)"
                        class="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 flex items-center gap-3"
                    >
                        <img v-if="item.image_path" :src="item.image_path" :alt="item.name" class="w-10 h-10 object-cover rounded">
                        <div v-else class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <icon name="mdi:image" class="text-gray-400" />
                        </div>
                        <div>
                            <div class="font-medium">{{ item.name }}</div>
                            <div class="text-sm text-gray-600">{{ item.category }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="selectedSupply" class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-xl font-semibold mb-4">Adjust Stock for: {{ selectedSupply.name }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div class="flex items-center gap-4">
                        <img v-if="selectedSupply.image_path" :src="selectedSupply.image_path" :alt="selectedSupply.name" class="w-20 h-20 object-cover rounded">
                        <div v-else class="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                            <icon name="mdi:image" class="text-gray-400 text-2xl" />
                        </div>
                        <div>
                            <h4 class="font-semibold text-lg">{{ selectedSupply.name }}</h4>
                            <p class="text-gray-600">{{ selectedSupply.category }}</p>
                            <p class="text-sm text-gray-500">Unit: {{ selectedSupply.unit_of_measurement }}</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4">
                         <div>
                             <label class="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                             <input 
                                 :value="selectedSupply.current_stock || 0" 
                                 type="number" 
                                 disabled
                                 class="w-full p-2 border border-gray-300 rounded bg-gray-50"
                             />
                         </div>
                         <div>
                             <label class="block text-sm font-medium text-gray-700 mb-1">Min Stock Level</label>
                             <input 
                                 :value="selectedSupply.min_stock_level || 0" 
                                 type="number" 
                                 disabled
                                 class="w-full p-2 border border-gray-300 rounded bg-gray-50"
                             />
                         </div>
                         <div>
                             <label class="block text-sm font-medium text-gray-700 mb-1">Max Stock Level</label>
                             <input 
                                 :value="selectedSupply.max_stock_level" 
                                 type="number" 
                                 disabled
                                 class="w-full p-2 border border-gray-300 rounded bg-gray-50"
                             />
                         </div>
                     </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Adjustment Type</label>
                        <select 
                            v-model="adjustmentForm.type" 
                            class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="add">Add Stock</option>
                            <option value="subtract">Subtract Stock</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Quantity to {{ adjustmentForm.type === 'add' ? 'Add' : 'Subtract' }}</label>
                        <input 
                            v-model="adjustmentForm.quantity" 
                            type="number" 
                            min="0"
                            class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Reason/Notes</label>
                        <textarea 

                            v-model="adjustmentForm.remarks" 
                            rows="3"
                            placeholder="Enter reason for adjustment..."
                            class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Add Attachment</label>
                        <input @change="fileChange" accept="image/*" type="file" name="attachment" class="outline-[#00796b] p-2">
                        <div v-if="image" class="mt-2 text-sm text-green-600">
                            ✓ File selected: {{ image.name }}
                        </div>
                    </div>
                    
                    <button 
                        @click="submitAdjustment"
                        :disabled="!adjustmentForm.quantity || !adjustmentForm.remarks"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Submit Adjustment
                    </button>
                    <button 
                        @click="cancelAdjustment"
                        type="button"
                        class="w-full mt-2 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                        >
                        Cancel
                    </button>

                </div>
            </div>
        </div>


       <div v-if="successMessage" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {{ successMessage }}
        </div>

        
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ errorMessage }}
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#00796b] uppercase tracking-wider">Image</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#00796b] uppercase tracking-wider">Product Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#00796b] uppercase tracking-wider">Category</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#00796b] uppercase tracking-wider">Unit of Measurement</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#00796b] uppercase tracking-wider">Current Stock</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#00796b] uppercase tracking-wider">Min Stock</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#00796b] uppercase tracking-wider">Max Stock</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#00796b] uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50 transition-colors duration-200">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <img v-if="item.image_path" :src="item.image_path" :alt="item.name" class="h-12 w-12 rounded-lg object-cover border border-gray-200">
                                <div v-else class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span class="text-gray-500 text-xs">No Image</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ item.category_name }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ item.unit_name }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ item.current_stock }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                    :class="item.min_stock_level <= 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                                {{ item.min_stock_level }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {{ item.max_stock_level }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button @click="() => editSupply(item)" class="text-[#00796b] hover:text-[#005a4f] mr-3 transition-colors duration-200">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button class="text-red-600 hover:text-red-800 transition-colors duration-200">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: "admin" 
})

const searchQuery = ref('')
const searchResults = ref([])
const selectedSupply = ref(null)
const successMessage = ref('')
const errorMessage = ref('')
const image = ref(null);
const currentUser = ref(null);
const items = ref([])
const filters = reactive({
  category_name: '',
  name: ''
})



function openEditModal(item) {
  editItem.value = { ...item }; 
  showEditModal.value = true;
}

const cancelAdjustment = () => {
  selectedSupply.value = null
  
  adjustmentForm.value = {
    type: 'add',
    quantity: '',
    remarks: '',
    date: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
  }
  
  image.value = null
  
  successMessage.value = ''
  errorMessage.value = ''
}

const uniqueItemNames = computed(() => {
  const set = new Set()
  items.value.forEach(item => {
    if (item.name) set.add(item.name)
  })
  return Array.from(set)
})


const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesCategory = filters.category_name ? item.category_name === filters.category_name : true
    const matchesName = filters.name ? item.name.toLowerCase().includes(filters.name.toLowerCase()) : true
    return matchesCategory && matchesName
  })
})

const uniqueCategories = computed(() => {
  const set = new Set()
  items.value.forEach(item => {
    if (item.category_name) set.add(item.category_name)
  })
  return Array.from(set)
})


const editSupply = (item) => {
  selectedSupply.value = item

  const now = new Date()
  adjustmentForm.value.date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`

  adjustmentForm.value.type = 'add'
  adjustmentForm.value.quantity = ''
  adjustmentForm.value.remarks = ''
  image.value = null
}

onMounted(async () => {
    try {
        const response = await fetch("http://localhost:5000/api/items/get", {
            method: "GET",
            credentials:'include'
        });
        const result = await response.json();
        items.value = result.result;

        const user = await $fetch('http://localhost:5000/api/auth/profile', {
            credentials: 'include'
        });
        currentUser.value = user;
        console.log('Current user:', user);
    } catch (error) {
        console.error('Auth check failed:', error);
        errorMessage.value = 'Authentication failed. Please log in again.';
    }
});

function fileChange(e){
    image.value = e.target.files[0]
    console.log(image.value);
}

const adjustmentForm = ref({
    type: 'add',
    quantity: '',
    remarks: '',
    date: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
})


const searchSupplies = async () => {
    if (searchQuery.value.length < 2) {
        searchResults.value = []
        return
    }
    
    try {
        const response = await $fetch('http://localhost:5000/api/items/search', {
            method: 'POST',
            body: { query: searchQuery.value },
            credentials: 'include'
        })
        
        if (response.success) {
            searchResults.value = response.result
        }
    } catch (error) {
        console.error('Search error:', error)
        errorMessage.value = 'Failed to search supplies'
    }
}

const selectSupply = (supply) => {
    selectedSupply.value = supply
    searchQuery.value = supply.name
    searchResults.value = []
}

const submitAdjustment = async () => {
    try {
        const formData = new FormData()
        formData.append('type', adjustmentForm.value.type)
        formData.append('quantity', adjustmentForm.value.quantity)
        formData.append('remarks', adjustmentForm.value.remarks)
        formData.append('date', adjustmentForm.value.date)
        
        if (image.value) {
            formData.append('attachment', image.value)
        }
        
        const response = await $fetch(`http://localhost:5000/api/items/adjust/${selectedSupply.value.id}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include'
        })
        
        if (response.success) {
            const { newCurrentStock, oldStock, type, quantity } = response.result
            const changeText = type === 'add' ? `Added ${quantity}` : `Subtracted ${quantity}`
            successMessage.value = `Stock adjusted successfully! ${changeText}. Stock changed from ${oldStock} to ${newCurrentStock}`
            errorMessage.value = ''
            
            selectedSupply.value.current_stock = newCurrentStock
            selectedSupply.value.min_stock_level = response.result.newMinStockLevel
            
            adjustmentForm.value = {
                type: 'add',
                quantity: '',
                remarks: ''
            }
            image.value = null
            
            setTimeout(() => {
                successMessage.value = ''
            }, 5000)
        }
    } catch (error) {
        console.error('Adjustment error:', error)
        if (error.status === 401) {
            errorMessage.value = 'Authentication failed. Please log in again.'
        } else {
            errorMessage.value = 'Failed to adjust supply'
        }
        successMessage.value = ''
    }
}

watch(searchQuery, () => {
    successMessage.value = ''
    errorMessage.value = ''
})
</script>

