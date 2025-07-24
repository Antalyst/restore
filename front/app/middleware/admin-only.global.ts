export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) {
    return;
  }
  if (to.path === '/admin/login') {
    return;
  }
  try {
    const user = await $fetch('http://localhost:5000/api/auth/profile', {
      credentials: 'include',
    });
    if (!user || user.role?.toLowerCase() !== 'admin') {
      await $fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {});
      return navigateTo('/admin/login');
    }
    console.log('Admin authenticated:', user.username);
  } catch (error) {
    console.error(error);
    await $fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    return navigateTo('/admin/login');
  }
});