<template>
  <div class="min-h-screen bg-[#121212] text-white flex">
    
    <!-- 🧭 Sidebar -->
    <aside class="w-64 bg-[#1E1E1E] shadow-md hidden md:block">
      <div class="p-6 text-2xl font-bold border-b border-gray-700">
        AdminPanel
      </div>
      <nav class="mt-4 space-y-2">
        <NuxtLink to="/admin" class="block px-6 py-2 hover:bg-[#2A2A2A] rounded">
          🏠 Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/users" class="block px-6 py-2 hover:bg-[#2A2A2A] rounded">
          👥 Users
        </NuxtLink>
        <NuxtLink to="/admin/settings" class="block px-6 py-2 hover:bg-[#2A2A2A] rounded">
          ⚙️ Settings
        </NuxtLink>
      </nav>
    </aside>

    <!-- 📄 Main content -->
    <div class="flex-1 flex flex-col">
      
      <!-- 🔝 Header -->
      <header class="bg-[#1C1C1C] px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <h1 class="text-xl font-semibold">Welcome, Admin</h1>
        <button class="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition">Logout</button>
      </header>

      <!-- 📦 Page slot -->
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
