import { useState } from "react";
import type { FormEvent } from "react";
import { useEffect } from "react";
import {
  deleteAdminNews,
  getAdminNewsHistory,
  publishAdminNews,
  type AdminNewsItem,
} from "../../API/AdminAPI";
import { useLanguage } from "../../context/LanguageContext";

function AdminNewsPage() {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<AdminNewsItem[]>([]);

  const fieldClassName =
    "w-full px-3 py-2 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text) placeholder:text-(--color-text-muted)";

  const loadNewsHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getAdminNewsHistory();
      setNewsItems(data);
    } catch (error) {
      console.error("Failed to load news history:", error);
      setNewsItems([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadNewsHistory();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await publishAdminNews({ title, description });
      setTitle("");
      setDescription("");
      await loadNewsHistory();
      alert(t("admin.news.publishSuccess"));
    } catch (error) {
      console.error("Failed to publish news:", error);
      alert(
        error instanceof Error ? error.message : t("admin.news.publishFailed"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (newsId: number) => {
    const confirmed = window.confirm(t("admin.news.confirmDelete"));
    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminNews(newsId);
      await loadNewsHistory();
    } catch (error) {
      console.error("Failed to delete news:", error);
      alert(
        error instanceof Error ? error.message : t("admin.news.deleteFailed"),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">
          {t("admin.news.publishTitle")}
        </h2>
        <p className="text-(--color-text-muted) mt-2">
          {t("admin.news.publishDescription")}
        </p>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("admin.news.titlePlaceholder")}
            className={fieldClassName}
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("admin.news.bodyPlaceholder")}
            className={`${fieldClassName} min-h-[180px]`}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold disabled:opacity-50"
          >
            {submitting ? t("admin.news.publishing") : t("admin.news.publish")}
          </button>
        </form>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">
          {t("admin.news.historyTitle")}
        </h3>

        {historyLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-(--color-primary)"></div>
          </div>
        ) : newsItems.length === 0 ? (
          <p className="text-(--color-text-muted)">
            {t("admin.news.noHistory")}
          </p>
        ) : (
          <div className="space-y-3">
            {newsItems.map((item) => (
              <article
                key={item.id}
                className="border border-(--color-border) rounded-md p-4 bg-(--color-bg)"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-(--color-text) truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-(--color-text-muted) mt-1">
                      {new Date(item.created_at).toLocaleString(
                        language === "ku" ? "ku-IQ" : "en-US",
                      )}
                    </p>
                    <p className="text-sm text-(--color-text-muted) mt-2 line-clamp-3 whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm shrink-0"
                  >
                    {t("admin.news.delete")}
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

export default AdminNewsPage;
