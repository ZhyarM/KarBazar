import type { CategoryType } from "./../utils/CategoriesData";

function CategoryCard({ logo, name, services, description, bg }: CategoryType) {
  return (
    <article
      className="
        group
        flex flex-col
        rounded-2xl
        border border-(--color-border)
        bg-(--color-card)
        p-6
        gap-4
        shadow-sm
        cursor-pointer
        transition-all duration-200
        hover:border-(--color-primary)
        hover:shadow-lg
        hover:-translate-y-1
        
      "
    >
      <div className="flex flex-col items-start gap-4">
        <div
          className={`
            flex h-14 w-14 items-center justify-center
            rounded-2xl text-white
            ${bg}
          `}
        >
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
            {logo}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3
            className="
              subsection-title
              text-(--color-text)
              transition-colors duration-300
              group-hover:text-(--color-primary)
            "
          >
            {name}
          </h3>

          <span
            className="
              inline-flex items-center justify-center
              px-2.5 py-0.5
              rounded-md
              bg-black/70
              text-[11px] font-semibold
              text-white
            "
          >
            {services}
          </span>
        </div>
      </div>

      <p className="small-title text-(--color-text-muted)">
        {description}
      </p>
    </article>
  );
}

export default CategoryCard;
