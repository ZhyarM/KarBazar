interface responseData {
  success: boolean;
  data: any;
}

const fetchCategories = async (): Promise<responseData> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/categories");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: responseData = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: null };
  }
};

// Alias for compatibility
const getCategories = async () => {
  const response = await fetchCategories();
  return response.data || [];
};

export { fetchCategories, getCategories };
