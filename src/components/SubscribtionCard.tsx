import type { JSX } from "react";
import { plans } from './../utils/SubscribtionPlans.tsx';
import Button from './Button.tsx';

function SubscriptionSection(): JSX.Element {
  return (
    <section className="text-(--color-text) py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="section-title text-(--color-text)">Choose Your Plan</h2>
        <p className="mt-3 body-md text-(--color-text-muted)">
          Flexible subscriptions for clients and freelancers on KarBazar.
        </p>
      </div>

      <div className="mt-8 md:mt-10 max-w-6xl mx-auto px-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col justify-center items-center gap-3 px-2 py-2.5 rounded-3xl"
          >
            <div
              className={`
                relative flex flex-col rounded-3xl border 
                bg-(--color-card) border-(--color-border)/80
                px-7 py-8 md:px-8 md:py-9
                shadow-sm transition-all duration-200
                hover:-translate-y-1 hover:shadow-md
                hover:border-(--color-primary)/80
                ${
                  plan.highlight
                    ? "ring-1 ring-(--color-primary)"
                    : ""
                }
              `}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-(--color-primary) px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-(--color-text-inverse)">
                  {plan.badge}
                </div>
              )}

              <div className="flex flex-col items-center gap-1">
                <h3 className="small-title text-(--color-text)">
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-(--color-text)">
                    {plan.price}
                  </span>
                  <span className="text-xs text-(--color-text-muted)">
                    {plan.duration}
                  </span>
                </div>
              </div>

              <ul className="mt-5 space-y-3 text-xs body-sm text-(--color-text-muted)">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary)" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex justify-center items-center pt-6">
                <Button
                  text={plan.cta}
                  bgColor="bg-[var(--color-primary)]"
                  textColor="var(--color-text-inverse)"
                  backdropColor=""
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SubscriptionSection;
