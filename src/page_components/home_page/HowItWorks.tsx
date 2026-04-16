function HowItWorks() {
  const steps = [
    {
      title: "Post Your Need",
      description:
        "Describe your project and budget in minutes so businesses can respond quickly.",
      index: "01",
    },
    {
      title: "Compare Offers",
      description:
        "Review ratings, delivery time, and pricing options to pick the best fit.",
      index: "02",
    },
    {
      title: "Launch & Track",
      description:
        "Start your project, chat in real-time, and track progress from one dashboard.",
      index: "03",
    },
  ];

  return (
    <section className="w-full bg-(--color-bg) py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-title text-(--color-text)">
            How KarBazar Works
          </h2>
          <p className="small-title text-(--color-text-muted)">
            A simple flow designed for fast, reliable project delivery.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <article
              key={step.index}
              className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-6 shadow-sm"
            >
              <p className="text-xs font-bold text-(--color-primary) mb-3">
                STEP {step.index}
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
