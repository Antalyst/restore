<template>
  <div class="min-h-screen  flex gap-1">
    <header class=" p-4 flex flex-col gap-2 bg-stone-100 m-2 rounded-md border-l-none ">
      <div>
          <img src="/logo/logo.png" alt="Logo" class="w-28 mr-8  my-4 ">
      </div>

      <div class="flex-1">
        <aside class=" flex flex-col space-y-2 text-md">
          <nuxt-link to="/admin/dashboard" class="p-2 pl-4 pr-16 text-md  rounded-r-full "> Dashboard</nuxt-link>
          <nuxt-link to="/admin/products" class="p-2 pl-4 pr-16 text-md  rounded-r-full "> <icon name="mdi:admin-generic" class="" /> Products</nuxt-link>
          <nuxt-link to="/admin/categories" class="p-2 pl-4 pr-16 text-md  "> <icon name="mdi:category" class="" /> Categories</nuxt-link>
          <nuxt-link to="/admin/orders" class="p-2 pl-4 pr-16 text-md  "> <icon name="mdi:admin-post" class="" /> Orders</nuxt-link>
          <nuxt-link to="/admin/users" class="p-2 pl-4 pr-16 text-md  "> Users</nuxt-link>
        </aside>
      </div>
      <div class="">
        <button @click="logout" class=" text-[#00796b] px-6 py-2  border-[#00796b] border rounded-md">  <icon name="mdi:admin-users" class="" />Logout</button>
      </div>
    </header>
    <slot />
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
  border: 1px solid  #00796b;
  color: #00796b;

}
.router-link-active::before{
  content: "";
  position: absolute;
  width: 10px;
  height: 45px;
  background-color: #00796b;
  left: 17px;
  border-radius: 0 5px 5px 0;
  margin: -11px 0  ;
}


</style>