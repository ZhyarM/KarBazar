import type { JSX } from "react";

export type InfoSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type InfoPageTemplateProps = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: InfoSection[];
};

function InfoPageTemplate({
  title,
  subtitle,
  lastUpdated,
  sections,
}: InfoPageTemplateProps): JSX.Element {
  return (
    <main className="min-h-screen bg-(--color-bg) py-10 px-4 md:px-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
          <p className="text-xs uppercase tracking-wider font-semibold text-(--color-primary)">
            KarBazar
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-(--color-text)">{title}</h1>
          <p className="mt-3 text-(--color-text-muted) leading-relaxed">{subtitle}</p>
          <p className="mt-4 text-xs text-(--color-text-muted)">Last updated: {lastUpdated}</p>
        </header>

        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8"
          >
            <h2 className="text-xl font-semibold text-(--color-text)">{section.title}</h2>

            {section.paragraphs?.map((paragraph) => (
              <p
                key={`${section.title}-${paragraph.slice(0, 24)}`}
                className="mt-3 leading-relaxed text-(--color-text-muted)"
              >
                {paragraph}
              </p>
            ))}

            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-(--color-text-muted)">
                {section.bullets.map((bullet) => (
                  <li key={`${section.title}-${bullet.slice(0, 24)}`}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}

export default InfoPageTemplate;