import { useEffect, useState } from "react";
import {
  getAdminListings,
  getAdminPosts,
  moderateGigStatus,
  moderatePostStatus,
  type AdminGig,
  type AdminPost,
} from "../../API/AdminAPI";

function AdminListingsPage() {
  const [gigs, setGigs] = useState<AdminGig[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gigsData, postsData] = await Promise.all([
        getAdminListings(),
        getAdminPosts(),
      ]);
      setGigs(gigsData);
      setPosts(postsData);
    } catch (error) {
      console.error("Failed to load listings moderation data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleGigStatus = async (gig: AdminGig) => {
    try {
      await moderateGigStatus(gig.id, !gig.is_active);
      await loadData();
    } catch (error) {
      console.error("Failed to update gig status:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update listing status.",
      );
    }
  };

  const togglePostStatus = async (post: AdminPost) => {
    try {
      await moderatePostStatus(post.id, !post.is_active);
      await loadData();
    } catch (error) {
      console.error("Failed to update post status:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update post status.",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">
          Moderate Listings
        </h2>
        <p className="text-(--color-text-muted) mt-2">
          Enable or disable gigs and posts to keep marketplace content safe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-(--color-text) mb-4">
            Gigs
          </h3>
          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="border border-(--color-border) rounded-md p-3 bg-(--color-bg)"
              >
                <p className="font-semibold text-(--color-text)">{gig.title}</p>
                <p className="text-sm text-(--color-text-muted)">
                  Seller: {gig.seller?.name || "Unknown"}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      gig.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {gig.is_active ? "Active" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleGigStatus(gig)}
                    className="px-3 py-1 text-sm rounded-md border border-(--color-border) bg-(--color-surface)"
                  >
                    {gig.is_active ? "Hide" : "Restore"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-(--color-text) mb-4">
            Posts
          </h3>
          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-(--color-border) rounded-md p-3 bg-(--color-bg)"
              >
                <p className="font-semibold text-(--color-text)">
                  {post.title}
                </p>
                <p className="text-sm text-(--color-text-muted)">
                  Author: {post.user?.name || "Unknown"}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      post.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {post.is_active ? "Active" : "Hidden"}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePostStatus(post)}
                    className="px-3 py-1 text-sm rounded-md border border-(--color-border) bg-(--color-surface)"
                  >
                    {post.is_active ? "Hide" : "Restore"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminListingsPage;
