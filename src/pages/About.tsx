
import { useLanguage } from "../context/LanguageContext.tsx";

function About() {
  const { t } = useLanguage();

  return (
    <section className="min-h-[70vh] bg-(--color-bg) px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="section-title text-(--color-text) mb-3">{t("about.title")}</h1>
        <p className="small-title text-(--color-text-muted) mb-8">{t("about.subtitle")}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5">
            <h2 className="subsection-title text-(--color-text) mb-2">{t("about.missionTitle")}</h2>
            <p className="small-title text-(--color-text-muted)">{t("about.missionText")}</p>
          </article>

          <article className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5">
            <h2 className="subsection-title text-(--color-text) mb-2">{t("about.visionTitle")}</h2>
            <p className="small-title text-(--color-text-muted)">{t("about.visionText")}</p>
          </article>

          <article className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5">
            <h2 className="subsection-title text-(--color-text) mb-2">{t("about.valuesTitle")}</h2>
            <p className="small-title text-(--color-text-muted)">{t("about.valuesText")}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default About;