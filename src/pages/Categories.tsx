import CategoryHeader from "./../page_components/category_components/CategoryHeader";
import CategoryCard from "./../page_components/category_components/CategoryCard.tsx";
import { fetchCategories } from "../API/CategoriesAPI.tsx";
import { useEffect, useState } from "react";
import LoadingCircle from "../utils/loading.tsx";

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  gig_count: number;
  bg: string;
}

function Categories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]); // Initialize with empty array

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const response = await fetchCategories();

      if (response.success) {
        // Add default bg color to categories
        const categoriesWithBg = response.data.map((cat) => ({
          ...cat,
          bg: "bg-(--color-primary)",
        }));
        setCategories(categoriesWithBg);
      }
      setLoading(false);
    };
    loadCategories();
  }, []);

  if (loading) {
    return <LoadingCircle size={14} />;
  }

  return (
    <>
      <CategoryHeader />
      <section className="w-full px-4 py-8 bg-(--color-bg)">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* FIX: Use 'categories' (state) instead of 'categoriesData' (import) */}
          {categories.map((cat) => (
            // Ensure you use a valid key, ideally cat.id
            <CategoryCard key={cat.id} {...cat} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Categories;
