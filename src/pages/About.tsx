const About = () => {
  const teamMembers = [
    {
      name: "Your Name",
      role: "Front-end Developer",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Friend One",
      role: "UI / UX Designer",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Friend Two",
      role: "Backend Engineer",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <section className="relative py-28 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(circle at top, var(--color-primary), transparent 60%)",
          }}
        />
        <h1
          className="section-title mb-6"
          style={{ color: "var(--color-primary)" }}
        >
          Karbazar
        </h1>
        <p
          className="body-lg max-w-2xl mx-auto"
          style={{ color: "var(--color-text-muted)" }}
        >
          A specialized marketplace connecting local talent with global
          opportunities. Built as a collaborative final year project.
        </p>
      </section>

      <section className="container-width py-20 px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div
            className="max-w-xl border-l-4 pl-6"
            style={{ borderColor: "var(--color-primary)" }}
          >
            <h2 className="subsection-title mb-6">Our Vision</h2>
            <p
              className="body-md mb-4"
              style={{ color: "var(--color-text-muted)" }}
            >
              Karbazar was created to empower freelancers by simplifying project
              management and ensuring secure, transparent payments.
            </p>
            <p className="body-md" style={{ color: "var(--color-text-muted)" }}>
              As a team of three students, we focused on usability, scalability,
              and real-world problem solving.
            </p>
          </div>

          <div
            className="p-10 radius shadow-lg"
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h3
              className="small-title mb-6"
              style={{ color: "var(--color-accent)" }}
            >
              Core Values
            </h3>
            <ul className="space-y-5 body-sm">
              {[
                "Transparent peer-to-peer transactions",
                "Modern & scalable architecture",
                "User-centric design decisions",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: "var(--color-success)",
                      color: "white",
                    }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="py-24 px-6"
        style={{ backgroundColor: "var(--color-bg-muted)" }}
      >
        <div className="container-width text-center">
          <h2 className="subsection-title mb-14">Meet the Team</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="p-10 radius shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex justify-center mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 object-cover rounded-full shadow"
                    style={{ border: "3px solid var(--color-primary)" }}
                  />
                </div>

                <h3 className="small-title mb-2">{member.name}</h3>
                <span
                  className="inline-block px-4 py-1 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                  }}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
