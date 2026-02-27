import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchGigByID } from "../API/gigs/getGigByID";
import { createOrder } from "../API/OrdersAPI";
import LoadingCircle from "../utils/loading";
import type { GigresponseByID } from "../API/gigs/getGigByID";
import { getImageUrl, getAvatarUrl } from "../utils/imageUrl";
import MessageToast from "../utils/message";

function Checkout() {
  const { gigId } = useParams<{ gigId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [gig, setGig] = useState<GigresponseByID>();
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const packageTier = (searchParams.get("package") || "basic") as
    | "basic"
    | "standard"
    | "premium";

  useEffect(() => {
    const loadGig = async () => {
      if (!gigId) return;
      setLoading(true);
      try {
        const response = await fetchGigByID({ id: Number(gigId) });
        if (response.success) {
          setGig(response);
        }
      } catch (error) {
        console.error("Error loading gig:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGig();
  }, [gigId]);

  const handlePlaceOrder = async () => {
    if (!gigId) return;
    setPlacing(true);
    try {
      await createOrder(Number(gigId), packageTier, requirements || undefined);
      setSuccess(true);
      setMessage("Order placed successfully!");
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error: any) {
      console.error("Error placing order:", error);
      setSuccess(false);
      setMessage(error.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading || !gig) {
    return <LoadingCircle size={14} />;
  }

  const selectedPackage = (gig.data.packages as any)?.[packageTier];
  const packageName =
    packageTier.charAt(0).toUpperCase() + packageTier.slice(1);

  return (
    <div className="w-full min-h-screen bg-(--color-bg) py-8 px-6">
      <MessageToast
        visible={success !== null}
        message={message}
        success={success}
        onClose={() => {
          setSuccess(null);
          setMessage(null);
        }}
      />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-(--color-text) mb-2">
          Place Order
        </h1>
        <p className="text-(--color-text-muted) mb-8">
          This service is completely free for clients
        </p>

        <div className="flex flex-col gap-6">
          {/* Gig Summary */}
          <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-6">
            <h2 className="text-lg font-bold text-(--color-text) mb-4">
              Order Summary
            </h2>

            <div className="flex gap-4 pb-4 border-b border-(--color-border) mb-4">
              <img
                src={getImageUrl(gig.data.image_url) || ""}
                alt={gig.data.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-(--color-text) mb-1">
                  {gig.data.title}
                </h3>
                <p className="text-sm text-(--color-text-muted) mb-2">
                  by {gig.data.seller.name}
                </p>
                <span className="text-xs bg-(--color-primary) text-(--color-text-inverse) px-2 py-1 rounded font-medium">
                  {packageName} Package
                </span>
              </div>
            </div>

            {/* Package Details */}
            {selectedPackage && (
              <div className="space-y-3">
                <p className="text-sm text-(--color-text)">
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedPackage.description}
                </p>
                <p className="text-sm text-(--color-text)">
                  <span className="font-semibold">Delivery:</span>{" "}
                  {selectedPackage.delivery_time} days
                </p>
                {Array.isArray(selectedPackage.features) &&
                  selectedPackage.features.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm text-(--color-text) mb-1">
                        Includes:
                      </p>
                      <ul className="space-y-1">
                        {selectedPackage.features.map(
                          (feature: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-(--color-text-muted) flex items-center gap-2"
                            >
                              <span className="text-green-500">✓</span>
                              {feature}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Seller Info */}
          <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-6">
            <h2 className="text-lg font-bold text-(--color-text) mb-4">
              Seller
            </h2>
            <div className="flex items-center gap-4">
              {gig.data.seller.profile.avatar_url ? (
                <img
                  src={getAvatarUrl(gig.data.seller.profile.avatar_url)}
                  alt={gig.data.seller.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-(--color-border)"
                />
              ) : (
                <span className="flex items-center justify-center w-14 h-14 text-lg font-bold rounded-full bg-(image:--gradient-secondary) text-(--color-text)">
                  {gig.data.seller.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <h3 className="font-semibold text-(--color-text)">
                  {gig.data.seller.name}
                </h3>
                <p className="text-sm text-(--color-text-muted)">
                  @{gig.data.seller.profile.username}
                </p>
                <p className="text-sm text-(--color-text)">
                  ⭐ {gig.data.seller.profile.rating} (
                  {gig.data.seller.profile.total_reviews} reviews)
                </p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-6">
            <h2 className="text-lg font-bold text-(--color-text) mb-2">
              Your Requirements
            </h2>
            <p className="text-sm text-(--color-text-muted) mb-3">
              Provide details about what you need so the seller can deliver the
              best work.
            </p>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={5}
              placeholder="Describe your project requirements..."
              className="w-full px-4 py-3 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all"
            />
          </div>

          {/* Price Summary - Free */}
          <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-(--color-text)">
                Total
              </span>
              <span className="text-2xl font-bold text-green-500">FREE</span>
            </div>
            <p className="text-sm text-(--color-text-muted) mb-6">
              No payment required. This platform is free for clients.
            </p>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full py-3 rounded-lg bg-(--color-primary) text-(--color-text-inverse) font-semibold text-lg hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>

            <button
              onClick={() => navigate(`/gig/${gigId}`)}
              className="w-full py-3 mt-2 rounded-lg bg-(--color-bg-muted) text-(--color-text) font-medium hover:bg-(--color-border) transition-all cursor-pointer"
            >
              Back to Gig
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
