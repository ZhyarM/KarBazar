import { useEffect, useState } from "react";
import { getMyGigs, deleteGig } from "../API/GigsAPI";
import type { Gig } from "../API/GigsAPI";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getImageUrl } from "../utils/imageUrl";
import {
  faPlus,
  faEdit,
  faTrash,
  faStar,
  faTimes,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import {
  createDeal,
  deleteDeal,
  fetchDeals,
  updateDeal,
  type DealItem,
} from "../API/DealsAPI";
import { useLanguage } from "../context/LanguageContext.tsx";

type DealFormState = {
  dealId: number | null;
  gigId: number | null;
  package_key: "basic" | "standard" | "premium";
  discount_percentage: number;
  expires_at: string;
  is_active: boolean;
};

const emptyDealForm = (
  gigId: number | null,
  packageKey: DealFormState["package_key"] = "basic",
): DealFormState => ({
  dealId: null,
  gigId,
  package_key: packageKey,
  discount_percentage: 10,
  expires_at: "",
  is_active: true,
});

const toDatetimeLocalValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

function MyGigs() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [discountGig, setDiscountGig] = useState<Gig | null>(null);
  const [discountDeals, setDiscountDeals] = useState<DealItem[]>([]);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountSaving, setDiscountSaving] = useState(false);
  const [discountForm, setDiscountForm] = useState<DealFormState>(
    emptyDealForm(null),
  );

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      const data = await getMyGigs();
      setGigs(data);
    } catch (error) {
      console.error("Failed to load gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gigId: number) => {
    if (!window.confirm(t("myGigs.confirmDelete"))) return;

    setDeleting(gigId);
    try {
      await deleteGig(gigId);
      await loadGigs();
    } catch (error) {
      console.error("Failed to delete gig:", error);
      alert("Failed to delete gig. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const openDiscountModal = async (gig: Gig) => {
    setDiscountGig(gig);
    setDiscountLoading(true);
    setDiscountDeals([]);
    setDiscountForm(emptyDealForm(gig.id));

    try {
      const response = await fetchDeals({ gig_id: gig.id, per_page: 50 });
      const deals = response.success ? response.data : [];
      setDiscountDeals(deals);

      const existingDeal =
        deals.find((deal) => deal.package_key === "basic") ?? deals[0] ?? null;
      if (existingDeal) {
        setDiscountForm({
          dealId: existingDeal.id,
          gigId: gig.id,
          package_key: existingDeal.package_key as DealFormState["package_key"],
          discount_percentage: existingDeal.discount_percentage,
          expires_at: toDatetimeLocalValue(existingDeal.expires_at),
          is_active: existingDeal.is_active,
        });
      }
    } catch (error) {
      console.error("Failed to load discount deals:", error);
    } finally {
      setDiscountLoading(false);
    }
  };

  const closeDiscountModal = () => {
    setDiscountGig(null);
    setDiscountDeals([]);
    setDiscountForm(emptyDealForm(null));
  };

  const selectPackageDeal = (packageKey: DealFormState["package_key"]) => {
    const match = discountDeals.find((deal) => deal.package_key === packageKey);

    if (match) {
      setDiscountForm({
        dealId: match.id,
        gigId: match.gig_id,
        package_key: packageKey,
        discount_percentage: match.discount_percentage,
        expires_at: toDatetimeLocalValue(match.expires_at),
        is_active: match.is_active,
      });
      return;
    }

    setDiscountForm((current) => ({
      ...emptyDealForm(current.gigId, packageKey),
      discount_percentage: current.discount_percentage,
    }));
  };

  const handleSaveDiscount = async () => {
    if (!discountForm.gigId) return;

    setDiscountSaving(true);
    try {
      const payload = {
        gig_id: discountForm.gigId,
        package_key: discountForm.package_key,
        discount_percentage: discountForm.discount_percentage,
        expires_at: discountForm.expires_at
          ? new Date(discountForm.expires_at).toISOString()
          : null,
        is_active: discountForm.is_active,
      };

      if (discountForm.dealId) {
        await updateDeal(discountForm.dealId, {
          discount_percentage: payload.discount_percentage,
          expires_at: payload.expires_at,
          is_active: payload.is_active,
        });
      } else {
        await createDeal(payload);
      }

      if (discountGig) {
        await openDiscountModal(discountGig);
      }
    } catch (error) {
      console.error("Failed to save discount:", error);
      alert(t("myGigs.discountSaveFailed"));
    } finally {
      setDiscountSaving(false);
    }
  };

  const handleDeleteDiscount = async () => {
    if (!discountForm.dealId) return;

    setDiscountSaving(true);
    try {
      await deleteDeal(discountForm.dealId);
      if (discountGig) {
        await openDiscountModal(discountGig);
      }
    } catch (error) {
      console.error("Failed to delete discount:", error);
      alert(t("myGigs.discountDeleteFailed"));
    } finally {
      setDiscountSaving(false);
    }
  };

  const activeGigPackages = discountGig
    ? [
        {
          key: "basic" as const,
          label: t("deals.package.basic"),
          price: discountGig.basic_price,
        },
        discountGig.standard_price != null
          ? {
              key: "standard" as const,
              label: t("deals.package.standard"),
              price: discountGig.standard_price,
            }
          : null,
        discountGig.premium_price != null
          ? {
              key: "premium" as const,
              label: t("deals.package.premium"),
              price: discountGig.premium_price,
            }
          : null,
      ]
        .filter(Boolean)
        .filter(
          (
            pkg,
          ): pkg is {
            key: "basic" | "standard" | "premium";
            label: string;
            price: number;
          } => pkg !== null,
        )
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-bg) py-8 px-4" dir={direction}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-(--color-text)">
            {t("myGigs.title")}
          </h1>
          <Link
            to="/create-gig"
            className="px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            {t("myGigs.createNew")}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
            <div className="text-(--color-text-muted) mb-2">
              {t("myGigs.total")}
            </div>
            <div className="text-3xl font-bold text-(--color-text)">
              {gigs.length}
            </div>
          </div>
          <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
            <div className="text-(--color-text-muted) mb-2">
              {t("myGigs.active")}
            </div>
            <div className="text-3xl font-bold text-green-600">
              {gigs.filter((g) => g.is_active).length}
            </div>
          </div>
          <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
            <div className="text-(--color-text-muted) mb-2">
              {t("myGigs.totalOrders")}
            </div>
            <div className="text-3xl font-bold text-(--color-primary)">
              {gigs.reduce(
                (sum, gig) => sum + (gig.total_orders ?? gig.order_count ?? 0),
                0,
              )}
            </div>
          </div>
        </div>

        {/* Gigs List */}
        {gigs.length === 0 ? (
          <div className="text-center py-16 bg-(--color-surface) rounded-lg">
            <p className="text-xl text-(--color-text-muted) mb-4">
              {t("myGigs.empty")}
            </p>
            <Link
              to="/create-gig"
              className="inline-block px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              {t("myGigs.first")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) =>
              (() => {
                const startingPrice =
                  gig.starting_price ?? gig.basic_price ?? 0;

                return (
                  <div
                    key={gig.id}
                    onClick={() => navigate(`/gigs/${gig.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        navigate(`/gigs/${gig.id}`);
                      }
                    }}
                    className="bg-(--color-surface) rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {/* Gig Image */}
                    <div className="relative">
                      <img
                        src={getImageUrl(gig.image_url)}
                        alt={gig.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            gig.is_active
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {gig.is_active
                            ? t("myGigs.activeStatus")
                            : t("myGigs.inactiveStatus")}
                        </span>
                      </div>
                    </div>

                    {/* Gig Details */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-(--color-text) mb-2 line-clamp-2">
                        {gig.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-(--color-text-muted) mb-4">
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon
                            icon={faStar}
                            className="text-yellow-500"
                          />
                          <span>{gig.rating}</span>
                          <span>
                            ({gig.total_reviews ?? gig.review_count ?? 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faShoppingCart} />
                          <span>
                            {gig.total_orders ?? gig.order_count ?? 0}{" "}
                            {t("dashboard.ordersSuffix")}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                          {t("dashboard.startingAt")}
                        </p>
                        <span className="text-lg font-bold text-green-600">
                          ${startingPrice}
                        </span>
                      </div>

                      {/* Actions */}
                      <div
                        className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => openDiscountModal(gig)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-amber-600 bg-amber-500 px-4 py-2.5 text-center font-semibold text-white transition-all hover:bg-amber-600"
                        >
                          <FontAwesomeIcon icon={faPlus} className="mr-2" />
                          {t("myGigs.addDiscount")}
                        </button>
                        <Link
                          to={`/edit-gig/${gig.id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-center font-semibold text-white transition-all hover:bg-blue-700"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                          {t("myGigs.edit")}
                        </Link>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(gig.id);
                          }}
                          disabled={deleting === gig.id}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          {t("myGigs.delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })(),
            )}
          </div>
        )}
      </div>

      {discountGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-(--color-surface) border border-(--color-border) shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-(--color-border) p-5">
              <div>
                <h2 className="text-2xl font-bold text-(--color-text)">
                  {t("myGigs.discountTitle")}
                </h2>
                <p className="text-sm text-(--color-text-muted) mt-1">
                  {discountGig.title}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDiscountModal}
                className="rounded-full p-2 text-(--color-text-muted) hover:bg-(--color-bg) hover:text-(--color-text)"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-(--color-text-muted) mb-3">
                    {t("myGigs.discountPackages")}
                  </h3>
                  <div className="grid gap-3">
                    {activeGigPackages.map((pkg) => {
                      const selected = discountForm.package_key === pkg.key;
                      const existingDeal = discountDeals.find(
                        (deal) => deal.package_key === pkg.key,
                      );

                      return (
                        <button
                          key={pkg.key}
                          type="button"
                          onClick={() => selectPackageDeal(pkg.key)}
                          className={`rounded-lg border p-4 text-left transition-all ${
                            selected
                              ? "border-(--color-primary) bg-(--color-primary)/10"
                              : "border-(--color-border) bg-(--color-surface) hover:border-(--color-primary)"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-(--color-text)">
                                {pkg.label}
                              </p>
                              <p className="text-sm text-(--color-text-muted)">
                                {t("myGigs.discountOriginalPrice")}: $
                                {pkg.price}
                              </p>
                            </div>
                            <span className="text-xs font-semibold rounded-full bg-(--color-bg) px-3 py-1 text-(--color-text-muted)">
                              {existingDeal
                                ? `${existingDeal.discount_percentage}% ${t("deals.off")}`
                                : t("myGigs.discountNoDeal")}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {discountDeals.length > 0 && (
                  <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-(--color-text-muted) mb-3">
                      {t("myGigs.discountCurrentDeals")}
                    </h3>
                    <div className="space-y-2">
                      {discountDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="rounded-lg bg-(--color-surface) border border-(--color-border) p-3 text-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-(--color-text)">
                              {t(`deals.package.${deal.package_key}`)}
                            </span>
                            <span className="text-(--color-text-muted)">
                              {deal.discount_percentage}% {t("deals.off")}
                            </span>
                          </div>
                          <div className="mt-1 text-(--color-text-muted)">
                            {deal.expires_at
                              ? new Date(deal.expires_at).toLocaleString()
                              : t("deals.noExpiry")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-(--color-border) bg-(--color-bg) p-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-(--color-text) mb-2">
                    {t("myGigs.discountPackage")}
                  </label>
                  <select
                    value={discountForm.package_key}
                    onChange={(event) =>
                      selectPackageDeal(
                        event.target.value as DealFormState["package_key"],
                      )
                    }
                    className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2 text-(--color-text)"
                  >
                    {activeGigPackages.map((pkg) => (
                      <option key={pkg.key} value={pkg.key}>
                        {pkg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--color-text) mb-2">
                    {t("myGigs.discountPercent")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountForm.discount_percentage}
                    onChange={(event) =>
                      setDiscountForm((current) => ({
                        ...current,
                        discount_percentage: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2 text-(--color-text)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--color-text) mb-2">
                    {t("myGigs.discountExpiresAt")}
                  </label>
                  <input
                    type="datetime-local"
                    value={discountForm.expires_at}
                    onChange={(event) =>
                      setDiscountForm((current) => ({
                        ...current,
                        expires_at: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-2 text-(--color-text)"
                  />
                </div>

                <label className="flex items-center gap-3 rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-3">
                  <input
                    type="checkbox"
                    checked={discountForm.is_active}
                    onChange={(event) =>
                      setDiscountForm((current) => ({
                        ...current,
                        is_active: event.target.checked,
                      }))
                    }
                    className="accent-(--color-primary)"
                  />
                  <span className="text-sm font-semibold text-(--color-text)">
                    {t("myGigs.discountActive")}
                  </span>
                </label>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveDiscount}
                    disabled={discountSaving || discountLoading}
                    className="rounded-lg bg-(--color-primary) px-5 py-2.5 font-semibold text-white disabled:opacity-50"
                  >
                    {discountSaving
                      ? t("myGigs.discountSaving")
                      : discountForm.dealId
                        ? t("myGigs.discountUpdate")
                        : t("myGigs.discountCreate")}
                  </button>

                  {discountForm.dealId && (
                    <button
                      type="button"
                      onClick={handleDeleteDiscount}
                      disabled={discountSaving || discountLoading}
                      className="rounded-lg border border-red-500 px-5 py-2.5 font-semibold text-red-600 disabled:opacity-50"
                    >
                      {t("myGigs.discountDelete")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGigs;
