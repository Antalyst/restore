<template>
  <div class="min-h-screen flex flex-col md:flex-row gap-1">
    <header class="p-4 flex flex-col md:justify-between gap-2 bg-stone-100 m-2 rounded-md border-l-none w-full md:w-64 md:sticky md:top-0 md:h-[calc(100vh-1rem)]">
      <div>
        <h1 class="text-teal-800 text-center text-3xl font-bold pb-4" >SSSE</h1>
      </div>

      <div class="flex-1">
        <aside class="flex flex-row md:flex-col md:space-y-2 space-x-2 md:space-x-0 text-md w-full md:w-auto">
          <nuxt-link to="/production" class="p-2 pl-4 text-md rounded-md md:rounded-r-full w-full md:w-auto">Add Production</nuxt-link>
          <nuxt-link to="/production/logs/" class="p-2 pl-4 text-md rounded-md md:rounded-r-full w-full md:w-auto">Logs</nuxt-link>
        </aside>
      </div>
      <div class="mt-2 md:mt-0">
        <button @click="logout" class="text-[#00796b] px-6 py-2 border-[#00796b] border rounded-md w-full md:w-auto flex items-center justify-center gap-2">
          <Icon name="mdi:logout" />Logout
        </button>
      </div>
    </header>
    <div class="flex-1 m-2">
      <slot />
    </div>
  </div>
</template>
<script setup>

const person = ref([]);

onMounted(async ()=>{
  try{
    person.value = await $fetch(`http://localhost:5000/api/auth/profile`, {
      credentials: 'include'
    })
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