<template>
    <div>
        <div class="flex justify-between items-center p-4 bg-gray-100">
            <h1 class="text-xl font-bold">Settings</h1>
            <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
        <div class="p-4">
            <h2 class="text-lg font-semibold mb-4">Add Unit</h2>
            <input v-model="unitName" type="text" placeholder="Unit Name" class="border p-2 rounded w-full mb-2" />
            <button @click="addUnit" class="bg-blue-500 text-white px-4 py-2 rounded">Add Unit</button>
        </div>

        <div class="p-4">
            <h2 class="text-lg font-semibold mb-4">Add Category</h2>
            <input v-model="categoryName" type="text" placeholder="Category Name" class="border p-2 rounded w-full mb-2" />
            <input v-model="categoryCode" type="text" placeholder="Category Code" class="border p-2 rounded w-full mb-2" />
            <button @click="addCategory" class="bg-blue-500 text-white px-4 py-2 rounded">Add Category</button>
        </div>
    </div>
</template>

<script setup>
const allUnits = ref([])
const unitName = ref('');
const toggleUnit = ref(false);
const categoryName = ref('');
const categoryCode = ref('');

const addCategory = async () => {
  try {
    const response = await $fetch('http://localhost:5000/api/category/add', {
      method: 'POST',
      body: { name: categoryName.value, code: categoryCode.value },
      credentials: 'include',
    });
    console.log('Category added:', response);
    categoryName.value = '';
    categoryCode.value = '';
  } catch (error) {
    console.error('Error adding category:', error);
  }
};


const addUnit = async () => {
  try {
    const response = await $fetch('http://localhost:5000/api/catefory/add', {
      method: 'POST',
      body: { name: unitName.value },
      credentials: 'include',
    });
    console.log('Unit added:', response);
    unitName.value = '';
} catch (error) {
    console.error('Error adding unit:', error);
  }
};

onMounted(async()=>{
    try{
        console.log(allUnits.value);
    }catch(e){
        console.log(e);
    }
})

definePageMeta({
    layout:"admin",

})
</script>
