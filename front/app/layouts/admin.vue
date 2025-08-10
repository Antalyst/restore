<template>
  <div class="min-h-screen flex flex-col md:flex-row gap-1">

    <div class="md:hidden flex items-center justify-between bg-stone-100 m-2 rounded-md p-3">
      <button @click="menuOpen = true" aria-label="Open menu" class="p-2 border rounded-md text-[#00796b] border-[#00796b]">
        <div class="grid grid-cols-1 gap-1">
          <div class="bg-teal-600 px-4 h-1 rounded-full"></div>
          <div class="bg-teal-600 px-4 h-1 rounded-full"></div>
          <div class="bg-teal-600 px-4 h-1 rounded-full"></div>
        </div>
      </button>
      <img src="/logo/logo.png" alt="Logo" class="h-8" />
      <button @click="logout" class="text-[#00796b] px-3 py-2 border border-[#00796b] rounded-md">Logout</button>
    </div>
    <div v-if="menuOpen" class="fixed inset-0 bg-black/30 z-30 md:hidden" @click="menuOpen = false"></div>
    <header
      :class="[
        'p-4 flex flex-col gap-2 bg-stone-100 m-2 rounded-md border-l-none z-40',
        'transform transition-transform duration-200',
        menuOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed inset-y-0 left-0 w-64',
        'md:static md:translate-x-0 md:w-72 md:z-auto'
      ]"
    >
      <div class="hidden md:block">
        <img src="/logo/logo.png" alt="Logo" class="w-28 mr-8 my-4" />
      </div>

      <div class="flex-1 overflow-y-auto">
        <aside class="flex flex-col space-y-2 text-md">
          <nuxt-link @click="menuOpen = false" to="/admin/dashboard" class="p-2 pl-4 text-md rounded-r-full"> Dashboard</nuxt-link>
          <nuxt-link @click="menuOpen = false" to="/admin/products" class="p-2 pl-4 text-md rounded-r-full"> <Icon name="mdi:plus-box-outline" />Add Supply</nuxt-link>
          <div class="flex flex-col">
            <nuxt-link @click="menuOpen = false" to="/admin/adjustSupply" class="p-2 pl-4 text-md rounded-r-full"> <Icon name="mdi:view-grid-outline" /> <h1>Adjust Supply</h1></nuxt-link>
            <div class="ml-5 py-2 m-2 border-l-2 border-[#00796b] w-[160px]">
              <nuxt-link @click="menuOpen = false" to="/admin/adjustlogs" class="p-2 pl-4 text-sm rounded-r-full">Adjust Logs</nuxt-link>
            </div>
          </div>
          <nuxt-link @click="menuOpen = false" to="/admin/settings" class="p-2 pl-4 text-md"> <Icon name="mdi:cog-outline" /> Settings</nuxt-link>
        </aside>
      </div>

      <div class="hidden md:block">
        <button @click="logout" class="text-[#00796b] px-6 py-2 border-[#00796b] border rounded-md">
          <Icon name="mdi:logout" />Logout
        </button>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
<script setup>

const person = ref([]);
const menuOpen = ref(false);

const route = useRoute();
watch(
  () => route.fullPath,
  () => { menuOpen.value = false; }
);

onMounted(async ()=>{
  try{
    person.value = await $fetch(`http://localhost:5000/api/auth/profile`)
    console.log(person.value)
  }catch(e){
    console.log(e)
  }
})

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
</script>

<style>
.router-link-active {
  position: relative;
  border: 1px solid #00796b;
  color: #00796b;
  width: 100%;
  
}

.router-link-active::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 45px;
  background-color: #00796b;
  right: 5px; 
  top: 50%;
  transform: translateY(-50%);
  border-radius: 0 5px 5px 0;
 animation: slideIn 0.3s forwards ease-in-out;
}

@keyframes slideIn {
  from {
    left: -12px;
    opacity: 0;
  }
  to {
    left: 0;
    opacity: 1;
  }
}

</style>