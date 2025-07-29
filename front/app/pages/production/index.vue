<template>
    <div>
       
    </div>
</template>

<script setup>
const user = ref(null)

onMounted(async () => {
  try {
    user.value = await $fetch('http://localhost:5000/api/auth/profile', {
      credentials: 'include',
    })
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
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

definePageMeta({
  layout:"admin"
})

</script>