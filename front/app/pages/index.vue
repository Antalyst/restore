<template>
  <div class="min-h-screen flex">
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="text-center mb-8">
            <div class="mx-auto w-20 rounded-full flex items-center justify-center mb-4">
              <img src="/logo/logo.png" alt="Logo" class="">
            </div>
            <p class="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <div v-if="loginError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm text-center">{{ loginError }}</p>
          </div>

          <form @submit.prevent="login" class="space-y-6">
            <div class="space-y-1">
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <div class="relative">
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  required
                  placeholder="Enter your username"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Enter your password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                >
                  <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <a href="#" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Secure Admin Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <img
        :src="imageSrc"
        alt="background"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-white text-center">
          <h1 class="text-4xl font-bold mb-4">Welcome Back</h1>
          <p class="text-xl opacity-90">Manage your inventory with ease</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import imageSrc from '/bg/image.png'

const showPassword = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')
const loading = ref(false)

watch([username, password], () => {
  loginError.value = ''
})

onMounted(async () => {
  try {
    const config = useRuntimeConfig()
    const user = await $fetch(`${config.public.apiBase}/auth/profile`, {
      credentials: 'include',
    })

    const role = user?.role?.toLowerCase()

    if (!role === 'admin') {
        return navigateTo('/production')
    }else{
        return navigateTo('/admin/dashboard')
    }
  } catch (e) {

  }
})

async function login() {
  try {
    loading.value = true
    loginError.value = ''

    const res = await $fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
      credentials: 'include',
    })

    const user = await $fetch('http://localhost:5000/api/auth/profile', {
      credentials: 'include',
    })

    if (user?.role?.toLowerCase() === 'admin') {
      await navigateTo('/admin/dashboard')
    } else {
      await navigateTo('/production')
    }
  } catch (error) {
    if (error.status === 401) {
      loginError.value = 'Invalid username or password'
    } else {
      loginError.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}


const reset = () => {
  username.value = ''
  password.value = ''
}
</script>