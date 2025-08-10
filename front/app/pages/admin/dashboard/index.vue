<template>
  <div class="bg-stone-100 w-full my-2 rounded-md p-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <h1 class="text-2xl font-bold text-[#00796b]">Dashboard</h1>
      <div class="flex items-center gap-3">
        <div class="px-3 py-2 rounded-md bg-white border text-sm">
          <span class="text-gray-500">Total Items:</span>
          <span class="ml-2 font-semibold">{{ items.length }}</span>
        </div>
        <div class="px-3 py-2 rounded-md bg-white border text-sm" :class="lowStockCount > 0 ? 'border-red-300' : ''">
          <span class="text-gray-500">Low Stock:</span>
          <span class="ml-2 font-semibold" :class="lowStockCount > 0 ? 'text-red-600' : ''">{{ lowStockCount }}</span>
        </div>
      </div>
    </div>

    <div class="mb-3 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search items..."
        class="w-full sm:w-80 p-2 border border-gray-300 rounded-md bg-white"
      />
      <div class="text-sm text-gray-500">Showing {{ filteredItems.length }} of {{ items.length }}</div>
    </div>

    <div v-if="loading" class="p-6 text-center text-gray-600">Loading items…</div>
    <div v-else class="overflow-x-auto">
      <table class="w-full bg-white rounded-md overflow-hidden">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-[#00796b] uppercase">Image</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-[#00796b] uppercase">Name</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-[#00796b] uppercase">Category</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-[#00796b] uppercase">Unit</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-[#00796b] uppercase">Current Stock</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-[#00796b] uppercase">Min Stock</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-[#00796b] uppercase">Max Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredItems"
            :key="item.id"
            :class="isLowStock(item) ? 'bg-red-200' : ''"
            class="border-b hover:bg-gray-200"
          >
            <td class="px-4 py-2">
              <div class="flex items-center">
                <img v-if="item.image_path" :src="item.image_path" :alt="item.name" class="h-10 w-10 rounded object-cover border" />
                <div v-else class="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Img</div>
              </div>
            </td>
            <td class="px-4 py-2">
              <div class="font-medium text-gray-800">{{ item.name }}</div>
            </td>
            <td class="px-4 py-2 text-gray-700">{{ item.category_name }}</td>
            <td class="px-4 py-2 text-gray-700">{{ item.unit_name }}</td>
            <td class="px-4 py-2">
              <span :class="isLowStock(item) ? 'text-red-700 font-semibold' : 'text-gray-800'">{{ item.current_stock }}</span>
              <span v-if="isLowStock(item)" class="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">LOW</span>
            </td>
            <td class="px-4 py-2">
              <span class="inline-flex px-2 py-0.5 text-xs rounded-full" :class="isLowStock(item) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
                {{ item.min_stock_level }}
              </span>
            </td>
            <td class="px-4 py-2 text-gray-800 text-center">{{ item.max_stock_level }}</td>
          </tr>
          <tr v-if="filteredItems.length === 0">
            <td colspan="7" class="px-4 py-6 text-center text-gray-500">No items found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
</template>

<script setup>
const items = ref([])
const loading = ref(false)
const searchQuery = ref('')

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(i =>
    (i.name || '').toLowerCase().includes(q) ||
    (i.category_name || '').toLowerCase().includes(q) ||
    (i.unit_name || '').toLowerCase().includes(q)
  )
})

const isLowStock = (item) => {
  const current = Number(item?.current_stock ?? 0)
  const minLevel = Number(item?.min_stock_level ?? 0)
  return current <= minLevel
}

const lowStockCount = computed(() => filteredItems.value.filter(isLowStock).length)

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch('http://localhost:5000/api/items/get', { credentials: 'include' })
    items.value = Array.isArray(res?.result) ? res.result : []
  } catch (error) {
    console.error('Failed to fetch items:', error)
    items.value = []
  } finally {
    loading.value = false
  }
})
definePageMeta({ layout: 'admin' })
</script>