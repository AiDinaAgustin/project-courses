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

onMounted(fetchCourses);

</script>

<template>
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Courses</h1>
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
            <th class="py-2 px-4 border-b">Category</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(course, idx) in courses" :key="course.id" class="hover:bg-gray-100">
            <td class="py-2 px-4 border-b">{{ (page - 1) * (courses.length) + idx + 1 }}</td>
            <td class="py-2 px-4 border-b">{{ course.title }}</td>
            <td class="py-2 px-4 border-b">{{ course.description }}</td>
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