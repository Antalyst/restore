export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/')) return;
  
  if (to.path === '/'   ) return;

  try {
    const user = await $fetch('http://localhost:5000/api/auth/profile', {
      credentials: 'include',
    });
    if (!user || user.role?.toLowerCase() !== 'admin') {
      if (to.path !== '/production') {
        return navigateTo('/production');
      }
    }
    console.log('User Authenticated:', user.username);
  } catch (error) {
    console.error(error);
    await $fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    if (to.path !== '/') {
      return navigateTo('/');
    }
  }
});
