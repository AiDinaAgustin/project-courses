<script setup>
import { onMounted } from 'vue';
import { useFlowbite } from '~/composables/useFlowbite';
import { ref } from 'vue';
import { useAuthApi } from '../../composables/useAuth';
import { initFlowbite } from 'flowbite';
import { useRouter } from 'vue-router';
import { navigateTo, useCookie } from 'nuxt/app';

onMounted(() => {
    useFlowbite(() => {
        initFlowbite();
    });
});

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const authApi = useAuthApi();

const handleSubmit = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      const authData = {
        name: name.value,
        email : email.value,
        password : password.value,
        password_confirmation: confirmPassword.value
      };

        const response = await authApi.register(authData);
        const tokenCookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 1 // 1 day
        });

        tokenCookie.value = response.token || response.access_token;

        const nameCookie = useCookie('name', {
          maxAge: 60 * 60 * 24 * 1 // 1 day
        });

        nameCookie.value = response.user?.name || '';

        const emailCookie = useCookie('email', {
          maxAge: rememberMe.value ? 60 * 60 * 24 * 1 : undefined // 1 days if rememberMe is true
        });

        emailCookie.value = response.user?.email || '';

        navigateTo('/dashboard');
    } catch (error) {
        errorMessage.value = error.message || 'Gagal registrasi, silakan coba lagi';
        console.error('error register:', error);
    } finally {
        isLoading.value = false;
    }
}

</script>

<template>


<form class="max-w-md mx-auto" @submit.prevent="handleSubmit">
    <div v-if="errorMessage" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
    {{ errorMessage }}
  </div>
  <div class="mb-5">
    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
    <input type="name" id="name" v-model="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required />
  </div>
  <div class="mb-5">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
    <input type="email" id="email" v-model="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
  </div>
  
  <div class="mb-5">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
    <input type="password" id="password" v-model="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
  <div class="mb-5">
    <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password confirmation</label>
    <input type="password" id="password_confirmation" v-model="confirmPassword" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
  
  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" :disabled="isLoading">
    {{ isLoading ? 'Loading...' : 'Submit' }}
  </button>
</form>

</template>