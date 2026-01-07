import { useState } from "react";
import {
  faArrowRotateRight,
  faCircleCheck,
  faClock,
  faHeart,
  faMessage,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../btns/Button";
import type { PrcingPlanTypes } from "../../utils/PricingPlans";

function PricingCard({ pricing }: { pricing?: PrcingPlanTypes[] }) {
  const [planSelecter, setPlanSelector] = useState<string>("Standard");
  const selectedPlan = (pricing || []).find(
    (plan) => plan.name === planSelecter
  );

  return (
    <section className="px-5 py-20 my-25 rounded-md shadow-(--shadow-lg) border border-(--color-border) bg-(--color-surface)">
      <div className="w-full flex justify-between items-center gap-2 bg-(--color-bg-muted) rounded-md px-3 py-1.5">
        {pricing?.map((plan) => (
          <button
            key={plan.name}
            className={`w-full text-(--color-text) cursor-pointer p-1 rounded-md duration-200 mx-2 ${
              planSelecter === plan.name ? "bg-(--color-bg)" : ""
            }`}
            onClick={() => setPlanSelector(plan.name)}
          >
            {plan.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col mx-3 px-3">
        <div className="max-w-sm flex justify-start flex-col gap-1.5 mt-3 border-b-2 border-(--color-border) px-2">
          <div className="flex flex-col gap-1 justify-start">
            <span className="text-3xl font-semibold text-(--color-text)">
              {`$${selectedPlan?.price}`}
            </span>
            <span className="text-md text-(--color-text-muted)">
              {selectedPlan?.packageType}
            </span>
          </div>
          <div className="flex justify-start gap-2 py-3 text-sm">
            <span className="text-(--color-text)">
              <FontAwesomeIcon icon={faClock} />{" "}
              {`${selectedPlan?.deliveryDays} days delivery`}
            </span>
            <span className="text-(--color-text)">
              <FontAwesomeIcon icon={faArrowRotateRight} />{" "}
              {selectedPlan?.revisions}
            </span>
          </div>
        </div>

        <div className="mt-2">
          <ul className="flex flex-col gap-3 py-3 text-(--color-text) mx-2">
            {selectedPlan?.features.map((feature) => (
              <li key={feature} className="flex gap-2 items-center">
                <FontAwesomeIcon
                  className="text-(--color-success)"
                  icon={faCircleCheck}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2.5 mt-3 px-5">
          <Button
            text={`Continue (${selectedPlan?.price}$)`}
            textColor="text-(--color-text-inverse)"
            bgColor="bg-(--color-primary)"
            backdropColor=""
          />
          <Button
            text="Contact Seller"
            textColor="text-(--color-text-inverse)"
            bgColor="bg-(--color-primary)"
            backdropColor=""
            icon={<FontAwesomeIcon icon={faMessage} />}
          />
          <div className="flex gap-2.5">
            <Button
              text="Save"
              icon={<FontAwesomeIcon icon={faHeart} />}
              textColor="text-(--color-text-inverse)"
              bgColor="bg-(--color-bg-inverse)"
            />
            <Button
              text="Share"
              icon={<FontAwesomeIcon icon={faShareNodes} />}
              textColor="text-(--color-text-inverse)"
              bgColor="bg-(--color-bg-inverse)"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingCard;
