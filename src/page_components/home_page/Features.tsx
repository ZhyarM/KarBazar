import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../API/CategoriesAPI.tsx";

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  gig_count: number;
}

function Features() {
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetchCategories();
      if (!response.success) {
        setCategories([]);
        return;
      }

      const topCategories = [...response.data]
        .sort((a, b) => (b.gig_count ?? 0) - (a.gig_count ?? 0))
        .slice(0, 8);

      setCategories(topCategories);
    };

    loadCategories();
  }, []);

  return (
    <>
      <article className="flex flex-col justify-center items-center py-3.5 gap-6 bg-(--color-bg) ">
        <section className="flex flex-col justify-center items-center gap-3">
          <p
            className={`flex justify-center items-center text-4xl font-medium bg-transparent  text-(--color-text)
              
              
              `}
          >
            Explore by Category
          </p>
          <p className="text-[oklch(0.65_0_0)] text-lg text-center">
            Browse through our diverse range of services
          </p>
        </section>

        <section className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/browse-gigs?category_id=${category.id}&category=${encodeURIComponent(category.name)}`}
              className="flex flex-col gap-3 py-6 border border-(--color-border) w-full min-h-[210px] font-inter text-lg leading-6 text-(--color-text) bg-(--color-surface) rounded-xl shadow-lg group transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:border-(--color-accent-hover) cursor-pointer px-6"
            >
              <div className="flex items-center justify-center text-xl text-center text-(--color-secondary) rounded-full h-14 w-14 bg-(--color-primary) transition-transform duration-200 group-hover:scale-110">
                <span className="text-2xl">{category.icon || "📁"}</span>
              </div>
              <p className="text-xl font-medium text-(--color-text)">
                {category.name}
              </p>
              <p className="text-sm text-(--color-text-muted) line-clamp-2">
                {category.description || `${category.gig_count} gigs available`}
              </p>
              <p className="text-xs text-(--color-primary) font-semibold">
                {category.gig_count} gigs available
              </p>
            </Link>
          ))}
        </section>

        {categories.length === 0 && (
          <p className="text-sm text-(--color-text-muted)">
            No categories are available yet.
          </p>
        )}
      </article>
    </>
  );
}

export default Features;
