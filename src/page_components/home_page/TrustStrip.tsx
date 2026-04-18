import { useLanguage } from "../../context/LanguageContext.tsx";

function TrustStrip() {
  const { t } = useLanguage();

  const brands = [
    t("trust.brand1"),
    t("trust.brand2"),
    t("trust.brand3"),
    t("trust.brand4"),
    t("trust.brand5"),
  ];

  return (
    <section className="w-full bg-(--color-bg) py-10 px-4">
      <div className="max-w-6xl mx-auto border border-(--color-border) rounded-2xl bg-(--color-surface) p-5">
        <p className="text-center text-sm text-(--color-text-muted) mb-5">
          {t("trust.subtitle")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {brands.map((brand) => (
            <span
              key={brand}
              className="px-4 py-2 text-xs md:text-sm font-medium rounded-full bg-(--color-bg) border border-(--color-border) text-(--color-text)"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustStrip;
