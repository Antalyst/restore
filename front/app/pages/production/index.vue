<template>
  <div class="p-2 bg-gray-100 w-full">
    <main class="flex flex-col md:flex-row">
      <section class=" w-full h-screen p-2 ">
        <h1 class="text-xl font-bold mb-2 text-teal-700">Production</h1>
        <form @submit.prevent="submit">
        
          <div class="mb-2">
            <select v-model="selecteProduce" required class="outline-none px-2 border-teal-700 border-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-700">
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
              <label class="w-full py-1 text-xl border-b-2 mb-2 border-teal-700 text-teal-700 font-semibold " for="sugar" >Sugar</label>
              <div class="flex gap-2 text-md items-center">
                <h1>Kg</h1><input type="number" min="0" required v-model.number="sugar" class="border-teal-700 rounded border focus:outline-none focus:ring-2 focus:ring-teal-700 p-1" />
              </div>
              <div v-if="sugarWarning" class="text-red-600 text-xs mt-1">{{ sugarWarning }}</div>
            </div>
            <div class="border w-full p-2 grid grid-cols-1">
              <label class="w-full py-1 text-xl border-b-2 mb-2 border-teal-700 text-teal-700 font-semibold " for="molasis" >Molasis</label>
              <div class="flex gap-2 text-md items-center">
                <h1>Kg</h1><input type="number" min="0" required v-model.number="molasis" class="border-teal-700 rounded border focus:outline-none focus:ring-2 focus:ring-teal-700 p-1" />
              </div>
              <div v-if="molasisWarning" class="text-red-600 text-xs mt-1">{{ molasisWarning }}</div>
            </div>
            <div class="border w-full p-2 grid grid-cols-1">
              <label class="w-full py-1 text-xl border-b-2 mb-2 border-teal-700 text-teal-700 font-semibold " for="total-bilog ">Total Bilog</label>
              <div class="grid grid-cols-2 gap-2">
                <div class="w-full">
                  <div>Bilog</div>
                  <div class="flex gap-2 text-md items-center">
                    <h1>Kg</h1><input type="number" min="0" required v-model.number="bilog" class="w-full border-teal-700 rounded border focus:outline-none focus:ring-2 focus:ring-teal-700 p-1" />
                  </div>
                </div>
                <div class="w-full">
                  <div>Gala-Gala</div>
                  <div class="flex gap-2 text-md items-center">
                    <h1>Kg</h1><input type="number" min="0" required v-model.number="gala" class="w-full border-teal-700 rounded border focus:outline-none focus:ring-2 focus:ring-teal-700 p-1" />
                  </div>
                </div>
              </div>
              <div v-if="bilogWarning" class="text-red-600 text-xs mt-1">{{ bilogWarning }}</div>
            </div>
            <div class="border w-full p-2 grid grid-cols-1">
              <label class="w-full py-1 text-xl border-b-2 mb-2 border-teal-700 text-teal-700 font-semibold " for="apog" >Apog</label>
              <div class="flex gap-2 text-md items-center">
                <h1>Tbps</h1><input type="number" min="0" required v-model.number="apog" class="border-teal-700 rounded border focus:outline-none focus:ring-2 focus:ring-teal-700 p-1">
              </div>
              <div v-if="apogWarning" class="text-red-600 text-xs mt-1">{{ apogWarning }}</div>
            </div>

            <div class="flex gap-2 w-full">
              <div class="mb-2">
                <select v-model="selectedLeader" required class="outline-none px-2 border-teal-700 border-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-700">
                  <option disabled class="text-gray-200" value="">Select Group Leader</option>
                  <option 
                    class="" 
                    :value="produces.id" 
                    v-for="produces in gl" 
                    :key="produces.name" 
                  >
                    {{ produces.name }}
                  </option>
                </select>
              </div>
            </div>
            <button type="submit" :disabled="!isFormValid" class="p-2 text-md font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-center w-full rounded my-2">Submit</button>
          </div>
        </form>
      </section>
      <section class=" w-full h-screen p-2">
        <div class="flex items-center justify-end mb-2">
          <button @click="openMixModal" class="px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded ">Create Mix</button>
       
        </div>
        <h1 class="text-xl font-bold mb-2 text-teal-700">Current Stage 1 Production</h1>
        <div class="overflow-x-auto">
        <table class="w-full min-w-[800px] text-sm text-left text-gray-500 ">
          <thead class="text-xs  uppercase bg-teal-700 text-white ">
            <tr>
              <th scope="col" class="px-6 py-3">Production Code</th>
              <th scope="col" class="px-6 py-3">Client</th>
              <th scope="col" class="px-6 py-3">Producing</th>
              <th scope="col" class="px-6 py-3">group Leader</th>
              <th scope="col" class="px-6 py-3">Sugar (Kg)</th>
              <th scope="col" class="px-6 py-3">Bilog (Kg)</th>
              <th scope="col" class="px-6 py-3">Gala (Kg)</th>
              <th scope="col" class="px-6 py-3">Date</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in stageOne" :key="entry.stage_one_id" class=" border-b  dark:border-gray-700">
              <td class="px-6 py-4">{{ entry.production_code }}</td>
              <td class="px-6 py-4">{{ entry.client }}</td>
              <td class="px-6 py-4">{{ entry.produce }}</td>
              <td class="px-6 py-4">{{ entry.name }}</td>
              <td class="px-6 py-4">{{ entry.sugar }}</td>
              <td class="px-6 py-4">{{ entry.bilog }}</td>
              <td class="px-6 py-4">{{ entry.gala }}</td>
              <td class="px-6 py-4">{{ entry.date }}</td>
              <td class="px-6 py-4">{{ entry.status }}</td>
              <td class="px-6 py-4">
                <button @click="openModal(entry)" class="font-medium text-teal-600 dark:text-teal-500 hover:underline">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <section class=" w-full max-h-[700px] overflow-y-auto overflow-x-auto">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-xl font-bold text-teal-700">Current Stage 2 Production</h1>
         
        </div>
          <div class="overflow-x-auto">
          <table class="w-full min-w-[900px] text-xs text-left text-gray-500 ">
            <thead class="text-xs uppercase bg-lime-700 text-white sticky top-0 z-10">
            <tr>
              <th scope="col" class="px-6 py-3">Production Code</th>
              <th scope="col" class="px-6 py-3">Producing</th>
              <th scope="col" class="px-6 py-3">Group Leader</th>
              <th scope="col" class="px-6 py-3">Stage 1 Produced (Kg)</th>
              <th scope="col" class="px-6 py-3">Stage 1 Bilog (Kg)</th>
              
              
              <th scope="col" class="px-6 py-3">Date</th>
              <th scope="col" class="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in stageTwo" :key="entry.id" class=" border-b  dark:border-gray-700">
              <td class="px-6 py-4">{{ entry.production_code }}</td>
              <td class="px-6 py-4">{{ entry.produce }}</td>
              <td class="px-6 py-4">{{ entry.group_leader }}</td>
              <td class="px-6 py-4">{{ entry.total_produce }}</td>
              <td class="px-6 py-4">{{ entry.stage1bilog }}</td>
          
              <td class="px-6 py-4">{{ entry.date }}</td>
              <td class="px-6 py-4">{{ entry.status_session }}</td>
            </tr>
          </tbody>
        </table>
        </div>

        <!-- Mix Modal -->
        <div v-if="isMixOpen" class="fixed z-[100] inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div class="p-6 border-t-4 border-teal-700 w-11/12 sm:w-[700px] max-w-3xl shadow-lg rounded-md bg-white">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-xl font-bold">Create Mix</h2>
              <button @click="closeMix" class="text-gray-600">✕</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label class="block text-sm font-semibold text-teal-700 mb-1">Client</label>
                <select v-model="mixClient" class="w-full border border-teal-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-700">
                  <option disabled value="">Select client</option>
                  <option v-for="c in client || []" :key="c.name" :value="c.name">{{ c.name }}</option>
                </select>
              </div>
            </div>
            <div class="max-h-[50vh] overflow-auto border rounded">
              <table class="w-full text-sm">
                <thead class="bg-gray-100 sticky top-0">
                  <tr>
                    <th class="px-3 py-2"></th>
                    <th class="px-3 py-2">Code</th>
                    <th class="px-3 py-2">Total Produce (Kg)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in stageTwoSelectable" :key="row.id" class="border-b">
                    <td class="px-3 py-2"><input type="checkbox" v-model="selectedStageTwoIds" :value="row.id" /></td>
                    <td class="px-3 py-2">{{ row.production_code }}</td>
                    <td class="px-3 py-2">{{ row.total_produce }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex items-center justify-end gap-2 mt-4">
              <button @click="closeMix" class="px-4 py-2 border rounded">Cancel</button>
              <button @click="performMix" :disabled="mixing || selectedStageTwoIds.length === 0" class="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50">{{ mixing ? 'Mixing…' : 'Mix' }}</button>
            </div>
          </div>
        </div>
        
        <!-- Final Stage List -->
        <section class="border-2 w-full max-h-[700px] overflow-y-auto overflow-x-auto ">
          <div class="flex items-center justify-between ">
            <h1 class="text-xl font-bold text-teal-700">Final Stage</h1>
          </div>
          <div class="overflow-x-auto">
          <table class="w-full min-w-[900px] text-xs text-left text-gray-500">
            <thead class="text-xs uppercase bg-amber-700 text-white sticky top-0 z-10">
              <tr>
                <th class="px-6 py-3">Code</th>
                <th class="px-6 py-3">Client</th>
                <th class="px-6 py-3">Mixed (Kg)</th>
                <th class="px-6 py-3">Size (Kg)</th>
                <th class="px-6 py-3">Bilog (Kg)</th>
                <th class="px-6 py-3">Sacks</th>
                <th class="px-6 py-3">Date</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in finalStageFiltered" :key="row.id" class="border-b">
                <td class="px-6 py-4">{{ row.code }}</td>
                <td class="px-6 py-4">{{ row.client }}</td>
                <td class="px-6 py-4">{{ row.total_kg_mixed }}</td>
                <td class="px-6 py-4">{{ row.size }}</td>
                <td class="px-6 py-4">{{ row.bilog }}</td>
                <td class="px-6 py-4">{{ row.sacks }}</td>
                <td class="px-6 py-4">{{ row.date }}</td>
                <td class="px-6 py-4">{{ row.status }}</td>
                <td class="px-6 py-4">
                  <button @click="openFinalModal(row)" class="px-3 py-1 bg-teal-600 text-white rounded">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </section>

        <!-- Final Stage Edit Modal -->
        <div v-if="isFinalOpen" class="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-100">
          <div class="p-6 border-t-4 border-teal-700 w-11/12 sm:w-[500px] max-w-2xl shadow-lg rounded-md bg-white">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-xl font-bold">Edit Final Stage</h2>
              <button @click="closeFinalModal" class="text-gray-600">✕</button>
            </div>
            <div class="grid gap-3">
              <div>
                <label class="block text-sm font-semibold text-teal-700 mb-1">Bilog (Kg)</label>
                <input type="number" min="0" v-model.number="finalBilog" class="w-full border border-teal-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-700" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-teal-700 mb-1">Size (Kg)</label>
                <input type="number" min="0" v-model.number="finalSize" class="w-full border border-teal-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-700" />
                <div class="text-xs text-gray-600 mt-1">Computed sacks: {{ finalSacks }}</div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 mt-4">
              <button @click="closeFinalModal" class="px-4 py-2 border rounded">Cancel</button>
              <button @click="submitFinalUpdate" class="px-4 py-2 bg-teal-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      </section>
        <div v-if="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-10">
          <div class="p-8 border-t-4 border-teal-700 w-11/12 sm:w-96 max-w-lg shadow-lg rounded-md bg-white">
            <h2 class="text-xl font-bold mb-4">Production produced</h2>
            
            <form @submit.prevent="updateEntry">
              <div class="mb-4">
                <label for="edit_sugar" class="block text-teal-700 text-sm font-bold mb-2">Produce (Kg)</label>
                <input type="number" min="0" required id="edit_sugar" v-model.number="totalProduced" class="shadow appearance-none border border-teal-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-700">
              </div>
              <div class="mb-4">
                <label for="edit_bilog" class="block text-teal-700 text-sm font-bold mb-2">Bilog (Kg)</label>
                <input type="number" min="0" required id="edit_bilog" v-model.number="rejectedBilog" class="shadow appearance-none border border-teal-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-700">
              </div>
              <div class="mb-4">
              </div>

              <div class="flex items-center justify-between">
                <button type="button" @click="closeModal" class="border border-teal-700 text-teal-700 hover:bg-teal-50 font-bold py-2 px-4 rounded focus:outline-none">Cancel</button>
                <div class="flex gap-2">
                  <button type="button" @click="markStageOneAsFailed" class="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none">Failed</button>
                  <button type="submit" class="bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none">Update</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script setup>
  import { ref, computed, onMounted, watch } from 'vue';

  // Client is no longer required/selected at stage one
  const selectedClient = ref("")
  const selecteProduce = ref("");
  const sugar = ref(0);
  const molasis = ref(0);
  const bilog = ref(0);
  const gala = ref(0);
  const apog = ref(0); 
  const sacks = ref(0); 
  const client = ref(null)
  const sugarStock = ref(null);
  const molasisStock = ref(null);
  const bilogStock = ref(null);
  const recycleSacksStock = ref(null);
  const apogStock = ref(null); 
  const sugarMin = ref(0);
  const molasisMin = ref(0);
  const bilogMin = ref(0);
  const apogMin = ref(0);
  const stageOne = ref([])
  const isModalOpen = ref(false);
  const isModalOpenStageTwo = ref(false);
  const selectedLeader = ref("")
  const failedRemarks = ref('');
  const gl = ref([]);
  // Mix modal state and computed totals
  const isMixOpen = ref(false)
  const selectedStageTwoIds = ref([])
  const mixing = ref(false)
  const mixClient = ref("")

  // Final Stage edit state
  const isFinalOpen = ref(false)
  const finalRow = ref(null)
  const finalBilog = ref(0)
  const finalSize = ref(0)
  const finalSacks = computed(() => {
    const size = Number(finalSize.value || 0)
    if (!Number.isFinite(size) || size <= 0) return 0
    return Math.floor(size / 50)
  })

  const stageTwoSelectable = computed(() => stageTwo.value.filter(r => r.status_session === 'processing'))

  const stageOneId = ref(null)
  const stageTwoId = ref(null)
  const rejectedBilog = ref(0)

  const totalProduced = ref(0);
  const stageTwo = ref([])
  const finalStage = ref([])
  async function fetchFinalStage() {
    try {
      finalStage.value = await $fetch('http://localhost:5000/api/finalstage/get')
    } catch (e) {}
  }

  // Final Stage filters
  const finalSearch = ref("")
  const finalClientFilter = ref("")
  const finalStageClients = computed(() => {
    const set = new Set((finalStage.value || []).map(r => r.client).filter(Boolean))
    return Array.from(set)
  })
  const finalStageFiltered = computed(() => {
    const codeQ = String(finalSearch.value || '').trim().toLowerCase()
    const clientQ = String(finalClientFilter.value || '').trim().toLowerCase()
    return (finalStage.value || []).filter(r => {
      const okCode = !codeQ || String(r.code || '').toLowerCase().includes(codeQ)
      const okClient = !clientQ || String(r.client || '').toLowerCase() === clientQ
      return okCode && okClient
    })
  })



const resetValues = () => {
  sugar.value = 0;
  molasis.value = 0;
  bilog.value = 0;
  gala.value = 0;
  apog.value = 0;
  sacks.value = 0;
  selectedClient.value = "";
  selectedLeader.value= "";
  selecteProduce.value = "";
  rejectedBilog.value=0;
  failedRemarks.value = '';
};

const markStageOneAsFailed = async () => {
  try {
    // Add to failed_stage table
    await $fetch(`http://localhost:5000/api/failed/add`, {
      method: "POST",
      body: {
        stageOneId: stageOneId.value.stage_one_id,
        stageTwoId: null,
        remarks: failedRemarks.value || "Stage One production failed"
      }
    });

    // Update stage_one status to failed
    await $fetch(`http://localhost:5000/api/failed/updateStage1/${stageOneId.value.stage_one_id}`, {
      method: "PUT",
      body: {
        status: "failed"
      }
    });

    closeModal();
    fetchStageOne();
  } catch (e) {
    console.error("Failed to mark stage one as failed:", e);
  }
};

const markStageTwoAsFailed = async () => {
  try {
    // Add to failed_stage table
    await $fetch(`http://localhost:5000/api/failed/add`, {
      method: "POST",
      body: {
        stageOneId: null,
        stageTwoId: stageTwoId.value.id,
        remarks: failedRemarks.value || "Stage Two production failed"
      }
    });

    // Update stage_two status to failed
    await $fetch(`http://localhost:5000/api/failed/updateStage2/${stageTwoId.value.id}`, {
      method: "PUT",
      body: {
        status: "failed"
      }
    });

    closeModalStageTwo();
    fetchStageTwo();
  } catch (e) {
    console.error("Failed to mark stage two as failed:", e);
  }
};

const fetchgl = async () =>{
  try{
    gl.value = await $fetch(`http://localhost:5000/api/groupleaders/get`);
    console.log(gl.value);
  }catch(e){
    console.log(e);
    
  }
}

watch(selectedLeader, (val)=>{
  console.log(val);
  
})

  const produce = ref([
    { name: "Dark Mascuvado" },
    { name: "Light Mascuvado" },
    { name: "Brown Mascuvado" }
  ]);

  const openModal = (entry) => {
    stageOneId.value = { ...entry };
    isModalOpen.value = true;
  };

// Stage two edit modal removed in favor of mix flow

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const rSacksused = computed(() => {
    const calculatedSacks = rejectedBilog.value / 50;
    if (calculatedSacks <= 0.9) {
      return 1;
    }
    return Math.round(calculatedSacks);
  });

const sacksused = computed(() => {
    const calculatedSacks = totalProduced.value / 50;
    if (calculatedSacks <= 0.9) {
      return 1;
    }
    return Math.round(calculatedSacks);
  });

  function openMixModal() {
    selectedStageTwoIds.value = []
    isMixOpen.value = true
  }
  function closeMix() {
    isMixOpen.value = false
  }

  function openFinalModal(row) {
    finalRow.value = { ...row }
    finalBilog.value = Number(row.bilog || 0)
    finalSize.value = Number(row.size || 0)
    isFinalOpen.value = true
  }
  function closeFinalModal() {
    isFinalOpen.value = false
  }
  async function submitFinalUpdate() {
    if (!finalRow.value) return
    try {
      const sacks = finalSacks.value
      await $fetch(`http://localhost:5000/api/finalstage/update/${finalRow.value.id}`, {
        method: 'PUT',
        body: {
          size: Number(finalSize.value || 0),
          bilog: Number(finalBilog.value || 0),
          sacks: Number(sacks),
          status: 'Ready to deliver'
        }
      })
      closeFinalModal()
      await fetchFinalStage()
    } catch (e) {
      console.error('Final update failed', e)
    }
  }

  const isFormValid = computed(() => {
    const hasLeader = !!selectedLeader.value;
    const hasProduct = !!selecteProduce.value;
    const sugarValid = Number(sugar.value) >= 0;
    const molasisValid = Number(molasis.value) >= 0;
    const bilogValid = Number(bilog.value) >= 0;
    const galaValid = Number(gala.value) >= 0;
    const apogValid = Number(apog.value) >= 0;
    const stockOk = !sugarWarning.value && !molasisWarning.value && !bilogWarning.value && !apogWarning.value;
    return (
      hasLeader && hasProduct &&
      sugarValid && molasisValid && bilogValid && galaValid && apogValid && stockOk
    );
  });

  const sugarWarning = computed(() => {
    if (sugarStock.value == null) return "";
    const next = Number(sugarStock.value) - Number(sugar.value || 0);
    if (next < 0) return "Sugar stock insufficient.";
    if (next < Number(sugarMin.value || 0)) return `Sugar would drop below minimum (${sugarMin.value}).`;
    return "";
  });
  const molasisWarning = computed(() => {
    if (molasisStock.value == null) return "";
    const next = Number(molasisStock.value) - Number(molasis.value || 0);
    if (next < 0) return "Molasis stock insufficient.";
    if (next < Number(molasisMin.value || 0)) return `Molasis would drop below minimum (${molasisMin.value}).`;
    return "";
  });
  const bilogWarning = computed(() => {
    if (bilogStock.value == null) return "";
    const consume = Number(bilog.value || 0) + Number(gala.value || 0);
    const next = Number(bilogStock.value) - consume;
    if (next < 0) return "Bilog/Gala stock insufficient.";
    if (next < Number(bilogMin.value || 0)) return `Bilog would drop below minimum (${bilogMin.value}).`;
    return "";
  });
  const apogWarning = computed(() => {
    if (apogStock.value == null) return "";
    const next = Number(apogStock.value) - Number(apog.value || 0);
    if (next < 0) return "Apog stock insufficient.";
    if (next < Number(apogMin.value || 0)) return `Apog would drop below minimum (${apogMin.value}).`;
    return "";
  });

  async function performMix() {
    try {
      mixing.value = true
      await $fetch('http://localhost:5000/api/finalstage/mix', {
        method: 'POST',
        body: { ids: selectedStageTwoIds.value, remark: '', client: mixClient.value || null },
      })
      closeMix()
      await fetchStageTwo()
      await fetchFinalStage()
    } catch (e) {
      console.error('Mix failed', e)
    } finally {
      mixing.value = false
    }
  }

  const updateEntry = async () => {
    try {
        await $fetch(`http://localhost:5000/api/stageone/update/${stageOneId.value.stage_one_id}`, {
        method: "PUT",
        body:{
          recycle_sacks: rSacksused.value,
          reject_bilog:rejectedBilog.value,
          total_produce:totalProduced.value
      },
      });

      await $fetch(`http://localhost:5000/api/stagetwo/add`, {
        method: "POST",
        body:{
            stage_one_id: stageOneId.value.stage_one_id,
            group_leader: stageOneId.value.name,
            status_session:"processing"
        },
      });


      await updateItemsDelta("bilog", rejectedBilog.value);
      await updateItemsDelta("rsacks", -rSacksused.value);
      closeModal();
      fetchStageOne();
      fetchStageTwo();
    } catch (e) {
      console.error("Failed to update entry:", e);
    }
  };

  const submit = async () => {
    try{
      if (!isFormValid.value) {
        alert('Please complete all required fields.');
        return;
      }
      await updateItemsDelta ("sugar", -sugar.value)
      await updateItemsDelta ("bilog", -(bilog.value + gala.value))
      await updateItemsDelta ("molasis", -molasis.value)
      await updateItemsDelta ("apog", -apog.value)
      await insertStageOne(
        null,
        selecteProduce.value,
        sugar.value,
        bilog.value,
        gala.value,
      )
      // resetValues();
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
          group_leader_id: selectedLeader.value,
          produce:produce,
          sugar:sugar,
          bilog:bilog,
          gala:gala,
          recycle_sacks:0,
          reject_bilog:0,
          total_produce:0,
           date:`${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
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

  const fetchStageTwo= async() => {
    try{
      stageTwo.value = await $fetch(`http://localhost:5000/api/stagetwo/get`)
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

  const updateItemsDelta = async(itemName, delta)=>{
    try{
      await $fetch(`http://localhost:5000/api/items/update-delta`,{
        method:"PUT",
        body:{
          name:itemName,
          delta:delta
        }
      })
    }catch(e){
      console.log(e)
    }
  }

  onMounted(async () => {
    fetchClient();
    fetchgl();

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

  const newSacksData = await fetchItems("sacks");
    if (newSacksData && newSacksData.length > 0) {
      sacks.value = newSacksData[0].current_stock;
    }

    fetchStageOne()
    fetchStageTwo()
    fetchFinalStage()

    console.log('Sugar stock:', sugarStock.value); 
    console.log('Molasis stock:', molasisStock.value);
    console.log('Sacks stock:', recycleSacksStock.value); 
    console.log('Bilog stock:', bilogStock.value);
    console.log('apog stock:', apogStock.value);
     console.log('realsacks stock:', sacks.value);
  });

  definePageMeta({
    layout: "production"
  });
</script>