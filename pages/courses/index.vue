<script setup>
import { ref, onMounted, watch } from 'vue';
import { useCourseApi } from '../composables/useCourse';
import Navbar from '~/components/Navbar.vue';

const courses = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const courseApi = useCourseApi();
const page = ref(1);
const lastPage = ref(1);

const fetchCourses = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const data = await courseApi.getAllCourses(page.value);
    courses.value = data.data;
    lastPage.value = data.pagination.last_page;
  } catch (error) {
    errorMessage.value = 'Failed to load courses. Please try again.';
    console.error('Error fetching courses:', error);
  } finally {
    isLoading.value = false;
  }
};

const goToPage = async (pageNumber) => {
  if (pageNumber < 1 || pageNumber > lastPage.value) return;
  page.value = pageNumber;
};

watch(page, fetchCourses);

const deleteCourse = async (id) => {
  if (!confirm('Are you sure you want to delete this course?')) return;
  
  isLoading.value = true;
  try {
    await courseApi.deleteCourse(id);
    await fetchCourses(); // Refresh the list
  } catch (error) {
    errorMessage.value = 'Failed to delete course. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const showImportModal = ref(false);
const importFile = ref(null);

const openImportModal = () => {
  showImportModal.value = true;
  importFile.value = null;
  errorMessage.value = '';
};

const closeImportModal = () => {
  showImportModal.value = false;
  importFile.value = null;
  errorMessage.value = '';
};

const onImportFileChange = (e) => {
  importFile.value = e.target.files[0];
};

const handleImport = async () => {
  if (!importFile.value) {
    errorMessage.value = 'Please select a file.';
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await courseApi.importCourse(importFile.value);
    await fetchCourses();
    closeImportModal();
  } catch (error) {
    errorMessage.value = 'Failed to import courses. Please try again.';
    console.error('Error importing courses:', error);
  } finally {
    isLoading.value = false;
  }
};

const exportCourses = async () => {
  isLoading.value = false;
  errorMessage.value = '';

  try {
    const blob = await courseApi.exportCourse();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'courses_export.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    errorMessage.value = 'Failed to export courses. Please try again.';
    console.error('Error exporting courses:', error);
  } finally {
    isLoading.value = false;
  }
};


onMounted(fetchCourses);

</script>

<template>
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Courses</h1>
                      <!-- Import Button -->
              <button @click="openImportModal" class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-4">
                Import Courses
              </button>
              
              <!-- Import Modal -->
              <div v-if="showImportModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div class="bg-white rounded shadow-lg p-6 w-full max-w-md">
                  <h2 class="text-lg font-bold mb-4">Import Courses</h2>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    @change="onImportFileChange"
                    class="mb-4"
                  />
                  <div v-if="errorMessage" class="text-red-600 mb-2">{{ errorMessage }}</div>
                  <div class="flex justify-end space-x-2">
                    <button @click="closeImportModal" type="button" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button @click="handleImport" :disabled="isLoading" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      {{ isLoading ? 'Importing...' : 'Import' }}
                    </button>
                  </div>
                </div>
              </div>       
        <button @click="exportCourses" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4">
          Export Courses
        </button>
        <NuxtLink to="/courses/create" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Course
        </NuxtLink>
      </div>
  
      <div v-if="isLoading" class="text-center my-8">
        <p>Loading...</p>
      </div>
  
      <div v-if="errorMessage" class="bg-red-100 text-red-700 p-4 rounded mb-6">
        {{ errorMessage }}
      </div>
  
      <table v-if="!isLoading && courses.length" class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">No</th>
            <th class="py-2 px-4 border-b">Title</th>
            <th class="py-2 px-4 border-b">Description</th>
            <th class="py-2 px-4 border-b">Image</th>
            <th class="py-2 px-4 border-b">Category</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(course, idx) in courses" :key="course.id" class="hover:bg-gray-100">
            <td class="py-2 px-4 border-b">{{ (page - 1) * (courses.length) + idx + 1 }}</td>
            <td class="py-2 px-4 border-b">{{ course.title }}</td>
            <td class="py-2 px-4 border-b">{{ course.description }}</td>
            <td class="py-2 px-4 border-b">
              <img v-if="course.image" :src="course.image" alt="Course Image" class="h-16 w-16 object-cover rounded"/>
              <span v-else>No Image</span>
            </td>
            <td class="py-2 px-4 border-b">{{ course.category.name || 'Uncategorized' }}</td>
            <td class="py-2 px-4 border-b">
              <NuxtLink :to="`/courses/${course.id}/edit`" class="text-blue-600 hover:underline mr-4">Edit</NuxtLink>
              <button @click="deleteCourse(course.id)" class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="!isLoading && !courses.length" class="text-center my-8">
        <p>No courses found.</p>
      </div>
  
      <div v-if="lastPage > 1" class="flex justify-center mt-6 space-x-2">
        <button 
          @click="goToPage(page - 1)" 
          :disabled="page === 1" 
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="px-3 py-1">{{ page }} / {{ lastPage }}</span>
        <button 
          @click="goToPage(page + 1)" 
          :disabled="page === lastPage" 
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button> 
        </div>
    </div>
</template>