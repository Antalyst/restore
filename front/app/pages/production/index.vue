<template>
  <div class="p-2">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div class="p-4 bg-gray-100 rounded-lg shadow-sm">
        <label for="sugar-input" class="block text-sm font-medium text-gray-700">Sugar</label>
        <h1 class="text-2xl font-bold text-blue-600 my-2">Total Stock: {{ sugarStock.length > 0 ? sugarStock[0].current_stock : 'Loading...' }}</h1>
        <input 
          type="number" 
          id="sugar-input" 
          v-model.number="sugar" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>

      <div class="p-4 bg-gray-100 rounded-lg shadow-sm">
        <label for="bilog-input" class="block text-sm font-medium text-gray-700">Bilog</label>
        <h1 class="text-2xl font-bold text-blue-600 my-2">Total Stock: {{ bilogStock.length > 0 ? bilogStock[0].current_stock : 'Loading...' }}</h1>
        <input 
          type="number" 
          id="bilog-input" 
          v-model.number="bilog" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>

      <div class="p-4 bg-gray-100 rounded-lg shadow-sm">
        <label for="gala-input" class="block text-sm font-medium text-gray-700">Gala</label>
        <h1 class="text-2xl font-bold text-blue-600 my-2">Total Stock: {{ galaStock.length > 0 ? galaStock[0].current_stock : 'Loading...' }}</h1>
        <input 
          type="number" 
          id="gala-input" 
          v-model.number="galagala" 
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>

      <button 
        type="submit" 
        class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
    
    <div class="mt-8">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Stage One Production History</h2>
      <div v-if="stageOneData.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sugar</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bilog</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gala</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sacks</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reject Bilog</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reject Gala</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Produce</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in stageOneData" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.sugar }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.bilog }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.gala }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.sacks }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.reject_bilog }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.reject_gala }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.total_produce }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="startEdit(item)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 py-4">
        No production history available.
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold mb-4">Edit Production Record #{{ editingItem.id }}</h3>
        <form @submit.prevent="saveChanges" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Sacks</label>
            <p class="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">{{ editingItem.total_produce / 50 }}</p>
          </div>
          <div>
            <label for="edit-reject-bilog" class="block text-sm font-medium text-gray-700">Reject Bilog</label>
            <input type="number" id="edit-reject-bilog" v-model.number="editingItem.reject_bilog" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>
          <div>
            <label for="edit-reject-gala" class="block text-sm font-medium text-gray-700">Reject Gala</label>
            <input type="number" id="edit-reject-gala" v-model.number="editingItem.reject_gala" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>
          <div>
            <label for="edit-total-produce" class="block text-sm font-medium text-gray-700">Total Produce</label>
            <input type="number" id="edit-total-produce" v-model.number="editingItem.total_produce" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2" />
          </div>
          
          <div class="flex justify-end gap-2 mt-4">
            <button 
              type="button" 
              @click="cancelEdit" 
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sugar = ref(0);
const bilog = ref(0);
const galagala = ref(0);

const sugarStock = ref([]);
const bilogStock = ref([]);
const galaStock = ref([]);
const stageOneData = ref([]);

const isModalOpen = ref(false);
const editingItem = ref({});
const originalEditingItem = ref({});

const fetchData = async (itemName, stockRef) => {
  try {
    const response = await $fetch(`http://localhost:5000/api/items/get/items`, {
      method: "post",
      body: {
        name: itemName
      }
    });
    if (Array.isArray(response) && response.length > 0) {
      stockRef.value = response;
    } else {
      console.warn(`No data found for item: ${itemName}`);
    }
  } catch (e) {
    console.error(`Failed to fetch ${itemName} stock:`, e);
  }
};

const fetchStageOneData = async () => {
  try {
    const response = await $fetch(`http://localhost:5000/api/items/get/stage_one`);
    if (Array.isArray(response)) {
      stageOneData.value = response;
    } else {
      console.warn(`No data found for stage_one`);
    }
  } catch (e) {
    console.error("Failed to fetch stage one data:", e);
  }
};

const updateStock = async (name, amountToChange) => {
  try {
    const currentStockResponse = await $fetch(`http://localhost:5000/api/items/get/items`, {
      method: "post",
      body: {
        name: name
      }
    });
    
    let currentStock = 0;
    if (Array.isArray(currentStockResponse) && currentStockResponse.length > 0) {
      currentStock = currentStockResponse[0].current_stock;
    }

    const newStock = currentStock + amountToChange;
    
    const response = await $fetch(`http://localhost:5000/api/items/update`, {
      method: "put",
      body: {
        stock: newStock,
        name: name,
      }
    });
    console.log(`Successfully updated ${name}:`, response);
  } catch (e) {
    console.error(`Error updating ${name} stock:`, e);
  }
};

const startEdit = (item) => {
  originalEditingItem.value = { ...item };
  editingItem.value = { ...item };
  isModalOpen.value = true;
};

const cancelEdit = () => {
  isModalOpen.value = false;
  editingItem.value = {};
  originalEditingItem.value = {};
};

const saveChanges = async () => {
  try {
    const newSacks = editingItem.value.total_produce / 50;
    const sacksDelta = newSacks - originalEditingItem.value.sacks;
    
    const totalRejectedDelta = (editingItem.value.reject_bilog + editingItem.value.reject_gala) - 
                               (originalEditingItem.value.reject_bilog + originalEditingItem.value.reject_gala);

    editingItem.value.sacks = newSacks;

    const response = await $fetch(`http://localhost:5000/api/items/stage_one/update`, {
      method: "put",
      body: editingItem.value,
    });
    console.log("Successfully updated stage_one record:", response);

    await updateStock('Sacks', -sacksDelta);
    await updateStock('Bilog', totalRejectedDelta);
    
    cancelEdit();
    await fetchStageOneData();
  } catch (e) {
    console.error("Error saving changes:", e);
  } finally {
    await fetchData('Sugar', sugarStock);
    await fetchData('Bilog', bilogStock);
    await fetchData('GalaGala', galaStock);
    await fetchStageOneData();
  }
};

onMounted(async () => {
  await fetchData('Sugar', sugarStock);
  await fetchData('Bilog', bilogStock);
  await fetchData('GalaGala', galaStock);
  await fetchStageOneData();
});

const submitForm = async () => {
  try {
    const updatePromises = [];

    if (sugar.value > 0) {
      updatePromises.push(updateStock('Sugar', -sugar.value));
    }
    if (bilog.value > 0) {
      updatePromises.push(updateStock('Bilog', -bilog.value));
    }
    if (galagala.value > 0) {
      updatePromises.push(updateStock('GalaGala', -galagala.value));
    }
    
    await Promise.all(updatePromises);

    await $fetch(`http://localhost:5000/api/items/stage_one`, {
      method: "post",
      body: {
        sugar: sugar.value,
        bilog: bilog.value,
        gala: galagala.value,
        sacks: 0,
        reject_bilog: 0,
        reject_gala: 0,
        total_produce: 0
      }
    });

    console.log("Form submitted and data processed successfully!");

  } catch (e) {
    console.error("An error occurred during form submission:", e);
  } finally {
    await fetchData('Sugar', sugarStock);
    await fetchData('Bilog', bilogStock);
    await fetchData('GalaGala', galaStock);
    await fetchStageOneData();
    
    sugar.value = 0;
    bilog.value = 0;
    galagala.value = 0;
  }
};

definePageMeta({
  layout: "production"
});
</script>
