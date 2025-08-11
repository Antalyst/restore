<template>
  <div class="min-h-screen w-full bg-stone-50 p-3 md:p-6">
    <main class="flex flex-col md:flex-row">
      <section class="w-full p-4 bg-white border rounded-xl shadow-sm overflow-y-auto">
        <div class="flex items-center justify-between mb-3">
          <h1 class="text-xl font-bold text-rose-700 flex items-center gap-2">
            Failed Productions
            <span class="text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">{{ failedCount }}</span>
          </h1>
          <div class="flex gap-2 items-center flex-wrap">
            <select v-model="failedClient" class="border rounded px-2 py-1">
              <option value="">All clients</option>
              <option v-for="c in failedClients" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="failedDate" class="border rounded px-2 py-1">
              <option value="">All dates</option>
              <option v-for="d in failedDates" :key="d" :value="d">{{ d }}</option>
            </select>
            <select v-model="failedLeader" class="border rounded px-2 py-1">
              <option value="">All leaders</option>
              <option v-for="l in failedLeaders" :key="l" :value="l">{{ l }}</option>
            </select>
            <input
              v-model.trim="query"
              type="text"
              placeholder="Search..."
              class="border border-rose-700 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-rose-700"
            />
            <button @click="fetchFailed" :disabled="loading"
              class="px-3 py-1 bg-rose-700 text-white rounded-md hover:bg-rose-800 disabled:opacity-50">
              {{ loading ? 'Refreshing...' : 'Refresh' }}
            </button>
            <button @click="resetFailedFilters" class="px-3 py-1 border rounded-md hover:bg-gray-50">Clear</button>
          </div>
        </div>

        <div v-if="error" class="mb-2 p-2 bg-red-50 border border-red-200 text-red-700 rounded">
          {{ error }}
        </div>

        <div v-if="loading" class="text-gray-600">Loading failed logs...</div>

          <div v-else>
          <div v-if="filtered.length === 0" class="text-gray-600">No failed records found.</div>
          <div v-else>
            <!-- Mobile cards -->
            <div class="sm:hidden grid gap-2">
              <div v-for="r in filtered" :key="r.id" class="border rounded-md p-3 bg-white shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="font-semibold text-gray-800">Code: {{ r.stage_one_code || r.stage_two_code || '-' }}</div>
                  <span class="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-700">{{ r.failed_stage_type }}</span>
                </div>
                <div class="text-sm text-gray-600">Client: {{ r.client || '-' }}</div>
                <div class="grid grid-cols-2 gap-2 text-sm mt-2">
                  <div>Produce: <span class="font-semibold">{{ r.produce }}</span></div>
                  <div>Leader: <span class="font-semibold">{{ r.group_leader }}</span></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Date: {{ r.failed_date }}</div>
                <div class="text-xs text-gray-600 mt-1" :title="r.remarks">Remarks: {{ r.remarks || '-' }}</div>
                <div class="mt-2 text-right">
                  <button @click="openEdit(r)" class="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 mr-2">Edit</button>
                  <button @click="confirmDelete(r)" class="px-2 py-1 text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
            <!-- Desktop table -->
            <div class="hidden sm:block max-h-[40vh] overflow-y-auto border rounded-xl shadow-sm">
              <table class="w-full text-sm text-left text-gray-700">
              <thead class="text-xs uppercase bg-rose-700 text-white sticky top-0">
                <tr>
              
                  <th class="px-4 py-2">Production Code</th>
                  <th class="px-4 py-2">Client</th>
                  <th class="px-4 py-2">Produce</th>
                  <th class="px-4 py-2">Stage</th>
                  <th class="px-4 py-2">Group Leader</th>
                  <th class="px-4 py-2">Status</th>
                  <th class="px-4 py-2">Date</th>
                  <th class="px-4 py-2">Remarks</th>
                    <th class="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in filtered" :key="r.id" class="border-b hover:bg-gray-50">
           
                  <td class="px-4 py-2">{{ r.stage_one_code || r.stage_two_code || '-' }}</td>
                  <td class="px-4 py-2">{{ r.client }}</td>
                  <td class="px-4 py-2">{{ r.produce }}</td>
                  <td class="px-4 py-2">{{ r.failed_stage_type }}</td>
                  <td class="px-4 py-2">{{ r.group_leader }}</td>
                  <td class="px-4 py-2">
                    {{ r.stage_one_status || r.stage_two_status || '-' }}
                  </td>
                  <td class="px-4 py-2">{{ r.failed_date }}</td>
                  <td class="px-4 py-2 max-w-[300px] truncate" :title="r.remarks">{{ r.remarks || '-' }}</td>
                    <td class="px-4 py-2 text-right whitespace-nowrap">
                      <button @click="openEdit(r)" class="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 mr-2">Edit</button>
                      <button @click="confirmDelete(r)" class="px-2 py-1 text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                    </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-bold text-lime-700 flex items-center gap-2">
              Stage Two Complete
              <span class="text-xs font-semibold text-lime-700 bg-lime-100 px-2 py-0.5 rounded-full">{{ stageTwoCount }}</span>
            </h2>
            <div class="flex gap-2 items-center flex-wrap">
              <select v-model="stageTwoClient" class="border rounded px-2 py-1">
                <option value="">All clients</option>
                <option v-for="c in stageTwoClients" :key="c" :value="c">{{ c }}</option>
              </select>
              <select v-model="stageTwoDate" class="border rounded px-2 py-1">
                <option value="">All dates</option>
                <option v-for="d in stageTwoDates" :key="d" :value="d">{{ d }}</option>
              </select>
              <select v-model="stageTwoLeader" class="border rounded px-2 py-1">
                <option value="">All leaders</option>
                <option v-for="l in stageTwoLeaders" :key="l" :value="l">{{ l }}</option>
              </select>
              <input
                v-model.trim="stageTwoQuery"
                type="text"
                placeholder="Search..."
                class="border border-lime-700 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-lime-700"
              />
              <button @click="fetchStageTwo" :disabled="loadingStageTwo"
                class="px-3 py-1 bg-lime-700 text-white rounded-md hover:bg-lime-800 disabled:opacity-50">
                {{ loadingStageTwo ? 'Refreshing...' : 'Refresh' }}
              </button>
              <button @click="resetStageTwoFilters" class="px-3 py-1 border rounded-md hover:bg-gray-50">Clear</button>
            </div>
          </div>

          <div v-if="loadingStageTwo" class="text-gray-600">Loading stage two...</div>
          <div v-else>
            <div v-if="filteredStageTwo.length === 0" class="text-gray-600">No current stage two records.</div>
            <div v-else>
              <!-- Mobile cards -->
              <div class="sm:hidden grid gap-2">
                <div v-for="entry in filteredStageTwo" :key="entry.id" class="border rounded-md p-3 bg-white shadow-sm">
                  <div class="flex items-center justify-between">
                    <div class="font-semibold text-gray-800">Code: {{ entry.production_code }}</div>
                    <span class="text-xs px-2 py-1 rounded-full bg-lime-100 text-lime-700">{{ entry.status_session }}</span>
                  </div>
                  <div class="text-sm text-gray-600">Client: {{ entry.client || '-' }}</div>
                  <div class="grid grid-cols-2 gap-2 text-sm mt-2">
                    <div>Produce: <span class="font-semibold">{{ entry.produce }}</span></div>
                    <div>Leader: <span class="font-semibold">{{ entry.group_leader }}</span></div>
                    <div>Stage1 Kg: <span class="font-semibold">{{ entry.total_produce }}</span></div>
                    <div>Stage1 Bilog: <span class="font-semibold">{{ entry.stage1bilog }}</span></div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Date: {{ entry.date }}</div>
                </div>
              </div>
              <!-- Desktop table -->
              <div class="hidden sm:block max-h-[40vh] overflow-y-auto border rounded-xl shadow-sm">
                <table class="w-full text-xs text-left text-gray-700">
                <thead class="text-xs uppercase bg-lime-700 text-white sticky top-0">
                  <tr>
                    <th class="px-4 py-2">Production Code</th>
                    <th class="px-4 py-2">Client</th>
                    <th class="px-4 py-2">Produce</th>
                    <th class="px-4 py-2">Group Leader</th>
                    <th class="px-4 py-2">Stage 1 Produced (Kg)</th>
                    <th class="px-4 py-2">Stage 1 Bilog (Kg)</th>
                    <th class="px-4 py-2">Final Produced (Kg)</th>
                    <th class="px-4 py-2">Stage 2 Bilog (Kg)</th>
                    <th class="px-4 py-2">Sacks (Pcs)</th>
                    <th class="px-4 py-2">Date</th>
                    <th class="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entry in filteredStageTwo" :key="entry.id" class="border-b hover:bg-gray-50">
                    <td class="px-4 py-2">{{ entry.production_code }}</td>
                    <td class="px-4 py-2">{{ entry.client }}</td>
                    <td class="px-4 py-2">{{ entry.produce }}</td>
                    <td class="px-4 py-2">{{ entry.group_leader }}</td>
                    <td class="px-4 py-2">{{ entry.total_produce }}</td>
                    <td class="px-4 py-2">{{ entry.stage1bilog }}</td>
                    <td class="px-4 py-2">{{ entry.produced }}</td>
                    <td class="px-4 py-2">{{ entry.bilog }}</td>
                    <td class="px-4 py-2">{{ entry.sacks }}</td>
                    <td class="px-4 py-2">{{ entry.date }}</td>
                    <td class="px-4 py-2">{{ entry.status_session }}</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      <!-- Final Stage Admin Table -->
      <div class="mt-6 w-full p-4 bg-white border rounded-xl shadow-sm overflow-y-auto">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-bold text-amber-700 flex items-center gap-2">
            Final Stage
            <span class="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{{ finalCount }}</span>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end w-full sm:w-auto sm:justify-end">
            <select v-model="finalClient" class="border rounded px-2 py-2">
              <option value="">All clients</option>
              <option v-for="c in finalClients" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="finalStatus" class="border rounded px-2 py-2">
              <option value="">All status</option>
              <option v-for="s in finalStatuses" :key="s" :value="s">{{ s }}</option>
            </select>
            <input
              v-model.trim="finalQuery"
              type="text"
              placeholder="Search code/client..."
              class="border border-amber-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            <button @click="fetchFinal" :disabled="loadingFinal"
              class="px-3 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 disabled:opacity-50">
              {{ loadingFinal ? 'Refreshing...' : 'Refresh' }}
            </button>
            <button @click="resetFinalFilters" class="px-3 py-2 border rounded-md hover:bg-gray-50">Clear</button>
          </div>
        </div>

        <div v-if="loadingFinal" class="text-gray-600">Loading final stage...</div>
        <div v-else>
          <div v-if="filteredFinal.length === 0" class="text-gray-600">No final stage records.</div>
          <!-- Mobile cards -->
          <div class="sm:hidden grid gap-2" v-else-if="filteredFinal.length > 0">
            <div v-for="row in filteredFinal" :key="row.id" class="border rounded-md p-3 bg-white shadow-sm">
              <div class="flex items-center justify-between">
                <div class="font-semibold text-gray-800">Code: {{ row.code }}</div>
                <span class="text-xs px-2 py-1 rounded-full"
                  :class="row.status && row.status.toLowerCase() === 'delivered' ? 'bg-gray-100 text-gray-700' : 'bg-emerald-100 text-emerald-700'">
                  {{ row.status || 'processing' }}
                </span>
              </div>
              <div class="text-sm text-gray-600">Client: {{ row.client || '-' }}</div>
              <div class="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>Mixed: <span class="font-semibold">{{ row.total_kg_mixed }}</span> Kg</div>
                <div>Size: <span class="font-semibold">{{ row.size }}</span> Kg</div>
                <div>Bilog: <span class="font-semibold">{{ row.bilog }}</span> Kg</div>
                <div>Sacks: <span class="font-semibold">{{ row.sacks }}</span></div>
              </div>
              <div class="text-xs text-gray-500 mt-1">Date: {{ row.date }}</div>
              <div class="mt-2 text-right">
                <button
                  :disabled="row.status && row.status.toLowerCase() === 'delivered'"
                  @click="deliverRow(row)"
                  class="px-3 py-1 rounded-md text-white"
                  :class="row.status && row.status.toLowerCase() === 'delivered' ? 'bg-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'"
                >
                  {{ row.status && row.status.toLowerCase() === 'delivered' ? 'Done' : 'Deliver' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Desktop table -->
          <div class="hidden sm:block max-h-[60vh] overflow-auto overflow-x-auto border rounded-xl shadow-sm">
            <table class="w-full min-w-[1000px] text-xs text-left text-gray-700">
              <thead class="text-xs uppercase bg-amber-700 text-white sticky top-0">
                <tr>
                  <th class="px-4 py-2">Code</th>
                  <th class="px-4 py-2">Client</th>
                  <th class="px-4 py-2">Mixed (Kg)</th>
                  <th class="px-4 py-2">Size (Kg)</th>
                  <th class="px-4 py-2">Bilog (Kg)</th>
                  <th class="px-4 py-2">Sacks</th>
                  <th class="px-4 py-2">Date</th>
                  <th class="px-4 py-2">Status</th>
                  <th class="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in filteredFinal" :key="row.id" class="border-b hover:bg-gray-50">
                  <td class="px-4 py-2">{{ row.code }}</td>
                  <td class="px-4 py-2">{{ row.client }}</td>
                  <td class="px-4 py-2">{{ row.total_kg_mixed }}</td>
                  <td class="px-4 py-2">{{ row.size }}</td>
                  <td class="px-4 py-2">{{ row.bilog }}</td>
                  <td class="px-4 py-2">{{ row.sacks }}</td>
                  <td class="px-4 py-2">{{ row.date }}</td>
                  <td class="px-4 py-2">{{ row.status }}</td>
                  <td class="px-4 py-2 text-right whitespace-nowrap">
                    <button
                      :disabled="row.status && row.status.toLowerCase() === 'delivered'"
                      @click="deliverRow(row)"
                      class="px-2 py-1 rounded-md text-white"
                      :class="row.status && row.status.toLowerCase() === 'delivered' ? 'bg-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'"
                    >
                      {{ row.status && row.status.toLowerCase() === 'delivered' ? 'Done' : 'Deliver' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </section>
    </main>
    
    <!-- Edit Modal -->
    <div v-if="isEditOpen" class="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-2">
      <div class="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <h3 class="text-lg font-semibold">Edit Failed Record</h3>
          <button @click="closeEdit" class="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <div class="p-4 grid gap-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-600">Production Code</label>
              <input type="text" class="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed" :value="editRow.stage_one_code || editRow.stage_two_code" disabled />
            </div>
            <div>
              <label class="text-xs text-gray-600">Stage</label>
              <input type="text" class="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed" :value="editRow.failed_stage_type" disabled />
            </div>
          </div>
          <div>
            <label class="text-xs text-gray-600">Remarks</label>
            <textarea v-model="editRemarks" rows="4" class="w-full border rounded px-3 py-2"></textarea>
          </div>
          <div>
            <label class="text-xs text-gray-600">Add Bilog to stock (Kg)</label>
            <input type="number" min="0" v-model.number="editBilogAdd" class="w-full border rounded px-3 py-2" placeholder="0" />
            <div class="text-xs text-gray-500 mt-1">This will add to the Bilog item current stock.</div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-2">
            <button @click="closeEdit" class="px-4 py-2 border rounded-md">Cancel</button>
            <button @click="saveEdit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirm Modal -->
    <div v-if="isDeleteOpen" class="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-2">
      <div class="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <h3 class="text-lg font-semibold">Delete Failed Record</h3>
          <button @click="closeDelete" class="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <div class="p-4">
          <p>Are you sure you want to delete this failed record? This will not affect the original Stage One/Two data.</p>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 pb-4">
          <button @click="closeDelete" class="px-4 py-2 border rounded-md">Cancel</button>
          <button @click="performDelete" :disabled="deleting" class="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

const loading = ref(false)
const error = ref('')
const failed = ref([])
const query = ref('')

const failedClient = ref('')
const failedDate = ref('')
const failedLeader = ref('')

const failedClients = computed(() => Array.from(new Set(failed.value.map(f => f.client).filter(Boolean))).sort())
const failedLeaders = computed(() => Array.from(new Set(failed.value.map(f => f.group_leader).filter(Boolean))).sort())
const failedDates = computed(() => Array.from(new Set(failed.value.map(f => f.failed_date).filter(Boolean))).sort((a,b) => new Date(b) - new Date(a)))

const filtered = computed(() => {
  const q = query.value.toLowerCase()
  if (!q && !failedClient.value && !failedDate.value && !failedLeader.value) return failed.value
  return failed.value.filter((r) => {
    const code = (r.stage_one_code || r.stage_two_code || '').toLowerCase()
    const client = (r.client || '').toLowerCase()
    const produce = (r.produce || '').toLowerCase()
    const stage = (r.failed_stage_type || '').toLowerCase()
    const leader = (r.group_leader || '').toLowerCase()
    const matchesSearch = q ? (code.includes(q) || client.includes(q) || produce.includes(q) || stage.includes(q) || leader.includes(q)) : true
    const matchesClient = failedClient.value ? r.client === failedClient.value : true
    const matchesLeader = failedLeader.value ? r.group_leader === failedLeader.value : true
    const matchesDate = failedDate.value ? r.failed_date === failedDate.value : true
    return matchesSearch && matchesClient && matchesLeader && matchesDate
  })
})

const failedCount = computed(() => filtered.value.length)

async function fetchFailed() {
  try {
    loading.value = true
    error.value = ''
    const res = await $fetch('http://localhost:5000/api/failed/get', {
      credentials: 'include'
    })
    failed.value = Array.isArray(res) ? res : []
  } catch (e) {
    error.value = 'Failed to load logs'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFailed()
  fetchStageTwo()
  fetchFinal()
})

// Stage Two table state and fetching
const loadingStageTwo = ref(false)
const stageTwo = ref([])
const stageTwoQuery = ref('')
const stageTwoClient = ref('')
const stageTwoLeader = ref('')
const stageTwoDate = ref('')

const stageTwoClients = computed(() => Array.from(new Set(stageTwo.value.map(s => s.client).filter(Boolean))).sort())
const stageTwoLeaders = computed(() => Array.from(new Set(stageTwo.value.map(s => s.group_leader).filter(Boolean))).sort())
const stageTwoDates = computed(() => Array.from(new Set(stageTwo.value.map(s => s.date).filter(Boolean))).sort((a,b) => new Date(b) - new Date(a)))

const filteredStageTwo = computed(() => {
  const q = stageTwoQuery.value.toLowerCase()
  if (!q && !stageTwoClient.value && !stageTwoLeader.value && !stageTwoDate.value) return stageTwo.value
  return stageTwo.value.filter((r) => {
    const code = (r.production_code || '').toLowerCase()
    const client = (r.client || '').toLowerCase()
    const produce = (r.produce || '').toLowerCase()
    const leader = (r.group_leader || '').toLowerCase()
    const matchesSearch = q ? (code.includes(q) || client.includes(q) || produce.includes(q) || leader.includes(q)) : true
    const matchesClient = stageTwoClient.value ? r.client === stageTwoClient.value : true
    const matchesLeader = stageTwoLeader.value ? r.group_leader === stageTwoLeader.value : true
    const matchesDate = stageTwoDate.value ? r.date === stageTwoDate.value : true
    return matchesSearch && matchesClient && matchesLeader && matchesDate
  })
})

const stageTwoCount = computed(() => filteredStageTwo.value.length)

async function fetchStageTwo() {
  try {
    loadingStageTwo.value = true
    const res = await $fetch('http://localhost:5000/api/stagetwo/get/all', {
      credentials: 'include'
    })
    stageTwo.value = Array.isArray(res) ? res : []
  } catch (e) {
    error.value = 'Failed to load stage two'
  } finally {
    loadingStageTwo.value = false
  }
}

// Final stage admin state and actions
const loadingFinal = ref(false)
const finalRows = ref([])
const finalQuery = ref('')
const finalClient = ref('')
const finalStatus = ref('')

const finalClients = computed(() => Array.from(new Set(finalRows.value.map(f => f.client).filter(Boolean))).sort())
const finalStatuses = computed(() => Array.from(new Set(finalRows.value.map(f => f.status).filter(Boolean))).sort())

const filteredFinal = computed(() => {
  const q = finalQuery.value.toLowerCase()
  if (!q && !finalClient.value && !finalStatus.value) return finalRows.value
  return finalRows.value.filter((r) => {
    const code = String(r.code || '').toLowerCase()
    const client = String(r.client || '').toLowerCase()
    const status = String(r.status || '').toLowerCase()
    const matchesSearch = q ? (code.includes(q) || client.includes(q)) : true
    const matchesClient = finalClient.value ? r.client === finalClient.value : true
    const matchesStatus = finalStatus.value ? status === String(finalStatus.value).toLowerCase() : true
    return matchesSearch && matchesClient && matchesStatus
  })
})

const finalCount = computed(() => filteredFinal.value.length)

async function fetchFinal() {
  try {
    loadingFinal.value = true
    const res = await $fetch('http://localhost:5000/api/finalstage/get/all', {
      credentials: 'include'
    })
    finalRows.value = Array.isArray(res) ? res : []
  } catch (e) {
    // noop
  } finally {
    loadingFinal.value = false
  }
}

async function deliverRow(row) {
  try {
    if (!row || (row.status && row.status.toLowerCase() === 'delivered')) return
    await $fetch(`http://localhost:5000/api/finalstage/update/${row.id}`, {
      method: 'PUT',
      body: { status: 'delivered' },
      credentials: 'include'
    })
    await fetchFinal()
  } catch (e) {
    // noop
  }
}

// Edit/Delete state and actions
const isEditOpen = ref(false)
const isDeleteOpen = ref(false)
const editRow = ref({})
const editRemarks = ref('')
const editBilogAdd = ref(0)
const saving = ref(false)
const deleting = ref(false)

function openEdit(row) {
  editRow.value = row
  editRemarks.value = row.remarks || ''
  editBilogAdd.value = 0
  isEditOpen.value = true
}
function closeEdit() {
  isEditOpen.value = false
}
async function saveEdit() {
  try {
    saving.value = true
    await $fetch(`http://localhost:5000/api/failed/update/${editRow.value.id}` , {
      method: 'PUT',
      body: { remarks: editRemarks.value },
      credentials: 'include'
    })

    if (Number(editBilogAdd.value) > 0) {
      // Add to Bilog stock
      await $fetch('http://localhost:5000/api/items/update-delta', {
        method: 'PUT',
        body: { name: 'bilog', delta: Number(editBilogAdd.value) },
        credentials: 'include'
      })
      // Fetch and show new current stock
      const res = await $fetch('http://localhost:5000/api/items/get/items', {
        method: 'POST',
        body: { name: 'bilog' },
        credentials: 'include'
      })
      const current = Array.isArray(res) && res[0] ? res[0].current_stock : null
      if (current != null) {
        alert(`Bilog stock updated. New current stock: ${current}`)
      }
    }
    await fetchFailed()
    closeEdit()
  } catch (e) {
    // noop
  } finally {
    saving.value = false
  }
}

function confirmDelete(row) {
  editRow.value = row
  isDeleteOpen.value = true
}
function closeDelete() {
  isDeleteOpen.value = false
}
async function performDelete() {
  try {
    deleting.value = true
    await $fetch(`http://localhost:5000/api/failed/delete/${editRow.value.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    await fetchFailed()
    closeDelete()
  } catch (e) {
    // noop
  } finally {
    deleting.value = false
  }
}

function resetFailedFilters() {
  failedClient.value = ''
  failedDate.value = ''
  failedLeader.value = ''
  query.value = ''
}

function resetStageTwoFilters() {
  stageTwoClient.value = ''
  stageTwoLeader.value = ''
  stageTwoDate.value = ''
  stageTwoQuery.value = ''
}

function resetFinalFilters() {
  finalClient.value = ''
  finalStatus.value = ''
  finalQuery.value = ''
}
</script>
