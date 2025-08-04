<template>
	<div class="p-6 w-full font-sans bg-gray-50 text-gray-800">
		<div class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
			<h1 class="text-3xl font-semibold text-[#00796b]">Adjustment Logs</h1>
			<div class="flex items-center gap-4 w-full sm:w-auto">
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search remarks..."
					class="w-full sm:w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00796b] transition duration-150 ease-in-out"
				/>
				<select
					v-model="selectedItem"
					class="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00796b] transition duration-150 ease-in-out"
				>
					<option value="">All Items</option>
					<option v-for="item in uniqueItems" :key="item" :value="item">
						{{ item }}
					</option>
				</select>
			</div>
		</div>

		<div class="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-100">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
						>
							Item Name
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
						>
							Remarks
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
						>
							Date
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
						>
							Action
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-if="filteredLogs.length === 0">
						<td colspan="4" class="px-6 py-4 text-center text-gray-500">
							No matching adjustment logs found.
						</td>
					</tr>
					<tr v-else v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-50 transition duration-150 ease-in-out">
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
							{{ log.item_name || 'N/A' }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
							{{ log.description }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
							{{ new Date(log.date).toLocaleDateString() }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
							<button
								@click="showDetails(log)"
								class="text-[#00796b] hover:text-[#00796b]/80 transition duration-150 ease-in-out"
							>
								View Details
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div
			v-if="showModal"
			class="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center p-4 transition-opacity duration-300"
		>
			<div
				class="relative bg-white text-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6 mx-auto transform transition-transform duration-300 scale-95 hover:scale-100"
			>
				<h3 class="text-2xl font-bold text-[#00796b] mb-4">Adjustment Details</h3>
				<div v-if="selectedLog" class="max-h-[75vh] overflow-y-auto pr-2">
					<div class="mb-4 space-y-2">
						<p><strong class="font-semibold">Item Name:</strong> {{ selectedLog.item_name || 'N/A' }}</p>
						<p><strong class="font-semibold">Adjusted By:</strong> {{ selectedLog.user_name || 'N/A' }}</p>
						<p><strong class="font-semibold">Remarks:</strong> {{ selectedLog.description }}</p>
						<p>
							<strong class="font-semibold">Date:</strong>
							{{ new Date(selectedLog.date).toLocaleDateString() }}
						</p>
						<div v-if="selectedLog.attachment" class="mt-4">
							<p class="font-bold mb-2">Attachment:</p>
							<img
								:src="selectedLog.attachment"
								alt="Attachment"
								class="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
							/>
							<a
								:href="selectedLog.attachment"
								target="_blank"
								class="mt-2 block text-center text-[#00796b] hover:underline"
								>View Full Size</a
							>
						</div>
					</div>
					<div class="text-right mt-6">
						<button
							@click="closeModal"
							class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold transition duration-150 ease-in-out"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

definePageMeta({
	layout: "admin",
});

const logs = ref([]);
const searchQuery = ref('');
const selectedItem = ref('');
const showModal = ref(false);
const selectedLog = ref(null);

const fetchLogs = async () => {
	try {
		console.log("fetching adjustment logs");
		const response = await $fetch("http://localhost:5000/api/remarks/get");
		console.log("received data:", response);

		if (response.success) {
			logs.value = response.result;
		} else {
			console.error("failed to fetch logs:", response.message);
		}
	} catch (error) {
		console.error("error fetching logs:", error.message);
	}
};

const uniqueItems = computed(() => {
	const itemNames = new Set(logs.value.map(log => log.item_name).filter(name => name));
	return [...itemNames].sort();
});

const filteredLogs = computed(() => {
	return logs.value.filter(log => {
		const matchesSearch = log.description.toLowerCase().includes(searchQuery.value.toLowerCase());
		const matchesFilter = !selectedItem.value || log.item_name === selectedItem.value;
		return matchesSearch && matchesFilter;
	});
});

const showDetails = (log) => {
	selectedLog.value = log;
	showModal.value = true;
};

const closeModal = () => {
	showModal.value = false;
	selectedLog.value = null;
};

onMounted(() => {
	fetchLogs();
});
</script>

<style lang="sass" scoped></style>
