import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { getAnnouncements, type Post } from "../../API/PostsAPI";
import { useLanguage } from "../../context/LanguageContext";

function HomeAnnouncements() {
  const { t, language } = useLanguage();
  const [announcements, setAnnouncements] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoading(true);
      try {
        const response = await getAnnouncements(1, 4);
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Failed to load announcements:", error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  return (
    <section className="bg-(--color-surface) rounded-2xl border border-(--color-border) p-5 mb-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-(--color-text) flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBullhorn}
              className="text-(--color-primary) text-base"
            />
            {t("home.announcements.title")}
          </h2>
          <p className="text-sm text-(--color-text-muted) mt-1">
            {t("home.announcements.subtitle")}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="h-20 rounded-xl bg-(--color-bg) animate-pulse"
            />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <p className="text-sm text-(--color-text-muted)">
          {t("home.announcements.empty")}
        </p>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="p-4 rounded-xl border border-(--color-border) bg-(--color-bg)"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-semibold text-(--color-primary)">
                  {t("home.announcements.badge")}
                </p>
                <time className="text-xs text-(--color-text-muted)">
                  {new Date(announcement.created_at).toLocaleDateString(
                    language === "ku" ? "ku-IQ" : "en-US",
                  )}
                </time>
              </div>

              <h3 className="font-semibold text-(--color-text) line-clamp-1">
                {announcement.title}
              </h3>
              <p className="text-sm text-(--color-text-muted) mt-1 line-clamp-2 whitespace-pre-line">
                {announcement.description}
              </p>

              <Link
                to={`/posts/${announcement.id}`}
                className="inline-flex mt-3 text-sm font-semibold text-(--color-primary) hover:opacity-85 transition-opacity"
              >
                {t("home.announcements.readMore")}
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeAnnouncements;
