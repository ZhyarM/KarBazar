import { useState } from "react";
import { useParams } from "react-router-dom";
import users from "../../utils/UserData";
import PricingCard from "./../../components/cards/PricingCard.tsx";
import Description from "./DescriptionComponent.tsx";
import Button from "../../components/btns/Button.tsx";
import type { JSX } from "react/jsx-runtime";
import { lazy, Suspense } from "react";

function UserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const user = users.find((u) => u.user_id === userId);
  const [activeTab, setActiveTab] = useState<string>("description");

  const Reviews = lazy(() => import("./ReviewsComponent"));
  const FAQ = lazy(() => import("./FAQComponent"));

  const renderContent = (): JSX.Element | undefined => {
    switch (activeTab) {
      case "reviews":
        return (
          <Suspense
            fallback={
              <div className="flex justify-center text-(--color-text)">
                Loading reviews...
              </div>
            }
          >
            <Reviews />
          </Suspense>
        );
      case "faq":
        return (
          <Suspense
            fallback={
              <div className="flex justify-center text-(--color-text)">
                Loading FAQs...
              </div>
            }
          >
            <FAQ />
          </Suspense>
        );
      default:
        return (
          <Description
            username={user?.username}
            intro={user?.about?.intro}
            whatYoullGet={user?.about?.whatYoullGet}
            technologies={user?.about?.technologies}
          />
        );
    }
  };

  return (
    <>
      <article className="w-full flex flex-col justify-around gap-3 bg-(--color-bg) py-3 px-6 lg:flex-row">
        <section className="flex flex-col gap-2.5">
          <h1 className="section-title text-(--color-text)">
            {user?.description}
          </h1>

          <div className="flex justify-start items-center gap-2">
            <span className="text-xs text-(--color-text-inverse) bg-(--color-primary) px-1.5 py-2 rounded-md">
              {user?.category}
            </span>
            <span className="text-xs text-(--color-text) bg-(--color-bg-muted) px-1.5 py-2 rounded-md">
              {user?.subcategory}
            </span>
          </div>

          <div className="flex justify-start items-center gap-6">
            <div className="flex items-center gap-2">
              {user?.user_profile_img ? (
                <img
                  src={user?.user_profile_img}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full object-cover object-center"
                />
              ) : (
                <span className="flex items-center justify-center w-8 h-8 font-inter text-sm font-semibold leading-5 text-(--color-text) rounded-full bg-(image:--gradient-secondary)">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="flex flex-col ml-1">
                <p className="text-md font-bold text-(--color-text)">
                  {user?.username}
                </p>
                <p className="text-sm text-(--color-text-muted)">
                  {user?.seller_level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-amber-300 text-lg">{user?.star_icon}</span>
              <span className="text-(--color-text)">{user?.rating}</span>
              <span className="text-(--color-text-muted)">{`(${user?.rating_number} reviews)`}</span>
            </div>
          </div>
          <div className="w-full min-w-0 max-w-full md:max-w-3xl lg:max-w-4xl flex flex-col justify-start gap-2 py-3">
            <div className="flex justify-start max-w-xs bg-(--color-bg-muted) rounded-md">
              <Button
                text="Desicription"
                textColor={
                  activeTab === "description"
                    ? "text-(--color-accent)"
                    : "text-(--color-text)"
                }
                onClick={() => setActiveTab("description")}
              />
              <Button
                text="Reviews"
                textColor={
                  activeTab === "reviews"
                    ? "text-(--color-accent)"
                    : "text-(--color-text)"
                }
                onClick={() => setActiveTab("reviews")}
              />
              <Button
                text="FAQ"
                textColor={
                  activeTab === "faq"
                    ? "text-(--color-accent)"
                    : "text-(--color-text)"
                }
                onClick={() => setActiveTab("faq")}
              />
            </div>
            <div className="flex flex-col gap-3 border border-(--color-border) rounded-md px-6 py-4 shadow-(--shadow-md)">
              {renderContent()}
            </div>
          </div>
        </section>
        <PricingCard pricing={user?.pricing} />
      </article>
    </>
  );
}

export default UserDetails;
