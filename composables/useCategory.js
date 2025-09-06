export const useCategoryApi = () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;
  const tokenCookie = useCookie('auth_token');
  
  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenCookie.value}`
    };
  };
  
  const getAllCategories = async (page = 1) => {
    try {
      const response = await fetch(`${apiUrl}/categories?page=${page}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  };
  
  const getCategoryById = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/categories/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      throw error;
    }
  };
  
  const createCategory = async (categoryData) => {
    try {
      const response = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to create category:", error);
      throw error;
    }
  };
  
  const updateCategory = async (id, categoryData) => {
    try {
      const response = await fetch(`${apiUrl}/categories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      throw error;
    }
  };
  
  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      throw error;
    }
  };
  
  return {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  };
};