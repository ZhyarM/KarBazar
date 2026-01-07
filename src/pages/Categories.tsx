import CategoryHeader from "./../page_components/category_components/CategoryHeader";
import { categoriesData } from "../utils/CategoriesData.tsx";
import CategoryCard from './../page_components/category_components/CategoryCard.tsx';
import { fetchCategories } from "../API/CategoriesAPI.tsx";
import { useEffect, useState } from "react";
import LoadingCircle from "../utils/loading.tsx";





function Categories() {

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  
useEffect(() => {
  const loadCategories = async () => {
    setLoading(true);
    const response = await fetchCategories();
    if (response.success) {
      setCategories(response.data);
    }
    setLoading(false);
  
  
  }

  loadCategories();

}, []);

  if(loading){
    return <LoadingCircle color="blue-500 " size={14} />;
  }
  return (
    <>
      <CategoryHeader />
      <section className="w-full px-4 py-8 bg-(--color-bg)">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categoriesData.map((cat) => (
            <CategoryCard key={cat.name} {...cat} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Categories;
