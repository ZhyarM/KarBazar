import CategoryHeader from "./../page_components/category_components/CategoryHeader";
import { categoriesData } from "../utils/CategoriesData";
import CategoryCard from './../page_components/category_components/CategoryCard.tsx';
function Categories() {
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
