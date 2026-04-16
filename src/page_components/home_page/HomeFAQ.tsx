import { Link } from "react-router-dom";

function HomeFAQ() {
  const faq = [
    {
      q: "How do I start a project?",
      a: "Post your request, review offers, and choose the business that fits your goals.",
    },
    {
      q: "Can I compare pricing before hiring?",
      a: "Yes. You can compare pricing, delivery time, and reviews before starting.",
    },
    {
      q: "How is project quality maintained?",
      a: "Ratings, completed work history, and profile verification help ensure quality.",
    },
  ];

  return (
    <section className="w-full bg-(--color-bg) py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title text-(--color-text)">Quick FAQ</h2>
          <p className="small-title text-(--color-text-muted)">
            Helpful answers before you launch your next project.
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
            Explore More Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeFAQ;
