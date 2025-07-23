
<template>
  <div class="w-screen h-screen overflow-hidden relative">
    <img
      :src="imageSrc"
      alt="background"
      class="w-full h-full object-cover absolute inset-0"
    />
    <div class="absolute inset-0 flex justify-start items-center w-[35%] bg-white/80 shadow-lg rounded-r-2xl">
      <div class="flex items-center flex-col w-full py-20">
        <div class="w-60 flex items-center flex-col gap-2">
          <img src="/logo/logo.png" alt="">
          <h1 class="text-2xl font-bold">Sign In</h1>
          <h1 class="text-sm font-bold">To Admin Account</h1>
        </div>
        <form class="flex flex-col w-full px-10 mt-10 space-y-6" @submit.prevent="login">
          <div class="flex flex-col">
            <label for="username" class="mb-2 font-medium">Username</label>
            <input
                v-model="username"
                type="text"
                placeholder="Enter your username"
              class="border-b-2 border-gray-400 outline-none rounded-sm h-12 p-2 focus:border-blue-500"
            />
          </div>
          <div class="flex flex-col">
            <label for="password" class="mb-2 font-medium">Password</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="border-b-2 border-gray-400 outline-none rounded-sm h-12 p-2 focus:border-blue-500"
            />
          </div>
          <div class="flex items-center justify-end mt-2 space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              v-model="showPassword"
              class="accent-blue-600"
            />
            <label for="showPassword" class="text-sm text-gray-600">Show Password</label>
          </div>
          <div>
            <p>{{}}</p>
          </div>

          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md h-12"
          >
            Login
          </button>
          <a href="" class="text-sm text-blue-600 text-center">Forgot password
          </a>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import imageSrc from '/bg/image.png'
const showPassword = ref(false)
const  username = ref("")
const  password = ref("")
const loginError = ref("")

definePageMeta({
  middleware:"admin-only"
})

async function login() {
  try {
    const res = await $fetch(`http://localhost:5000/api/auth/login`, {
      method: "POST",
      body: {
        username: username.value,
        password: password.value
      }
    });
    if (res.role.toLowerCase() === 'admin') {
      await navigateTo('/admin/dashboard');
    } else {
      alert('Invalid login. Admin access required.');
    }
  } catch (err) {
    loginError.value = "Invalid credential"
  }
}

const reset =()=>{
  username.value=""
  password.value=""
}


</script>
