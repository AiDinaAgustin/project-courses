<script setup>
import { ref, onMounted } from 'vue';
import { useCourseApi } from '../../../../composables/useCourse';
import { useCategoryApi } from '../../../../composables/useCategory';

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;
const courseApi = useCourseApi();
const categoryApi = useCategoryApi();

const title = ref('');
const description = ref('');
const categoryId = ref(null);
const imageFile = ref(null);
const categories = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const oldImageUrl = ref(null);

const onFileChange = (e) => {
    imageFile.value = e.target.files[0];
}

const fetchCourse = async () => {
  isLoading.value = true;
  try {
    const response = await courseApi.getCourseById(courseId);
    const course = response.data;
    title.value = course.title;
    description.value = course.description || '';
    categoryId.value = course.category.id;
    oldImageUrl.value = course.image_url || null;
    imageFile.value = null; 
  } catch (error) {
    errorMessage.value = 'Failed to load course. Please try again.';
    console.error('Error fetching course:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const courseData = new FormData();
    courseData.append('title', title.value);
    courseData.append('description', description.value);
    courseData.append('category_id', categoryId.value);
    if (imageFile.value) {
        courseData.append('image', imageFile.value);
    }
    await courseApi.updateCourse(courseId, courseData, true);
    
    router.push('/courses');
  } catch (error) {
    errorMessage.value = 'Failed to update course. Please try again.';
    console.error('Error updating course:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
    await fetchCourse();
    try {
        const res = await categoryApi.getAllCategories();
        categories.value = res.data;
    } catch (error) {
        categories.value = [];
    }
})

</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold">Edit Course</h1>
        </div>

        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label for="title" class="block text-gray-700 text-sm font-bold mb-2">
                    Title
                </label>
                <input v-model="title" id="title" type="text" placeholder="Course title" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
            </div>
            <div class="mb-4">
                <label for="title" class="block text-gray-700 text-sm font-bold mb-2">
                    Description
                </label>
                <textarea v-model="description" id="description" placeholder="Course description" rows="4"
                          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div class="mb-4">
                <label for="category_id" class="block text-gray-700 text-sm font-bold mb-2">
                    Category ID
                </label>
                <select v-model="categoryId" name="category_id" id="category_id" required>
                    <option selected>Select a Category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>
            <div class="mb-4">
              <label for="image" class="block text-gray-700 text-sm font-bold mb-2">
                Image
              </label>
              <div v-if="oldImageUrl" class="mb-2">
                <img :src="oldImageUrl" alt="Current Image" class="h-24 w-24 object-cover rounded" />
                <p class="text-xs text-gray-500">Current image</p>
              </div>
              <input
                id="image"
                type="file"
                @change="onFileChange"
                accept="image/*"
                class="block w-full text-sm text-gray-700 border rounded"
              />
            </div>
            <div class="flex items-center justify-between">
                <button :disabled="isLoading" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                {{ isLoading ? 'Updating...' : 'Update Courses' }}
                </button>
                <NuxtLink to="/courses" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Cancel
                </NuxtLink>
            </div>
        </form>
    </div>
</template>