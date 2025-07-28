<template>
  <div class="min-h-screen  flex gap-4">
    <header class=" p-4 flex flex-col gap-2">
      <div>
          <img src="/logo/logo.png" alt="Logo" class="w-24 mr-8  my-4 ">
      </div>

      <div class="flex-1">
        <aside class=" flex flex-col space-y-2 text-sm">
          <nuxt-link to="/admin/dashboard" class="p-2 pl-4 pr-16 text-md rounded-full "> Dashboard</nuxt-link>
          <nuxt-link to="/admin/products" class="p-2 pl-4 pr-16 text-md rounded-full "> <icon name="mdi:admin-generic" class="" /> Products</nuxt-link>
          <nuxt-link to="/admin/categories" class="p-2 pl-4 pr-16 text-md rounded-full "> <icon name="mdi:category" class="" /> Categories</nuxt-link>
          <nuxt-link to="/admin/orders" class="p-2 pl-4 pr-16 text-md rounded-full "> <icon name="mdi:admin-post" class="" /> Orders</nuxt-link>
          <nuxt-link to="/admin/users" class="p-2 pl-4 pr-16 text-md rounded-full "> Users</nuxt-link>
        </aside>
      </div>
      <div class="mt-4">
      <h1><icon name="mdi:admin-generic" class="" /></h1>
        <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">  <icon name="mdi:admin-users" class="" />Logout</button>
      </div>
    </header>
    <main class="w-full ">
      <div class="w-full ">
        <div
          class="w-full  border-2 p-2 "
        >
          <div>
            <input type="text" class="border-2 w-full">
          </div>
          <div>
            
          </div>
        </div>
      </div>
      <div>
        <slot/>
      </div>
    </main>
    
  </div>
</template>
<script setup>

const person = ref([]);

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
  background-color: #e0f7fa;
  color: #00796b;
}
</style>