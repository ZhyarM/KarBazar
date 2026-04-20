import { useLanguage } from "../../context/LanguageContext.tsx";

function CategoryHeader() {
  const { t } = useLanguage();

  return (
    <>
      <section className="w-full flex justify-center items-center flex-col gap-2.5 bg-(image:--gradient-primary) px-3 py-5">
        <p className="section-title text-white">{t("categories.headerTitle")}</p>
        <span className="small-title text-white/70 text-center">
          {t("categories.headerSubtitle")}
        </span>
      </section>
    </>
  );
}

export default CategoryHeader;
