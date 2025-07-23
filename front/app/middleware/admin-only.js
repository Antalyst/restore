export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/admin/login') return;

  const token = useCookie('token');

  if (!token.value) {
    return navigateTo('/admin/login');
  }

  try {
    const payload = JSON.parse(atob(token.value.split('.')[1]));
    if (payload.role !== 'admin') {
      return navigateTo('/admin/login'); 
    }
  } catch (err) {
    console.error('Invalid token', err);
    return navigateTo('/admin/login');
  }
});
