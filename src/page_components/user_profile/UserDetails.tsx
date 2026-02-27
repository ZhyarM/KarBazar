import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PricingCard from "./../../components/cards/PricingCard.tsx";
import Button from "../../components/btns/Button.tsx";
import type { JSX } from "react/jsx-runtime";
import { lazy, Suspense } from "react";
import { fetchGigByID } from "../../API/gigs/getGigByID.tsx";
import LoadingCircle from "../../utils/loading.tsx";
import type { GigresponseByID } from "../../API/gigs/getGigByID.tsx";
import {
  getAvatarUrl,
  getImageUrl,
  getGalleryImages,
} from "../../utils/imageUrl";

function UserDetails() {
  const { id } = useParams<{ id?: string }>();
  const gigId = id;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("description");
  const [loading, setLoading] = useState(false);
  const [gig, setGig] = useState<GigresponseByID>();
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(
    null,
  );

  const Reviews = lazy(() => import("./ReviewsComponent"));
  const FAQ = lazy(() => import("./FAQComponent"));

  const handleProfileClick = () => {
    if (gig?.data.seller.id) {
      navigate(`/profile/${gig.data.seller.profile.username}`);
    }
  };

  const handleChat = () => {
    if (gig?.data.seller.id) {
      navigate(`/messages/${gig.data.seller.id}`, {
        state: {
          seller: {
            id: gig.data.seller.id,
            name: gig.data.seller.name,
            username: gig.data.seller.profile.username,
            avatar_url: gig.data.seller.profile.avatar_url,
          },
        },
      });
    }
  };

  const renderContent = (): JSX.Element | undefined => {
    if (!gig) return undefined;
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
            <Reviews
              gigId={gig.data.id}
              gigRating={gig.data.rating}
              reviewCount={gig.data.review_count}
            />
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
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-(--color-text) mb-2">
                About this gig
              </h3>
              <p className="text-(--color-text) text-base leading-relaxed whitespace-pre-line">
                {gig.data.description}
              </p>
            </div>
            {gig.data.requirements && (
              <div>
                <h3 className="text-lg font-bold text-(--color-text) mb-2">
                  Requirements
                </h3>
                <p className="text-(--color-text) text-base leading-relaxed">
                  {gig.data.requirements}
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  useEffect(() => {
    const loadGig = async () => {
      if (!gigId) return;
      setLoading(true);
      try {
        const response = await fetchGigByID({ id: Number(gigId) });
        if (response.success && response) {
          setLoading(false);
          setGig(response);
          // Set first gallery image or main image as selected
          if (response.data.gallery && response.data.gallery.length > 0) {
            const images = getGalleryImages(response.data.gallery);
            if (images.length > 0) setSelectedGalleryImg(images[0]);
          } else if (response.data.image_url) {
            setSelectedGalleryImg(getImageUrl(response.data.image_url) || null);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading gig:", error);
        setLoading(false);
      }
    };
    loadGig();
  }, [gigId]);

  return loading || !gig ? (
    <LoadingCircle size={14} />
  ) : (
    <article className="w-full min-h-screen bg-(--color-bg) py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Column - Main Content */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-text) leading-tight">
            {gig.data.title}
          </h1>

          {/* Seller Info & Stats Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition"
              onClick={handleProfileClick}
            >
              {gig.data.seller.profile.avatar_url ? (
                <img
                  src={getAvatarUrl(gig.data.seller.profile.avatar_url)}
                  alt={gig.data.seller.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-(--color-border)"
                />
              ) : (
                <span className="flex items-center justify-center w-10 h-10 text-sm font-bold text-(--color-text) rounded-full bg-(image:--gradient-secondary)">
                  {gig.data.seller.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-sm font-bold text-(--color-text) hover:text-(--color-primary) transition-colors">
                  {gig.data.seller.name}
                </p>
                <p className="text-xs text-(--color-text-muted)">
                  @{gig.data.seller.profile.username}
                </p>
              </div>
            </div>

            <div className="h-5 w-px bg-(--color-border) hidden sm:block"></div>

            <div className="flex items-center gap-1">
              <span className="text-amber-400">⭐</span>
              <span className="text-sm font-semibold text-(--color-text)">
                {gig.data.rating}
              </span>
              <span className="text-xs text-(--color-text-muted)">{`(${gig.data.review_count} reviews)`}</span>
            </div>

            <div className="h-5 w-px bg-(--color-border) hidden sm:block"></div>

            <div className="flex items-center gap-3 text-xs text-(--color-text-muted)">
              <span>📦 {gig.data.order_count} orders</span>
              <span>👁 {gig.data.view_count || 0} views</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-(--color-text-inverse) bg-(--color-primary) px-2.5 py-1 rounded-md font-medium">
              {gig.data.category.name}
            </span>
            <span className="text-xs text-(--color-text) bg-(--color-bg-muted) px-2.5 py-1 rounded-md">
              Starting at ${gig.data.price}
            </span>
            {gig.data.is_featured && (
              <span className="text-xs text-(--color-text-inverse) bg-yellow-600 px-2.5 py-1 rounded-md">
                ✨ Featured
              </span>
            )}
            {gig.data.is_trending && (
              <span className="text-xs text-(--color-text-inverse) bg-red-600 px-2.5 py-1 rounded-md">
                🔥 Trending
              </span>
            )}
          </div>

          {/* Image Gallery */}
          <div className="flex flex-col gap-3">
            {/* Main Image */}
            {selectedGalleryImg && (
              <div className="w-full rounded-lg overflow-hidden border border-(--color-border) bg-(--color-surface)">
                <img
                  src={selectedGalleryImg}
                  alt={gig.data.title}
                  className="w-full max-h-[420px] object-contain"
                />
              </div>
            )}

            {/* Thumbnail Strip */}
            {gig.data.gallery &&
              Array.isArray(gig.data.gallery) &&
              gig.data.gallery.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {/* Main image as first thumbnail */}
                  {gig.data.image_url && (
                    <button
                      onClick={() =>
                        setSelectedGalleryImg(
                          getImageUrl(gig.data.image_url) || null,
                        )
                      }
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        selectedGalleryImg === getImageUrl(gig.data.image_url)
                          ? "border-(--color-primary)"
                          : "border-(--color-border) hover:border-(--color-primary)/50"
                      }`}
                    >
                      <img
                        src={getImageUrl(gig.data.image_url) || ""}
                        alt="Main"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}
                  {getGalleryImages(gig.data.gallery).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGalleryImg(img)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        selectedGalleryImg === img
                          ? "border-(--color-primary)"
                          : "border-(--color-border) hover:border-(--color-primary)/50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Tags */}
          {gig.data.tags &&
            Array.isArray(gig.data.tags) &&
            gig.data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {gig.data.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-(--color-bg-muted) text-(--color-text) px-3 py-1.5 rounded-full border border-(--color-border)"
                  >
                    {typeof tag === "string" ? tag : (tag as any).tag}
                  </span>
                ))}
              </div>
            )}

          {/* Tabs: Description / Reviews / FAQ */}
          <div className="flex flex-col gap-4">
            <div className="flex bg-(--color-bg-muted) rounded-lg p-1 max-w-sm">
              {["description", "reviews", "faq"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-(--color-surface) text-(--color-primary) shadow-sm"
                      : "text-(--color-text-muted) hover:text-(--color-text)"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="border border-(--color-border) rounded-lg px-6 py-5 bg-(--color-surface) shadow-sm">
              {renderContent()}
            </div>
          </div>
        </section>

        {/* Right Column - Pricing */}
        <section className="w-full lg:w-[380px] lg:flex-shrink-0">
          <div className="lg:sticky lg:top-6">
            <PricingCard
              gigId={gig.data.id}
              gigTitle={gig.data.title}
              gigPackages={gig.data.packages}
              gigRating={gig.data.rating}
              gigReviewCount={gig.data.review_count}
              gigOrderCount={gig.data.order_count}
              gigRequirements={gig.data.requirements}
              onContinue={(tier) => {
                navigate(`/checkout/${gig.data.id}?package=${tier}`);
              }}
              onContactSeller={handleChat}
            />
          </div>
        </section>
      </div>
    </article>
  );
}

export default UserDetails;
