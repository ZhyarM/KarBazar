import { useState, useEffect, useCallback, useRef } from "react";
import PostCard from "../../components/cards/PostCard";
import { getUserPosts } from "../../API/PostsAPI";
import type { Post } from "../../API/PostsAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faNewspaper } from "@fortawesome/free-solid-svg-icons";

interface UserPostsProps {
  userId: number;
  currentUserId?: number;
  isOwner?: boolean;
}

function UserPosts({ userId, currentUserId, isOwner }: UserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(
    async (pageNum: number, append = false) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const response = await getUserPosts(userId, pageNum);
        const newPosts = response.data;
        const meta = response.meta;

        if (append) {
          setPosts((prev) => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }

        setHasMore(meta ? meta.current_page < meta.last_page : false);
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [userId, fetchPosts]);

  // Infinite scrolling
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPosts(nextPage, true);
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, page, fetchPosts]);

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Skeleton loader
  if (loading) {
    return (
      <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
        <h3 className="text-lg font-bold text-(--color-text) mb-5">Posts</h3>
        <div className="flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-(--color-surface) rounded-2xl border border-(--color-border) overflow-hidden animate-pulse"
            >
              <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <div className="w-11 h-11 rounded-full bg-(--color-bg)" />
                <div className="flex-1">
                  <div className="h-3.5 w-32 bg-(--color-bg) rounded-full mb-2" />
                  <div className="h-2.5 w-48 bg-(--color-bg) rounded-full" />
                </div>
              </div>
              <div className="px-5 pb-3">
                <div className="h-4 w-3/4 bg-(--color-bg) rounded-full mb-2" />
                <div className="h-3 w-full bg-(--color-bg) rounded-full mb-1.5" />
                <div className="h-3 w-5/6 bg-(--color-bg) rounded-full" />
              </div>
              {i === 0 && (
                <div className="mx-5 mb-3 h-44 bg-(--color-bg) rounded-xl" />
              )}
              <div className="flex justify-between px-5 py-3 border-t border-(--color-border)/50">
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-(--color-bg) rounded-full" />
                  <div className="h-8 w-16 bg-(--color-bg) rounded-full" />
                </div>
                <div className="h-8 w-16 bg-(--color-bg) rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
        <h3 className="text-lg font-bold text-(--color-text) mb-5">Posts</h3>
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-(--color-primary)/10 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faNewspaper}
              className="text-2xl text-(--color-primary)"
            />
          </div>
          <div className="text-center">
            <h4 className="text-base font-semibold text-(--color-text) mb-1">
              No posts yet
            </h4>
            <p className="text-(--color-text-muted) text-sm">
              {isOwner
                ? "Share your first post with the community!"
                : "This user hasn't published any posts yet."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-(--color-text)">
          Posts{" "}
          <span className="text-sm font-normal text-(--color-text-muted)">
            ({posts.length}
            {hasMore ? "+" : ""})
          </span>
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onPostDeleted={handlePostDeleted}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-4">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-xl text-(--color-primary) animate-spin"
          />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-(--color-text-muted) text-sm py-3">
          No more posts
        </p>
      )}
    </div>
  );
}

export default UserPosts;
