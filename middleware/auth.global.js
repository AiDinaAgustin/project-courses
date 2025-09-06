export default defineNuxtRouteMiddleware((to) => {
  const authToken = useCookie('auth_token');

  const protectedRoutes = ['/dashboard', '/categories', '/courses'];

  if (authToken.value && to.path === '/login') {
    return navigateTo('/dashboard');
  }

  if (
    !authToken.value &&
    protectedRoutes.some(path => to.path === path || to.path.startsWith(path + '/'))
  ) {
    return navigateTo('/login');
  }
});