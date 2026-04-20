import { useLanguage } from "../../context/LanguageContext.tsx";

function WhyKarBazar() {
  const { t } = useLanguage();

  const items = [
    {
      title: t("why.item1.title"),
      text: t("why.item1.desc"),
    },
    {
      title: t("why.item2.title"),
      text: t("why.item2.desc"),
    },
    {
      title: t("why.item3.title"),
      text: t("why.item3.desc"),
    },
    {
      title: t("why.item4.title"),
      text: t("why.item4.desc"),
    },
  ];

  return (
    <section className="w-full bg-(--color-bg) py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-title text-(--color-text)">
            {t("why.title")}
          </h2>
          <p className="small-title text-(--color-text-muted)">
            {t("why.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <article
              key={item.title}
              className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5"
            >
              <h3 className="text-lg font-semibold text-(--color-text) mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-(--color-text-muted)">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyKarBazar;
