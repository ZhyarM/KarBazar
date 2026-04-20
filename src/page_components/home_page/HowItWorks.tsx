import { useLanguage } from "../../context/LanguageContext.tsx";

function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.desc"),
      index: "01",
    },
    {
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.desc"),
      index: "02",
    },
    {
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.desc"),
      index: "03",
    },
  ];

  return (
    <section className="w-full bg-(--color-bg) py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-title text-(--color-text)">
            {t("howItWorks.title")}
          </h2>
          <p className="small-title text-(--color-text-muted)">
            {t("howItWorks.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <article
              key={step.index}
              className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-6 shadow-sm"
            >
              <p className="text-xs font-bold text-(--color-primary) mb-3">
                {t("howItWorks.step")} {step.index}
              </p>
              <h3 className="text-xl font-semibold text-(--color-text) mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-(--color-text-muted)">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
