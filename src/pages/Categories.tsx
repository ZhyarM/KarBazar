import CategoryHeader from "./../page_components/category_components/CategoryHeader";
// import { categoriesData } from "../utils/CategoriesData.tsx"; // Don't use this anymore
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

}

function Categories() {


  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]); // Initialize with empty array

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const response = await fetchCategories();

      if (response.success) {
        setCategories(response.data);
      }
      setLoading(false);
    };
    loadCategories();
  }, []);


  useEffect(() => {
    console.log("State updated:", categories);
  }, [loading]);

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
            <CategoryCard key={cat.name} {...cat} bg=" " />
          ))}
        </div>
      </section>
    </>
  );
}

export default Categories;
