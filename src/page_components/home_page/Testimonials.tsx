function Testimonials() {
  const testimonials = [
    {
      name: "Aso Kareem",
      role: "Startup Founder",
      quote:
        "KarBazar helped us launch in two weeks with a reliable business partner.",
    },
    {
      name: "Shilan Nouri",
      role: "Marketing Lead",
      quote:
        "We found great experts quickly and stayed within our project budget.",
    },
    {
      name: "Rebaz Ahmed",
      role: "Product Manager",
      quote:
        "Communication and delivery tracking made collaboration very smooth.",
    },
  ];

  return (
    <section className="w-full bg-(--color-bg) py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="section-title text-(--color-text)">
            What Clients Say
          </h2>
          <p className="small-title text-(--color-text-muted)">
            Real feedback from teams building through KarBazar.
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
