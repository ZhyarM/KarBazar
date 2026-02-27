import { useState, useEffect, useCallback, useRef } from "react";
import PostCard from "../../components/cards/PostCard";
import { getPostFeed, getPublicFeed } from "../../API/PostsAPI";
import type { Post } from "../../API/PostsAPI";
import { isAuthenticated } from "../../API/apiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faNewspaper,
  faUserPlus,
  faRss,
} from "@fortawesome/free-solid-svg-icons";

interface PostFeedProps {
  currentUserId?: number;
}

function PostFeed({ currentUserId }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async (pageNum: number, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = isAuthenticated()
        ? await getPostFeed(pageNum, 10)
        : await getPublicFeed(pageNum, 10);

      const newPosts = response.data;
      const meta = response.meta;

      if (append) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setHasMore(meta ? meta.current_page < meta.last_page : false);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // Infinite scrolling
  useEffect(() => {
    // Don't set up observer while initial load or a fetch is in progress,
    // or when there's nothing left to load
    if (loading || loadingMore || !hasMore) {
      if (observerRef.current) observerRef.current.disconnect();
      return;
    }

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
  }, [hasMore, loadingMore, loading, page, fetchPosts]);

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // ── Skeleton loader ──
  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-(--color-surface) rounded-2xl border border-(--color-border) overflow-hidden animate-pulse"
          >
            {/* Header skeleton */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-3">
              <div className="w-11 h-11 rounded-full bg-(--color-bg)" />
              <div className="flex-1">
                <div className="h-3.5 w-32 bg-(--color-bg) rounded-full mb-2" />
                <div className="h-2.5 w-48 bg-(--color-bg) rounded-full" />
              </div>
              <div className="h-7 w-20 bg-(--color-bg) rounded-full" />
            </div>
            {/* Content skeleton */}
            <div className="px-5 pb-3">
              <div className="h-4 w-3/4 bg-(--color-bg) rounded-full mb-2" />
              <div className="h-3 w-full bg-(--color-bg) rounded-full mb-1.5" />
              <div className="h-3 w-5/6 bg-(--color-bg) rounded-full mb-3" />
              <div className="flex gap-1.5">
                <div className="h-6 w-16 bg-(--color-bg) rounded-lg" />
                <div className="h-6 w-20 bg-(--color-bg) rounded-lg" />
                <div className="h-6 w-14 bg-(--color-bg) rounded-lg" />
              </div>
            </div>
            {/* Image skeleton */}
            {i !== 1 && (
              <div className="mx-5 mb-3 h-56 bg-(--color-bg) rounded-xl" />
            )}
            {/* Actions skeleton */}
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
    );
  }

  // ── Empty state ──
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5">
        <div className="w-20 h-20 rounded-2xl bg-(--color-primary)/10 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faNewspaper}
            className="text-3xl text-(--color-primary)"
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-(--color-text) mb-1">
            No posts yet
          </h3>
          <p className="text-(--color-text-muted) text-sm max-w-xs">
            {isAuthenticated()
              ? "Follow some freelancers to see their posts in your feed!"
              : "Sign in to see personalized posts in your feed!"}
          </p>
        </div>
        {isAuthenticated() && (
          <div className="flex gap-3 mt-2">
            <a
              href="/browse-gigs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-(--color-primary) text-white rounded-xl text-sm font-semibold hover:bg-(--color-primary-dark) transition-colors shadow-sm"
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
              Discover Freelancers
            </a>
            <a
              href="/categories"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-(--color-bg) text-(--color-text) rounded-xl text-sm font-semibold hover:bg-(--color-border) transition-colors border border-(--color-border)"
            >
              <FontAwesomeIcon icon={faRss} className="text-xs" />
              Browse Categories
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onPostDeleted={handlePostDeleted}
        />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-12 flex justify-center items-center">
        {loadingMore && (
          <div className="flex items-center gap-2 text-(--color-text-muted)">
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-lg text-(--color-primary) animate-spin"
            />
            <span className="text-sm">Loading more posts...</span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="flex items-center gap-2 text-(--color-text-muted) text-sm">
            <div className="h-px w-12 bg-(--color-border)" />
            <span>You're all caught up</span>
            <div className="h-px w-12 bg-(--color-border)" />
          </div>
        )}
      </div>
    </div>
  );
}

export default PostFeed;
