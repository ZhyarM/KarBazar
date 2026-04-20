import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.tsx";

function HomeFAQ() {
  const { t } = useLanguage();

  const faq = [
    {
      q: t("faq.q1"),
      a: t("faq.a1"),
    },
    {
      q: t("faq.q2"),
      a: t("faq.a2"),
    },
    {
      q: t("faq.q3"),
      a: t("faq.a3"),
    },
  ];

  return (
    <section className="w-full bg-(--color-bg) py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title text-(--color-text)">{t("faq.title")}</h2>
          <p className="small-title text-(--color-text-muted)">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faq.map((item) => (
            <article
              key={item.q}
              className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5"
            >
              <h3 className="font-semibold text-(--color-text) mb-2">
                {item.q}
              </h3>
              <p className="text-sm text-(--color-text-muted)">{item.a}</p>
            </article>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-(--color-primary) text-(--color-text-inverse) text-sm font-semibold hover:opacity-90 transition"
          >
            {t("faq.exploreMore")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeFAQ;
