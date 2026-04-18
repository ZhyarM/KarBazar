import { useLanguage } from "../../context/LanguageContext.tsx";

function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "Aso Kareem",
      role: "Startup Founder",
      quote: t("testimonials.quote1"),
    },
    {
      name: "Shilan Nouri",
      role: "Marketing Lead",
      quote: t("testimonials.quote2"),
    },
    {
      name: "Rebaz Ahmed",
      role: "Product Manager",
      quote: t("testimonials.quote3"),
    },
  ];

  return (
    <section className="w-full bg-(--color-bg) py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-title text-(--color-text)">
            {t("testimonials.title")}
          </h2>
          <p className="small-title text-(--color-text-muted)">
            {t("testimonials.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-6"
            >
              <p className="text-sm text-(--color-text) leading-relaxed mb-4">
                "{item.quote}"
              </p>
              <p className="font-semibold text-(--color-text)">{item.name}</p>
              <p className="text-xs text-(--color-text-muted)">{item.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
