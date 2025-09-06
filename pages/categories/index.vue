<script setup>
import { ref, onMounted, watch } from 'vue';
import { useCategoryApi } from '../composables/useCategory';
import Navbar from '~/components/Navbar.vue';

const categories = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const categoryApi = useCategoryApi();
const page = ref(1);
const lastPage = ref(1);

const fetchCategories = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const data = await categoryApi.getAllCategories();
    categories.value = data.data;
    lastPage.value = data.pagination.last_page;
  } catch (error) {
    errorMessage.value = 'Failed to load categories. Please try again.';
    console.error('Error fetching categories:', error);
  } finally {
    isLoading.value = false;
  }
};

const goToPage = async (pageNumber) => {
  if (pageNumber < 1 || pageNumber > lastPage.value) return;
  page.value = pageNumber;
};

watch(page, fetchCategories);

const deleteCategory = async (id) => {
  if (!confirm('Are you sure you want to delete this category?')) return;
  
  isLoading.value = true;
  try {
    await categoryApi.deleteCategory(id);
    await fetchCategories(); // Refresh the list
  } catch (error) {
    errorMessage.value = 'Failed to delete category. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCategories);

</script>

<template>
  <Navbar />
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <NuxtLink to="/categories/create" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Category
      </NuxtLink>
    </div>
    
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      {{ errorMessage }}
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-500">
      No categories found.
    </div>
    
    <div v-else class="bg-white shadow-md rounded my-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(category, idx) in categories" :key="category.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ (page - 1) * 10 + idx + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ category.name }}</td>
            <td class="px-6 py-4">{{ category.description || 'No description' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <NuxtLink :to="`/categories/${category.id}`" class="text-indigo-600 hover:text-indigo-900 mr-4">View</NuxtLink>
              <NuxtLink :to="`/categories/${category.id}/edit`" class="text-yellow-600 hover:text-yellow-900 mr-4">Edit</NuxtLink>
              <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
    <div class="flex justify-center mt-6 space-x-2">
    <button
      :disabled="page === 1"
      @click="goToPage(page - 1)"
      class="px-3 py-1 rounded bg-gray-200"
    >Prev</button>
    <span>Page {{ page }} of {{ lastPage }}</span>
    <button
      :disabled="page === lastPage"
      @click="goToPage(page + 1)"
      class="px-3 py-1 rounded bg-gray-200"
    >Next</button>
  </div>
</template>