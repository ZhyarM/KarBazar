import { useState, useEffect } from "react";
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
import { toggleGigFavorite, checkGigFavorite } from "../../API/FavoritesAPI";

interface PricingCardProps {
  pricing?: PrcingPlanTypes[];
  gigPackages?: any;
  gigRating?: string;
  gigReviewCount?: number;
  gigOrderCount?: number;
  gigRequirements?: string | null;
  gigId?: number;
  gigTitle?: string;
  onContinue?: (tier: string) => void;
  onContactSeller?: () => void;
}

function PricingCard({
  pricing,
  gigPackages,
  gigRating,
  gigReviewCount,
  gigOrderCount,
  gigRequirements,
  gigId,
  gigTitle,
  onContinue,
  onContactSeller,
}: PricingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  // Check if gig is already favorited
  useEffect(() => {
    if (gigId) {
      const checkFavorite = async () => {
        try {
          const favorited = await checkGigFavorite(gigId);
          setIsFavorited(favorited);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      };
      checkFavorite();
    }
  }, [gigId]);

  const handleSaveGig = async () => {
    if (!gigId) return;
    try {
      const result = await toggleGigFavorite(gigId);
      setIsFavorited(result);
      setShareMessage(
        result ? "Added to favorites!" : "Removed from favorites!",
      );
      setTimeout(() => setShareMessage(""), 2000);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleShareGig = () => {
    if (!gigTitle) return;
    const shareText = `Check out this gig: ${gigTitle}`;
    const shareUrl = window.location.href;

    // Try to use native share API if available
    if (navigator.share) {
      navigator
        .share({
          title: gigTitle,
          text: shareText,
          url: shareUrl,
        })
        .catch((error) => console.log("Share error:", error));
    } else {
      // Fallback: copy to clipboard
      const fullText = `${shareText}\n${shareUrl}`;
      navigator.clipboard
        .writeText(fullText)
        .then(() => {
          setShareMessage("Copied to clipboard!");
          setTimeout(() => setShareMessage(""), 2000);
        })
        .catch((error) => console.error("Copy error:", error));
    }
  };

  let displayPlans: PrcingPlanTypes[] = [];

  // Convert gig packages to PrcingPlanTypes format if available
  if (gigPackages) {
    const tiers = ["basic", "standard", "premium"];
    displayPlans = tiers
      .map((tier) => {
        const pkg = (gigPackages as any)[tier];
        if (!pkg) return null;
        return {
          name: (tier.charAt(0).toUpperCase() + tier.slice(1)) as
            | "Basic"
            | "Standard"
            | "Premium",
          price: pkg.price,
          packageType:
            pkg.description ||
            `${tier.charAt(0).toUpperCase() + tier.slice(1)} Package`,
          deliveryDays: pkg.delivery_time || 0,
          revisions: "Unlimited",
          features: pkg.features || [],
        };
      })
      .filter((p): p is PrcingPlanTypes => p !== null);
  } else {
    displayPlans = pricing || [];
  }

  const [planSelecter, setPlanSelector] = useState<string>(
    displayPlans[0]?.name || "Standard",
  );
  const selectedPlan = displayPlans.find((plan) => plan.name === planSelecter);

  return (
    <section className="px-5 py-6 rounded-md shadow-(--shadow-lg) border border-(--color-border) bg-(--color-surface)">
      <div className="w-full flex justify-between items-center gap-2 bg-(--color-bg-muted) rounded-md px-3 py-1.5">
        {displayPlans?.map((plan) => (
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
        {/* Rating and Stats */}
        {gigRating && (
          <div className="flex justify-start gap-4 py-3 text-sm border-b border-(--color-border) px-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">⭐</span>
              <span className="text-(--color-text) font-semibold">
                {gigRating}
              </span>
              <span className="text-(--color-text-muted)">
                ({gigReviewCount} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-(--color-text)">📦</span>
              <span className="text-(--color-text-muted)">
                {gigOrderCount} orders
              </span>
            </div>
          </div>
        )}

        {/* Requirements */}
        {gigRequirements && (
          <div className="py-3 px-2 border-b border-(--color-border) mb-3">
            <p className="text-sm font-semibold text-(--color-text) mb-2">
              Requirements:
            </p>
            <p className="text-sm text-(--color-text-muted)">
              {gigRequirements}
            </p>
          </div>
        )}

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
            onClick={() => onContinue && onContinue(planSelecter.toLowerCase())}
          />
          <Button
            text="Contact Seller"
            textColor="text-(--color-text-inverse)"
            bgColor="bg-(--color-primary)"
            backdropColor=""
            icon={<FontAwesomeIcon icon={faMessage} />}
            onClick={() => onContactSeller && onContactSeller()}
          />
          <div className="flex gap-2.5 relative">
            <Button
              text="Save"
              icon={
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{ color: isFavorited ? "#ef4444" : "inherit" }}
                />
              }
              textColor="text-(--color-text-inverse)"
              bgColor="bg-(--color-bg-inverse)"
              onClick={handleSaveGig}
            />
            <Button
              text="Share"
              icon={<FontAwesomeIcon icon={faShareNodes} />}
              textColor="text-(--color-text-inverse)"
              bgColor="bg-(--color-bg-inverse)"
              onClick={handleShareGig}
            />
            {shareMessage && (
              <span className="absolute -top-8 left-0 bg-(--color-bg-muted) text-(--color-text) text-sm px-3 py-1 rounded whitespace-nowrap">
                {shareMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingCard;
