import { useTheme } from "../context/ThemeContext";
import Cards from "../components/Card.tsx";
import cardContent from "../utils/FeaturesContentItem.tsx";

function Features() {
  const { isBgLight } = useTheme();

  return (
    <>
      <article className="flex flex-col justify-center items-center py-3.5 gap-6 my-9">
        <section className="flex flex-col justify-center items-center gap-3">
          <p
            className={`flex justify-center items-center text-4xl font-medium bg-transparent ${
              isBgLight
                ? "bg-[oklch(0.96_0.025_264)] text-[oklch(0.15_0.05_264)]"
                : "bg-[oklch(0.15_0.025_246)] text-[oklch(0.92_0.025_264)]"
            }`}
          >
            Explore by Category
          </p>
          <p className="text-[oklch(0.65_0_0)] text-xl">
            Browse through our diverse range of services
          </p>
        </section>

        <section className="flex flex-row justify-center items-center flex-wrap m-auto gap-4">
          {cardContent.map((el) => (
            <Cards logo={el.logo} text={el.text} />
          ))}
        </section>
      </article>
    </>
  );
}

export default Features;
