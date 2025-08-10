<template>
  <div class="bg-stone-100 w-full my-2 rounded-md p-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <h1 class="text-2xl font-bold text-[#00796b]">Settings</h1>
      <button @click="logout" class="text-[#00796b] px-4 py-2 border border-[#00796b] rounded-md">Logout</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Units Card -->
      <div class="bg-white rounded-md p-4 border">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-800">Units</h2>
          <div class="text-sm text-gray-500">Total: {{ filteredUnits.length }}</div>
        </div>

        <div class="flex gap-2 mb-3">
          <input
            v-model="unitName"
            type="text"
            placeholder="Unit name (e.g., kg, pcs)"
            class="flex-1 p-2 border border-gray-300 rounded-md"
            @keydown.enter.prevent="addUnit"
          />
          <button
            @click="addUnit"
            :disabled="addingUnit || !unitName.trim()"
            class="px-4 py-2 rounded-md text-white"
            :class="addingUnit || !unitName.trim() ? 'bg-gray-400' : 'bg-[#00796b] hover:bg-[#006459]'"
          >
            {{ addingUnit ? 'Adding…' : 'Add' }}
          </button>
        </div>
        <div v-if="unitMessage" :class="unitMessageType === 'error' ? 'text-red-600' : 'text-green-600'" class="text-sm mb-2">{{ unitMessage }}</div>

        <input v-model="unitSearch" type="text" placeholder="Search units…" class="w-full p-2 border border-gray-300 rounded-md mb-3" />

        <div class="min-h-20 max-h-72 overflow-auto border rounded-md p-2 bg-gray-50">
          <div v-if="loadingUnits" class="text-sm text-gray-500 p-2">Loading units…</div>
          <div v-else-if="filteredUnits.length === 0" class="text-sm text-gray-500 p-2">No units found</div>
          <ul v-else class="flex flex-wrap gap-2">
            <li v-for="u in filteredUnits" :key="u.id" class="px-3 py-1 rounded-full bg-white border text-sm text-gray-700">
              {{ u.name }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Categories Card -->
      <div class="bg-white rounded-md p-4 border">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-800">Categories</h2>
          <div class="text-sm text-gray-500">Total: {{ filteredCategories.length }}</div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <input v-model="categoryName" type="text" placeholder="Category name" class="p-2 border border-gray-300 rounded-md sm:col-span-1" />
          <input v-model="categoryCode" type="text" placeholder="Code (optional)" class="p-2 border border-gray-300 rounded-md sm:col-span-1" />
          <button
            @click="addCategory"
            :disabled="addingCategory || !categoryName.trim()"
            class="px-4 py-2 rounded-md text-white sm:col-span-1"
            :class="addingCategory || !categoryName.trim() ? 'bg-gray-400' : 'bg-[#00796b] hover:bg-[#006459]'"
          >
            {{ addingCategory ? 'Adding…' : 'Add Category' }}
          </button>
        </div>
        <div v-if="categoryMessage" :class="categoryMessageType === 'error' ? 'text-red-600' : 'text-green-600'" class="text-sm mb-2">{{ categoryMessage }}</div>

        <input v-model="categorySearch" type="text" placeholder="Search categories…" class="w-full p-2 border border-gray-300 rounded-md mb-3" />

        <div class="min-h-20 max-h-72 overflow-auto border rounded-md bg-gray-50">
          <table class="w-full text-sm">
            <thead class="bg-gray-100 border-b">
              <tr>
                <th class="text-left px-3 py-2 text-gray-600">Name</th>
                <th class="text-left px-3 py-2 text-gray-600">Code</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingCategories">
                <td colspan="2" class="px-3 py-3 text-gray-500">Loading categories…</td>
              </tr>
              <tr v-else-if="filteredCategories.length === 0">
                <td colspan="2" class="px-3 py-3 text-gray-500">No categories found</td>
              </tr>
              <tr v-else v-for="c in filteredCategories" :key="c.id" class="border-b">
                <td class="px-3 py-2 text-gray-800">{{ c.name }}</td>
                <td class="px-3 py-2 text-gray-600">{{ c.code || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// State
const units = ref([])
const categories = ref([])

const unitName = ref('')
const unitSearch = ref('')
const addingUnit = ref(false)
const loadingUnits = ref(false)
const unitMessage = ref('')
const unitMessageType = ref('success')

const categoryName = ref('')
const categoryCode = ref('')
const categorySearch = ref('')
const addingCategory = ref(false)
const loadingCategories = ref(false)
const categoryMessage = ref('')
const categoryMessageType = ref('success')

// Computed filters
const filteredUnits = computed(() => {
  const q = unitSearch.value.trim().toLowerCase()
  if (!q) return units.value
  return units.value.filter(u => (u.name || '').toLowerCase().includes(q))
})

const filteredCategories = computed(() => {
  const q = categorySearch.value.trim().toLowerCase()
  if (!q) return categories.value
  return categories.value.filter(c =>
    (c.name || '').toLowerCase().includes(q) ||
    (c.code || '').toLowerCase().includes(q)
  )
})

// Fetchers
async function fetchUnits() {
  loadingUnits.value = true
  try {
    const res = await $fetch('http://localhost:5000/api/units/get', { credentials: 'include' })
    units.value = Array.isArray(res) ? res : []
  } catch (e) {
    console.error(e)
  } finally {
    loadingUnits.value = false
  }
}

async function fetchCategories() {
  loadingCategories.value = true
  try {
    const res = await $fetch('http://localhost:5000/api/category/get', { credentials: 'include' })
    categories.value = Array.isArray(res) ? res : []
  } catch (e) {
    console.error(e)
  } finally {
    loadingCategories.value = false
  }
}

// Actions
const addUnit = async () => {
  if (!unitName.value.trim()) return
  addingUnit.value = true
  unitMessage.value = ''
  try {
    await $fetch('http://localhost:5000/api/units/add', {
      method: 'POST',
      body: { name: unitName.value.trim() },
      credentials: 'include',
    })
    unitMessageType.value = 'success'
    unitMessage.value = 'Unit added'
    unitName.value = ''
    await fetchUnits()
  } catch (error) {
    unitMessageType.value = 'error'
    unitMessage.value = 'Failed to add unit'
    console.error('Error adding unit:', error)
  } finally {
    addingUnit.value = false
  }
}

const addCategory = async () => {
  if (!categoryName.value.trim()) return
  addingCategory.value = true
  categoryMessage.value = ''
  try {
    await $fetch('http://localhost:5000/api/category/add', {
      method: 'POST',
      body: { name: categoryName.value.trim(), code: categoryCode.value.trim() },
      credentials: 'include',
    })
    categoryMessageType.value = 'success'
    categoryMessage.value = 'Category added'
    categoryName.value = ''
    categoryCode.value = ''
    await fetchCategories()
  } catch (error) {
    categoryMessageType.value = 'error'
    categoryMessage.value = 'Failed to add category'
    console.error('Error adding category:', error)
  } finally {
    addingCategory.value = false
  }
}

// Logout (used by header button)
async function logout() {
  try {
    await $fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout failed:', error)
    await navigateTo('/admin/login')
  }
}

onMounted(async () => {
  await Promise.all([fetchUnits(), fetchCategories()])
})

definePageMeta({
  layout: 'admin',
})
</script>
