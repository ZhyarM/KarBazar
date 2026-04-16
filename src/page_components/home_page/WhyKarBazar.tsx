function WhyKarBazar() {
  const items = [
    {
      title: "Transparent Pricing",
      text: "See clear pricing upfront with no hidden surprises.",
    },
    {
      title: "Verified Businesses",
      text: "Work with trusted providers backed by real reviews.",
    },
    {
      title: "Secure Collaboration",
      text: "Keep communication, files, and delivery in one place.",
    },
    {
      title: "Reliable Delivery",
      text: "Milestones and deadlines help keep every project on track.",
    },
  ];

  return (
    <section className="w-full bg-(--color-bg) py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-title text-(--color-text)">
            Why Choose KarBazar
          </h2>
          <p className="small-title text-(--color-text-muted)">
            Built for speed, trust, and better project outcomes.
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
