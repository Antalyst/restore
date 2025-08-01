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
                </div>
            </div>
        </div>


       <div v-if="successMessage" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {{ successMessage }}
        </div>

        
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ errorMessage }}
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

// Check authentication status on page load
onMounted(async () => {
    try {
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

