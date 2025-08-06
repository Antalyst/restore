<template>
  <div class="p-2 bg-gray-100 w-full">
    <main class="flex">
      <section class="border-2 w-full h-screen p-2 ">
        <h1 class="text-xl font-bold mb-2 ">Production</h1>
        <form @submit.prevent="submit">
          <div class="mb-2">
            <select v-model="selecteProduce" class="outline-none px-2 border-teal-800 border-2 rounded">
              <option disabled class="text-gray-200" value="">Select Macuvado </option>
              <option 
                class="" 
                :value="produces.name" 
                v-for="produces in produce" 
                :key="produces.name" 
              >
                {{ produces.name }}
              </option>
            </select>
          </div>
          <div>
            <div class="border w-full p-2 grid grid-cols-1">
              <label class="w-full py-1 text-xl border-b-2 mb-2 border-teal-800 text-teal-800 font-semibold " for="sugar" >Sugar</label>
              <div class="flex gap-2 text-md items-center">
                <h1>Kg</h1><input type="number" v-model="sugar" class="border-teal-800 rounded border"></input>
              </div>
            </div>
            <div class="border w-full p-2 grid grid-cols-1">
              <label class="w-full py-1 text-xl border-b-2 mb-2 border-teal-800 text-teal-800 font-semibold " for="molasis" >Molasis</label>
              <div class="flex gap-2 text-md items-center">
                <h1>Kg</h1><input type="number" v-model="molasis" class="border-teal-800 rounded border"></input>
              </div>
            </div>
            <div class="border w-full p-2 grid grid-cols-1">
              <label class="w-full py-1 text-xl border-b-2 mb-2 border-teal-800 text-teal-800 font-semibold " for="total-bilog ">Total Bilog</label>
              <div class="grid grid-cols-2 gap-2">
                <div class="w-full">
                  <div>Bilog</div>
                  <div class="flex gap-2 text-md items-center">
                    <h1>Kg</h1><input type="number" v-model="bilog" class="w-full border-teal-800 rounded border" ></input>
                  </div>
                </div>
                <div class="w-full">
                  <div>Gala-Gala</div>
                  <div class="flex gap-2 text-md items-center">
                    <h1>Kg</h1><input type="number" v-model="gala" class="w-full border-teal-800 rounded border" ></input>
                  </div>
                </div>
              </div>
            </div>
            <div class="border w-full p-2 grid grid-cols-1">
              <label class="w-full py-1 text-xl border-b-2 mb-2 border-teal-800 text-teal-800 font-semibold " for="apog" >Apog</label>
              <div class="flex gap-2 text-md items-center">
                <h1>Tbps</h1><input type="number" v-model="apog" class="border-teal-800 rounded border">
              </div>
            </div>
            <div class="mb-2">
              <select v-model="selectedClient" class="outline-none px-2 border-teal-800 border-2 rounded">
                <option disabled class="text-gray-200" value="">Select client </option>
                <option 
                  class="" 
                  :value="produces.name" 
                  v-for="produces in client" 
                  :key="produces.name" 
                >
                  {{ produces.name }}
                </option>
              </select>
            </div>
            <button type="submit" class="p-2 text-md font-semibold text-teal-800 border-teal-800 border text-center w-full rounded my-2">Submit</button>
          </div>
        </form>
      </section>
      <section class="border-2 w-full h-screen p-2">
        <h1 class="text-xl font-bold mb-2">Current Stage 1 Production</h1>
        
        <table class="w-full text-sm text-left text-gray-500 ">
          <thead class="text-xs  uppercase bg-teal-600 text-white ">
            <tr>
              <th scope="col" class="px-6 py-3">Client</th>
              <th scope="col" class="px-6 py-3">Produce</th>
              <th scope="col" class="px-6 py-3">Sugar (Kg)</th>
              <th scope="col" class="px-6 py-3">Bilog (Kg)</th>
              <th scope="col" class="px-6 py-3">Gala (Kg)</th>
              <th scope="col" class="px-6 py-3">Date</th>
              <th scope="col" class="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in stageOne" :key="entry.id" class=" border-b  dark:border-gray-700">
              <td class="px-6 py-4">{{ entry.client }}</td>
              <td class="px-6 py-4">{{ entry.produce }}</td>
              <td class="px-6 py-4">{{ entry.sugar }}</td>
              <td class="px-6 py-4">{{ entry.bilog }}</td>
              <td class="px-6 py-4">{{ entry.gala }}</td>
              <td class="px-6 py-4">{{ entry.date }}</td>
              <td class="px-6 py-4">
                <button @click="openModal(entry)" class="font-medium text-teal-600 dark:text-teal-500 hover:underline">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div class="p-8 border w-96 shadow-lg rounded-md bg-white">
            <h2 class="text-xl font-bold mb-4">Edit Production Entry</h2>
            
            <form @submit.prevent="updateEntry">
              <div class="mb-4">
                <label for="edit_sugar" class="block text-gray-700 text-sm font-bold mb-2">Sugar (Kg)</label>
                <input type="number" id="edit_sugar" v-model="editingEntry.sugar" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                <label for="edit_bilog" class="block text-gray-700 text-sm font-bold mb-2">Bilog (Kg)</label>
                <input type="number" id="edit_bilog" v-model="editingEntry.bilog" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div class="mb-4">
                <label for="edit_gala" class="block text-gray-700 text-sm font-bold mb-2">Gala (Kg)</label>
                <input type="number" id="edit_gala" v-model="editingEntry.gala" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </div>

              <div class="flex items-center justify-end">
                <button type="button" @click="closeModal" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">Cancel</button>
                <button type="submit" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const selectedClient = ref("")
  const selecteProduce = ref("");
  const sugar = ref(0);
  const molasis = ref(0);
  const bilog = ref(0);
  const gala = ref(0);
  const apog = ref(0); 
  const client = ref(null)
  const sugarStock = ref(null);
  const molasisStock = ref(null);
  const bilogStock = ref(null);
  const recycleSacksStock = ref(null);
  const apogStock = ref(null); 
  const stageOne = ref([])


  const produce = ref([
    { name: "Dark Mascuvado" },
    { name: "Light Mascuvado" },
    { name: "Brown Mascuvado" }
  ]);

  const submit = async () => {
    try{
      await updateItems ("sugar", (sugarStock.value - sugar.value))
      await updateItems ("bilog", (bilogStock.value - (bilog.value + gala.value )))
      await updateItems ("molasis", (molasisStock.value - molasis.value))
      await updateItems ("rsacks", (apogStock.value - apog.value))

      await insertStageOne(
        selectedClient.value, 
        selecteProduce.value,
        sugar.value,
        bilog.value,
        gala.value,
      )

      fetchStageOne()

    }catch(e){
      console.log(e);
    }
  }

  const insertStageOne  = async(client, produce, sugar, bilog, gala)=>{
    try{
      await $fetch(`http://localhost:5000/api/stageone/add`,{
        method:"POST",
        body:{
          client:client,
          produce:produce,
          sugar:sugar,
          bilog:bilog,
          gala:gala,
          recycle_sacks:0,
          reject_bilog:0,
          total_produce:0,
          date:`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
        }
      })
    }catch(e){
      console.log(e);
    }
  }

  const fetchStageOne= async() => {
    try{
      stageOne.value = await $fetch(`http://localhost:5000/api/stageone/get`)
      console.log(stageOne.value);
    }catch(e){
      console.log(e);
    }
  }

const fetchItems = async (itemName) => {
  try {
    const response = await $fetch(`http://localhost:5000/api/items/get/items`, {
      method: "POST",
      body: {
        name: itemName,
      },
    });

    return response; 
  } catch (e) {
    console.error("Failed to fetch item:", e);
    return null;
  }
};

  const fetchClient = async()=>{
    try{
      client.value = await $fetch(`http://localhost:5000/api/client/get`);
      console.log(client.value)
    }catch(e){
      console.log(e);
    }
  }

  const updateItems = async(itemName, stock)=>{
    try{
      await $fetch(`http://localhost:5000/api/items/update`,{
        method:"PUT",
        body:{
          name:itemName,
          stock:stock
        }
      })
    }catch(e){
      console.log(e)
    }
  }

onMounted(async () => {
  fetchClient();

  const sugarData = await fetchItems("sugar");
  if (sugarData && sugarData.length > 0) {
    sugarStock.value = sugarData[0].current_stock;
  }
  
  const molasisData = await fetchItems("molasis");
  if (molasisData && molasisData.length > 0) {
    molasisStock.value = molasisData[0].current_stock;
  }
  
  const sacksData = await fetchItems("rsacks");
  if (sacksData && sacksData.length > 0) {
    recycleSacksStock.value = sacksData[0].current_stock;
  }
  
  const bilogData = await fetchItems("bilog");
  if (bilogData && bilogData.length > 0) {
    bilogStock.value = bilogData[0].current_stock;
  }

  const apogData = await fetchItems("apog");
  if (apogData && apogData.length > 0) {
    apogStock.value = apogData[0].current_stock;
  }

  fetchStageOne()

  console.log('Sugar stock:', sugarStock.value); 
  console.log('Molasis stock:', molasisStock.value);
  console.log('Sacks stock:', recycleSacksStock.value); 
  console.log('Bilog stock:', bilogStock.value);
  console.log('apog stock:', apogStock.value);
});

  definePageMeta({
    layout: "production"
  });
</script>
