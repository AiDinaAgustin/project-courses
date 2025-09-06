<script setup>
import Navbar from '~/components/Navbar.vue';


const handleLogout = () => {
    const tokenCookie = useCookie("auth_token");
    tokenCookie.value = null;
    return navigateTo("/login");
};

</script>
<template>

    <Navbar />
    Hallo 


    <button @click="handleLogout" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Logout</button>
</template>