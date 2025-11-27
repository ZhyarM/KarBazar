import { useTheme } from "../context/ThemeContext";
import Cards from "../components/Card.tsx";
import cardContent from "../utils/FeaturesContentItem.tsx";

function Features() {
  const { isBgLight } = useTheme();

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
