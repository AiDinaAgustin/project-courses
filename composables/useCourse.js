export const useCourseApi = () => {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    const tokenCookie = useCookie('auth_token');

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenCookie.value}`
        };
    };

    const getAllCourses = async (page = 1) => {
        try {
            const response = await fetch(`${apiUrl}/courses?page=${page}`, {
                method: 'GET',
                headers: getHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            throw error;
        }
    }

    const getCourseById = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/courses/${id}`, {
                method: 'GET',
                headers: getHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch course ${id}:`, error);
            throw error;
        }
    }

    const createCourse = async (courseData, isMultipart) => {
        try {
            const response = await fetch(`${apiUrl}/courses`, {
                method: 'POST',
                headers: isMultipart ? { 'Authorization': `Bearer ${tokenCookie.value}` } : getHeaders(),
                body: courseData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to create course:", error);
            throw error;
        }
    }

    const updateCourse = async (id, courseData, isMultipart) => {
        try {
            const response = await fetch(`${apiUrl}/courses/${id}`, {
                method: 'PUT',
                headers: isMultipart ? { 'Authorization': `Bearer ${tokenCookie.value}` } : getHeaders(),
                body: courseData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to update course ${id}:`, error);
            throw error;
        }
    }

    const deleteCourse = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/courses/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to delete course ${id}:`, error);
            throw error;
        }
    }

    return {
        getAllCourses,
        getCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
    };
}