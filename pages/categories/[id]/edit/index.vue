<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryApi } from '../composables/useCategory';

const route = useRoute();
const router = useRouter();
const categoryId = route.params.id;
const categoryApi = useCategoryApi();

const name = ref('');
const description = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const fetchCategory = async () => {
  isLoading.value = true;
  try {
    const category = await categoryApi.getCategoryById(categoryId);
    name.value = category.name;
    description.value = category.description || '';
  } catch (error) {
    errorMessage.value = 'Failed to load category. Please try again.';
    console.error('Error fetching category:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const categoryData = {
      name: name.value,
      description: description.value
    };
    
    await categoryApi.updateCategory(categoryId, categoryData);
    router.push('/categories');
  } catch (error) {
    errorMessage.value = 'Failed to update category. Please try again.';
    console.error('Error updating category:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCategory);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Edit Category</h1>
    </div>
    
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      {{ errorMessage }}
    </div>
    
    <div v-if="isLoading && !name" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          Name
        </label>
        <input v-model="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" required>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
          Description
        </label>
        <textarea v-model="description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" rows="4"></textarea>
      </div>
      
      <div class="flex items-center justify-between">
        <button :disabled="isLoading" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          {{ isLoading ? 'Updating...' : 'Update Category' }}
        </button>
        <NuxtLink to="/categories" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>