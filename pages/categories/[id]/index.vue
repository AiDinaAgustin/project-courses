<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryApi } from '/composables/useCategory';

const route = useRoute();
const categoryId = route.params.id;
const categoryApi = useCategoryApi();

const category = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');

const fetchCategory = async () => {
  isLoading.value = true;
  try {
    category.value = await categoryApi.getCategoryById(categoryId);
  } catch (error) {
    errorMessage.value = 'Failed to load category. Please try again.';
    console.error('Error fetching category:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCategory);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Category Details</h1>
      <div>
        <NuxtLink :to="`/categories/${categoryId}/edit`" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2">
          Edit
        </NuxtLink>
        <NuxtLink to="/categories" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Back to List
        </NuxtLink>
      </div>
    </div>
    
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      {{ errorMessage }}
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="category" class="bg-white shadow-md rounded p-6">
      <div class="mb-4">
        <h2 class="text-xl font-semibold mb-2">Name</h2>
        <p>{{ category.name }}</p>
      </div>
      
      <div>
        <h2 class="text-xl font-semibold mb-2">Description</h2>
        <p>{{ category.description || 'No description provided' }}</p>
      </div>
    </div>
  </div>
</template>