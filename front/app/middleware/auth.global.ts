export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/')) return;
  if (to.path === '/') return;

  interface UserProfile {
    id?: number;
    username: string;
    role: string;
  }

  try {
    const user = await $fetch<UserProfile>('http://localhost:5000/api/auth/profile', {
      credentials: 'include',
    });

    const isAdmin = !!user && typeof user.role === 'string' && user.role.toLowerCase() === 'admin';
    if (!isAdmin) {
      // Allow production routes (including logs) for non-admin users
      if (!to.path.startsWith('/production')) {
        return navigateTo('/production');
      }
      return;
    }
  } catch (error) {
    // On auth error, ensure logout and send to login page
    try {
      await $fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    if (to.path !== '/') {
      return navigateTo('/');
    }
  }
});
