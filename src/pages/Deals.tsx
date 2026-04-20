import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as Slider from "@radix-ui/react-slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faTag,
  faClock,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { fetchCategories } from "../API/CategoriesAPI.tsx";
import { fetchDeals, type DealItem } from "../API/DealsAPI";
import CountdownTimer from "../components/style_components/CountdownTimer";
import { getAvatarUrl, getImageUrl } from "../utils/imageUrl";
import { useLanguage } from "../context/LanguageContext.tsx";

type CategoryOption = {
  id: number;
  name: string;
};

function Deals() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [queryVersion, setQueryVersion] = useState(0);

  const [categoryId, setCategoryId] = useState<string>("");
  const [discountRange, setDiscountRange] = useState<[number, number]>([
    0, 100,
  ]);
  const [expiringSoon, setExpiringSoon] = useState(false);

  const locale = language === "ku" ? "ku-IQ" : "en-US";

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response.success) {
          setCategories(
            response.data.map((category) => ({
              id: category.id,
              name: category.name,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to load categories for deals:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadDeals = async () => {
      setLoading(true);
      try {
        const response = await fetchDeals({
          page,
          per_page: 12,
          category_id: categoryId ? Number(categoryId) : undefined,
          discount_min: discountRange[0],
          discount_max: discountRange[1],
          expiring_soon: expiringSoon,
        });

        if (response.success) {
          setDeals(response.data);
          setTotalPages(response.meta.last_page || 1);
        } else {
          setDeals([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Failed to load deals:", error);
        setDeals([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, [page, queryVersion]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);

  const activeCategoryName = useMemo(() => {
    if (!categoryId) return "";
    return (
      categories.find((category) => category.id === Number(categoryId))?.name ||
      ""
    );
  }, [categoryId, categories]);

  const applyFilters = () => {
    setPage(1);
    setQueryVersion((value) => value + 1);
  };

  const resetFilters = () => {
    setCategoryId("");
    setDiscountRange([0, 100]);
    setExpiringSoon(false);
    setPage(1);
    setQueryVersion((value) => value + 1);
  };

  const goToPage = (nextPage: number) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setPage(nextPage);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-bg)">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-primary) mb-2">
              <FontAwesomeIcon icon={faTag} />
              {t("deals.badge")}
            </p>
            <h1 className="text-3xl font-bold text-(--color-text)">
              {t("deals.title")}
            </h1>
            <p className="text-(--color-text-muted) mt-2 max-w-2xl">
              {t("deals.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-(--color-text-muted)">
            <FontAwesomeIcon icon={faFire} className="text-orange-500" />
            <span>{t("deals.expiringSoonHint")}</span>
          </div>
        </div>

        <div className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-4 md:p-5 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-(--color-text-muted) font-bold">
                {t("deals.filters.category")}
              </span>
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="px-3 py-2.5 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text)"
              >
                <option value="">{t("deals.filters.allCategories")}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-2 lg:col-span-2">
              <span className="text-xs uppercase tracking-widest text-(--color-text-muted) font-bold">
                {t("deals.filters.discountRange")}
              </span>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={discountRange}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) =>
                  setDiscountRange([value[0], value[1]])
                }
              >
                <Slider.Track className="relative bg-(--color-border) grow rounded-full h-1">
                  <Slider.Range className="absolute bg-(--color-primary) rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-(--color-bg) border-2 border-(--color-primary) rounded-full shadow-md focus:outline-none" />
                <Slider.Thumb className="block w-4 h-4 bg-(--color-bg) border-2 border-(--color-primary) rounded-full shadow-md focus:outline-none" />
              </Slider.Root>
              <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-muted)">
                <span>{discountRange[0]}%</span>
                <span>{discountRange[1]}%</span>
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-md border border-(--color-border) bg-(--color-bg) px-3 py-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={expiringSoon}
                onChange={(event) => setExpiringSoon(event.target.checked)}
                className="accent-(--color-primary)"
              />
              <span className="text-sm text-(--color-text)">
                {t("deals.filters.expiringSoon")}
              </span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold"
            >
              {t("deals.filters.apply")}
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 rounded-md border border-(--color-border) text-(--color-text) bg-(--color-surface) font-semibold"
            >
              {t("deals.filters.reset")}
            </button>

            <div className="ml-auto text-sm text-(--color-text-muted)">
              {categoryId && (
                <span className="mr-3">
                  {t("deals.filters.category")}: {activeCategoryName}
                </span>
              )}
              <span>
                {discountRange[0]}% - {discountRange[1]}%
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-(--color-border) bg-(--color-surface) overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-(--color-bg)" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-2/3 bg-(--color-bg) rounded-full" />
                  <div className="h-3 w-1/2 bg-(--color-bg) rounded-full" />
                  <div className="h-3 w-full bg-(--color-bg) rounded-full" />
                  <div className="h-10 bg-(--color-bg) rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface) p-12 text-center">
            <h2 className="text-xl font-bold text-(--color-text)">
              {t("deals.empty.title")}
            </h2>
            <p className="text-(--color-text-muted) mt-2">
              {t("deals.empty.subtitle")}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {deals.map((deal) => {
                const gig = deal.gig;
                const discountLabel = `${deal.discount_percentage}% ${t("deals.off")}`;

                return (
                  <article
                    key={deal.id}
                    className="group rounded-2xl overflow-hidden border border-(--color-border) bg-(--color-surface) shadow-sm hover:shadow-lg transition-all"
                  >
                    <Link to={`/gig/${gig.id}`} className="block relative">
                      <div className="relative h-48 bg-(--color-bg)">
                        <img
                          src={getImageUrl(gig.image_url)}
                          alt={gig.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                          {discountLabel}
                        </div>
                        {deal.is_expiring_soon && (
                          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md inline-flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} />
                            {t("deals.expiringSoon")}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link to={`/gig/${gig.id}`}>
                            <h3 className="text-lg font-bold text-(--color-text) line-clamp-2 group-hover:text-(--color-primary) transition-colors">
                              {gig.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-(--color-text-muted) mt-1 line-clamp-2">
                            {gig.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <img
                          src={getAvatarUrl(
                            gig.seller.profile?.avatar_url || gig.seller.image,
                          )}
                          alt={gig.seller.name}
                          className="w-9 h-9 rounded-full object-cover border border-(--color-border)"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-(--color-text) truncate">
                            {gig.seller.name}
                          </p>
                          <p className="text-xs text-(--color-text-muted) truncate">
                            {gig.category?.name || t("deals.noCategory")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-widest text-(--color-text-muted) font-bold">
                              {t(`deals.package.${deal.package_key}`)}
                            </p>
                            <p className="text-sm text-(--color-text-muted) mt-1">
                              {t("deals.originalPrice")}:{" "}
                              <span className="line-through">
                                ${formatPrice(deal.original_price)}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-extrabold text-(--color-primary)">
                              ${formatPrice(deal.discounted_price)}
                            </p>
                            <p className="text-xs text-(--color-text-muted)">
                              {t("deals.discountedPrice")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="inline-flex items-center gap-1 text-(--color-text-muted)">
                          <FontAwesomeIcon icon={faClock} className="text-xs" />
                          {deal.expires_at
                            ? t("deals.expiresIn")
                            : t("deals.noExpiry")}
                        </span>
                        {deal.expires_at && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-red-600 font-semibold text-xs">
                            <CountdownTimer
                              expiryDate={deal.expires_at}
                              className="whitespace-nowrap"
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-md border border-(--color-border) bg-(--color-surface) text-(--color-text) disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  {t("deals.pagination.previous")}
                </button>

                <span className="text-sm text-(--color-text-muted)">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-md border border-(--color-border) bg-(--color-surface) text-(--color-text) disabled:opacity-50"
                >
                  {t("deals.pagination.next")}
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Deals;
