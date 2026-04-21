import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createAdminDeal,
  deleteAdminDeal,
  getAdminDeals,
  updateAdminDeal,
  type AdminDeal,
  type DealFormPayload,
} from "../../API/AdminAPI";

const packageOptions: Array<DealFormPayload["package_key"]> = [
  "basic",
  "standard",
  "premium",
];

function AdminDealsPage() {
  const [deals, setDeals] = useState<AdminDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    gig_id: "",
    package_key: "basic" as DealFormPayload["package_key"],
    discount_percentage: "",
    expires_at: "",
    is_active: true,
  });

  const fieldClassName =
    "px-3 py-2 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text) placeholder:text-(--color-text-muted)";

  const loadDeals = async () => {
    setLoading(true);
    try {
      const data = await getAdminDeals({ per_page: 50 });
      setDeals(data);
    } catch (error) {
      console.error("Failed to load deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    const gigId = Number(form.gig_id);
    const discountPercentage = Number(form.discount_percentage);

    if (!Number.isFinite(gigId) || gigId <= 0) {
      alert("Enter a valid gig ID.");
      return;
    }

    if (!Number.isFinite(discountPercentage) || discountPercentage <= 0) {
      alert("Enter a valid discount percentage.");
      return;
    }

    setSaving(true);
    try {
      await createAdminDeal({
        gig_id: gigId,
        package_key: form.package_key,
        discount_percentage: discountPercentage,
        expires_at: form.expires_at || null,
        is_active: form.is_active,
      });
      setForm({
        gig_id: "",
        package_key: "basic",
        discount_percentage: "",
        expires_at: "",
        is_active: true,
      });
      await loadDeals();
    } catch (error) {
      console.error("Failed to create deal:", error);
      alert(error instanceof Error ? error.message : "Failed to create deal.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (deal: AdminDeal) => {
    try {
      await updateAdminDeal(deal.id, { is_active: !deal.is_active });
      await loadDeals();
    } catch (error) {
      console.error("Failed to update deal:", error);
      alert(error instanceof Error ? error.message : "Failed to update deal.");
    }
  };

  const handleEdit = async (deal: AdminDeal) => {
    const nextDiscount = window.prompt(
      "Discount percentage",
      String(deal.discount_percentage),
    );

    if (nextDiscount === null) {
      return;
    }

    const nextExpiry = window.prompt(
      "Expiry date (YYYY-MM-DD or leave blank for no expiry)",
      deal.expires_at ? deal.expires_at.slice(0, 10) : "",
    );

    const discountPercentage = Number(nextDiscount);
    if (!Number.isFinite(discountPercentage) || discountPercentage <= 0) {
      alert("Enter a valid discount percentage.");
      return;
    }

    try {
      await updateAdminDeal(deal.id, {
        discount_percentage: discountPercentage,
        expires_at: nextExpiry?.trim() ? nextExpiry.trim() : null,
      });
      await loadDeals();
    } catch (error) {
      console.error("Failed to edit deal:", error);
      alert(error instanceof Error ? error.message : "Failed to update deal.");
    }
  };

  const handleDelete = async (deal: AdminDeal) => {
    const confirmed = window.confirm(
      `Delete the ${deal.package_label} deal for ${deal.gig.title}?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminDeal(deal.id);
      await loadDeals();
    } catch (error) {
      console.error("Failed to delete deal:", error);
      alert(error instanceof Error ? error.message : "Failed to delete deal.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">Manage Deals</h2>
        <p className="text-(--color-text-muted) mt-2">
          Create and manage active discounts for gigs using the existing package
          discount system.
        </p>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-5 gap-3"
        >
          <input
            value={form.gig_id}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, gig_id: e.target.value }))
            }
            placeholder="Gig ID"
            className={fieldClassName}
            inputMode="numeric"
            required
          />
          <select
            value={form.package_key}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                package_key: e.target.value as DealFormPayload["package_key"],
              }))
            }
            className={fieldClassName}
          >
            {packageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            value={form.discount_percentage}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                discount_percentage: e.target.value,
              }))
            }
            placeholder="Discount %"
            className={fieldClassName}
            inputMode="decimal"
            required
          />
          <input
            value={form.expires_at}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, expires_at: e.target.value }))
            }
            placeholder="Expiry date (optional)"
            className={fieldClassName}
            type="date"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Deal"}
          </button>
          <label className="md:col-span-5 flex items-center gap-2 text-sm text-(--color-text-muted)">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, is_active: e.target.checked }))
              }
            />
            Publish immediately
          </label>
        </form>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-(--color-primary)"></div>
          </div>
        ) : deals.length === 0 ? (
          <p className="text-(--color-text-muted)">No active deals found.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {deals.map((deal) => (
              <article
                key={deal.id}
                className="border border-(--color-border) rounded-lg p-4 bg-(--color-bg)"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-(--color-text)">
                      {deal.gig.title}
                    </p>
                    <p className="text-sm text-(--color-text-muted)">
                      {deal.package_label} package · {deal.discount_percentage}%
                      off
                    </p>
                    <p className="text-sm text-(--color-text-muted) mt-1">
                      Seller: {deal.gig.seller.name} · Category:{" "}
                      {deal.gig.category.name}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      deal.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {deal.is_active ? "Active" : "Paused"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-(--color-text-muted)">
                  <div>
                    Original:{" "}
                    <span className="text-(--color-text)">
                      {deal.original_price}
                    </span>
                  </div>
                  <div>
                    Discounted:{" "}
                    <span className="text-(--color-text)">
                      {deal.discounted_price}
                    </span>
                  </div>
                  <div>
                    Expires:{" "}
                    <span className="text-(--color-text)">
                      {deal.expires_at
                        ? new Date(deal.expires_at).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                  <div>
                    Expiring soon:{" "}
                    <span className="text-(--color-text)">
                      {deal.is_expiring_soon ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(deal)}
                    className="px-3 py-1 rounded-md border border-(--color-border) text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(deal)}
                    className="px-3 py-1 rounded-md border border-(--color-border) text-sm"
                  >
                    {deal.is_active ? "Pause" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(deal)}
                    className="px-3 py-1 rounded-md border border-red-500/20 bg-red-500/10 text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDealsPage;
