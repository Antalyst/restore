<script setup>
import imageSrc from '/bg/image.png'
</script>

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
        <form class="flex flex-col w-full px-10 mt-10 space-y-6">
          <div class="flex flex-col">
            <label for="username" class="mb-2 font-medium">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              class="border-b-2 border-gray-400 outline-none rounded-sm h-12 p-2 focus:border-blue-500"
            />
          </div>
          <div class="flex flex-col">
            <label for="password" class="mb-2 font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              class="border-b-2 border-gray-400 outline-none rounded-sm h-12 p-2 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md h-12"
          >
            Login
          </button>
          <p class="text-sm text-gray-600 text-center">
            Don't have an account?
            <a href="#" class="text-blue-600 font-semibold hover:underline">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
