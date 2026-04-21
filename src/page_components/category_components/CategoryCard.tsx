import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface CategoryData {
  name: string;
  logo: ReactNode;
  services: string;
  description: string;
  bg: string;
}

function CategoryCard({ name, logo, services, description, bg }: CategoryData) {
  const navigate = useNavigate();

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/browse-gigs?category=${encodeURIComponent(name)}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/browse-gigs?category=${encodeURIComponent(name)}`);
        }
      }}
      className="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-card) p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-(--color-primary) hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
    >
      <div className="flex flex-col items-start gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${bg}`}
        >
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
            {logo}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="subsection-title text-(--color-text) transition-colors duration-300 group-hover:text-(--color-primary)">
            {name}
          </h3>

          <span className="flex items-center justify-center rounded-md bg-black/70 px-2.5 py-0.5 text-[12px] font-semibold text-white">
            {services}
          </span>
        </div>
      </div>

      <p className="small-title text-(--color-text-muted)">{description}</p>
    </article>
  );
}

export default CategoryCard;
