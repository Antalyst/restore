<template>
    <div class="bg-stone-100 w-full mr-2 my-2 rounded-md p-2">
        <h1 class="text-2xl font-bold text-[#00796b]">Product</h1>
        <div class="gap-2">
            <div class="text-2xl font-bold text-[#00796b]" @click="toggle = !toggle"><h1 class="flex w-full justify-end px-4">Add Item</h1></div>
            <form @submit.prevent="submit" :class="{'hidden': !toggle}" class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div class="shadow-md p-2 rounded-md">
                    <div class="grid grid-cols-1">
                        <label class="text-lg font-semibold text-[#00796b]" for="productName">Product Name</label>
                        <input v-model="productName" type="text" name="productName" class="outline-[#00796b] p-2">
                    </div>

                    <div class="grid grid-cols-1">
                        <label for="Category" class="font-semibold text-lg text-[#00796b]">Category</label>
                        <select v-model="category" name="Category" class="outline-[#00796b] p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00796b] focus:border-[#00796b]">
                            <option value="" disabled>Select a category</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>

                </div>
                <div class="shadow-md p-2 rounded-md">
                    <div class="grid grid-cols-1">
                        <label class="text-lg font-semibold text-[#00796b]" for="unitOfMeasurement">Unit Of Measurement</label>
                        <select v-model="unitId" name="unitOfMeasurement" class="outline-[#00796b] p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00796b] focus:border-[#00796b]">
                            <option value="" disabled>Select a Unit</option>
                            <option v-for="cat in allUnits" :key="cat.id" :value="cat.id">
                                {{ cat.name }}
                            </option>
                        </select>
                    </div>

                   
                </div>
                <div class="shadow-md p-2 rounded-md">
                    <div class="grid grid-cols-1">
                        <label class="text-lg font-semibold text-[#00796b]" for="minimumStockLevel">Minimum Stock Level</label>
                        <input v-model="minStockLevel" type="number" name="minimumStockLevel" class="outline-[#00796b] p-2">
                    </div>

                    <div class="grid grid-cols-1">
                        <label class="text-lg font-semibold text-[#00796b]" for="maximumStockLevel">Maximum Stock Level</label>
                        <input v-model="maxStockLevel" type="number" name="maximumStockLevel" class="outline-[#00796b] p-2">
                    </div>
                </div>
                <div class="shadow-md p-2 rounded-md">
                    <div class="grid grid-cols-1">
                        <label class="text-lg font-semibold text-[#00796b]" for="Imagepath">Select Image</label>
                        <input @change="fileChange" accept="image/*" type="file" name="image" class="outline-[#00796b] p-2">
                    </div>
                    <div class="flex justify-center items-center gap-4 mt-4">
                        <button type="submit" class="px-8 py-2 border-2 border-[#00796b] rounded-md text-[#00796b] text-lg font-bold">
                            {{ isEditing ? 'Update Product' : 'Add Item' }}
                        </button>
                        <button @click="cancelForm" type="button" class="px-8 py-2 border-2 border-gray-400 rounded-md text-gray-600 text-lg font-bold">
                            {{ isEditing ? 'Cancel Edit' : 'Cancel Add' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <main class="pt-4">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="px-6 py-4 bg-[#00796b] text-white">
                    <h2 class="text-xl font-bold">Product Inventory</h2>
                </div>
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                        <div class="grid grid-cols-1">
                            <label for="Category" class="font-semibold text-lg text-[#00796b]">Category</label>
                            <select v-model="selectedFilter" name="Category" class="outline-[#00796b] p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00796b] focus:border-[#00796b]">
                                <option value="" disabled>Select a category</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                                    {{ cat.name }}
                                </option>
                            </select>
                        </div>
                        <div class="text-sm text-gray-600">
                            Showing {{ filteredItems.length }} of {{ items.length }} products
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[900px]">
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
                                    <button @click="editItem(item)" class="text-[#00796b] hover:text-[#005a4f] mr-3 transition-colors duration-200">
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
                <div v-if="items.length === 0" class="text-center py-8">
                    <div class="text-gray-500 text-lg">No products found</div>
                    <div class="text-gray-400 text-sm mt-2">Add your first product to get started</div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
    const productName = ref("");
    const category = ref("");
    const unitId = ref(0);
    const minStockLevel = ref(0);
    const maxStockLevel = ref(0);
    const currentStock = ref(0);
    const image = ref(null);
    const items = ref([]);
    const filteredItems = ref([]);
    const selectedFilter = ref("");
    const toggle = ref(false);
    const isEditing = ref(false);
    const editingId = ref(null);
    const categories = ref([]);
    const allUnits = ref([])



    watch(selectedFilter, () => {
        filterItems();
    });

    watch(unitId,(nev)=>{
        console.log(nev);
    })

    const filterItems = () => {
        if (!selectedFilter.value) {
            filteredItems.value = items.value;
        } else {
            filteredItems.value = items.value.filter(item => item.category === selectedFilter.value);
        }
    };

    onMounted(async () => {
        const response = await fetch("http://localhost:5000/api/items/get", {
            method: "GET",
        });
        const result = await response.json();
        items.value = result.result;
        filteredItems.value = items.value;
        console.log(items.value);

        categories.value = await $fetch(`http://localhost:5000/api/category/get`);
        allUnits.value = await $fetch(`http://localhost:5000/api/units/get`);
        console.log(allUnits.value);
        console.log(categories.value);
    });

    function fileChange(e){
        image.value = e.target.files[0];
    }

    const editItem = (item) => {
        isEditing.value = true;
        editingId.value = item.id;
        productName.value = item.name;
        category.value = item.category_id;
        unitId.value = item.unit_of_measurement;
        currentStock.value = item.current_stock;
        minStockLevel.value = item.min_stock_level;
        maxStockLevel.value = item.max_stock_level;
        image.value = null;
        toggle.value = true;
    };

    const submit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", productName.value);
            formData.append("category_id", category.value);
            formData.append("current_stock", currentStock.value);
            formData.append("unit_id", unitId.value);
            formData.append("min_stock_level", minStockLevel.value);
            formData.append("max_stock_level", maxStockLevel.value);
            if (image.value) {
                formData.append("image", image.value);
            }

            const url = isEditing.value 
                ? `http://localhost:5000/api/items/update/${editingId.value}`
                : "http://localhost:5000/api/items/add";
            const method = isEditing.value ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                body: formData,
                credentials: "include",
            });

            const result = await response.json();
            console.log("Server Response:", result);
            
            if (result.success) {
                const refreshResponse = await fetch("http://localhost:5000/api/items/get", {
                    method: "GET",
                });
                const refreshResult = await refreshResponse.json();
                items.value = refreshResult.result;
                filterItems();
            }
            
            reset();
        } catch (e) {
            console.error("Submit error:", e);
        }
    };
    
    function reset(){
        productName.value = "";
        category.value = "";
        unitId.value = "";
        currentStock.value = 0;
        minStockLevel.value = 0;
        maxStockLevel.value = 0;
        image.value = null;
        isEditing.value = false;
        editingId.value = null;
    }

    const cancelForm = () => {
        reset();
        toggle.value = false;
    };

    definePageMeta({
        layout: 'admin',
    });
</script>

<style lang="scss" scoped>

</style>