import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartSolid,
  faComment,
  faBookmark as faBookmarkSolid,
  faEllipsisV,
  faTrash,
  faPen,
  faChevronLeft,
  faChevronRight,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
} from "@fortawesome/free-regular-svg-icons";
import type { Post } from "../../API/PostsAPI";
import {
  togglePostLike,
  togglePostBookmark,
  deletePost,
} from "../../API/PostsAPI";
import { toggleFollow } from "../../API/FollowAPI";
import { isAuthenticated } from "../../API/apiClient";
import { getAvatarUrl } from "../../utils/imageUrl";

interface PostCardProps {
  post: Post;
  currentUserId?: number;
  onPostDeleted?: (postId: number) => void;
}

function PostCard({ post, currentUserId, onPostDeleted }: PostCardProps) {
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [bookmarked, setBookmarked] = useState(post.is_bookmarked);
  const [following, setFollowing] = useState(post.is_following_author);
  const [showMenu, setShowMenu] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [likeAnim, setLikeAnim] = useState(false);
  const [expandedImage, setExpandedImage] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUserId === post.user?.id;
  const avatarUrl = getAvatarUrl(post.user?.profile?.avatar_url);
  const timeAgo = getTimeAgo(post.created_at);
  const hasImages = post.images && post.images.length > 0;
  const hasMultipleImages = post.images && post.images.length > 1;

  const handleLike = async () => {
    if (!isAuthenticated()) return;
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    try {
      const res = await togglePostLike(post.id);
      setLiked(res.data.is_liked);
      setLikesCount(res.data.likes_count);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated()) return;
    try {
      const res = await togglePostBookmark(post.id);
      setBookmarked(res.data.is_bookmarked);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated() || !post.user) return;
    try {
      const res = await toggleFollow(post.user.id);
      setFollowing(res.data.is_following);
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(post.id);
      onPostDeleted?.(post.id);
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.images) setImageIndex((prev) => (prev + 1) % post.images!.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.images)
      setImageIndex(
        (prev) => (prev - 1 + post.images!.length) % post.images!.length,
      );
  };

  return (
    <article className="group bg-(--color-surface) rounded-2xl overflow-hidden border border-(--color-border) transition-all duration-300 hover:border-(--color-primary)/30 hover:shadow-[0_8px_30px_rgba(49,91,181,0.08)]">
      {/* ── Header ────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3.5">
          {/* Avatar */}
          <Link
            to={
              post.user?.profile?.username
                ? `/profile/${post.user.profile.username}`
                : "#"
            }
            className="relative"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-(--color-primary)/20 ring-offset-2 ring-offset-(--color-surface) transition-all hover:ring-(--color-primary)/50">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={post.user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#315bb5] to-[#6D28D9] flex items-center justify-center text-white font-bold text-lg">
                  {post.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          </Link>

          {/* Name & meta */}
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <Link
                to={
                  post.user?.profile?.username
                    ? `/profile/${post.user.profile.username}`
                    : "#"
                }
                className="font-semibold text-(--color-text) hover:text-(--color-primary) transition-colors text-[0.95rem]"
              >
                {post.user?.name}
              </Link>
              {post.user?.role === "freelancer" && (
                <span className="px-1.5 py-0.5 bg-(--color-primary)/10 text-(--color-primary) rounded text-[0.6rem] font-bold uppercase tracking-wide">
                  PRO
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
              {post.user?.profile?.title && (
                <>
                  <span className="truncate max-w-40">
                    {post.user.profile.title}
                  </span>
                  <span className="opacity-40">·</span>
                </>
              )}
              <time>{timeAgo}</time>
            </div>
          </div>
        </div>

        {/* Right side: follow / menu */}
        <div className="flex items-center gap-2">
          {!isOwner && isAuthenticated() && post.user && (
            <button
              onClick={handleFollow}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                following
                  ? "bg-(--color-bg) text-(--color-text-muted) hover:text-red-400 hover:bg-red-50/10 border border-(--color-border)"
                  : "bg-(--color-primary) text-white hover:bg-(--color-primary-dark) shadow-sm shadow-(--color-primary)/20"
              }`}
            >
              {following ? "Following" : "+ Follow"}
            </button>
          )}

          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-(--color-bg) transition-colors text-(--color-text-muted) cursor-pointer"
              >
                <FontAwesomeIcon icon={faEllipsisV} className="text-sm" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-10 bg-(--color-surface) rounded-xl shadow-lg border border-(--color-border) z-20 min-w-35 py-1">
                    <Link
                      to={`/edit-post/${post.id}`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-(--color-bg) text-(--color-text) transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faPen}
                        className="text-xs text-(--color-text-muted)"
                      />
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-500 w-full transition-colors cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────── */}
      <div className="px-6 pb-3">
        <Link to={`/posts/${post.id}`} className="block group/title">
          <h3 className="font-bold text-[1.05rem] text-(--color-text) mb-1.5 group-hover/title:text-(--color-primary) transition-colors leading-snug">
            {post.title}
          </h3>
        </Link>
        <p className="text-(--color-text-muted) text-[0.9rem] leading-relaxed line-clamp-3 whitespace-pre-line">
          {post.description}
        </p>

        {/* Tags + Category row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {post.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-(--color-accent)/10 text-(--color-accent) rounded-lg text-[0.8rem] font-semibold">
              {post.category.name}
            </span>
          )}
          {post.tags &&
            post.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-(--color-bg) text-(--color-text-muted) rounded-lg text-[0.8rem] font-medium hover:text-(--color-primary) hover:bg-(--color-primary)/5 transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          {post.tags && post.tags.length > 4 && (
            <span className="px-2 py-1 text-(--color-text-muted) text-xs">
              +{post.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* ── Image Gallery ─────────────────────────── */}
      {hasImages && (
        <div className="relative mx-6 mb-4 rounded-xl overflow-hidden bg-(--color-bg) group/img">
          <Link to={`/posts/${post.id}`}>
            <img
              src={post.images![imageIndex]}
              alt={`Post image ${imageIndex + 1}`}
              className="w-full h-80 object-cover transition-transform duration-500 group-hover/img:scale-[1.02]"
              loading="lazy"
            />
          </Link>

          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none" />

          {/* Expand button */}
          <button
            onClick={() => setExpandedImage(!expandedImage)}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon icon={faExpand} className="text-xs" />
          </button>

          {/* Navigation arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
              {post.images!.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageIndex(i);
                  }}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === imageIndex
                      ? "w-5 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Image counter badge */}
          {hasMultipleImages && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
              {imageIndex + 1} / {post.images!.length}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen image overlay */}
      {expandedImage && hasImages && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 cursor-pointer"
          onClick={() => setExpandedImage(false)}
        >
          <img
            src={post.images![imageIndex]}
            alt="Expanded"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      {/* ── Action Bar ────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-(--color-border)/50">
        <div className="flex items-center gap-1">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer ${
              liked
                ? "text-red-500 bg-red-500/10"
                : "text-(--color-text-muted) hover:text-red-500 hover:bg-red-500/5"
            }`}
          >
            <FontAwesomeIcon
              icon={liked ? faHeartSolid : faHeartRegular}
              className={`text-lg ${likeAnim ? "animate-bounce" : ""}`}
            />
            <span className="text-[0.9rem] font-medium">{likesCount}</span>
          </button>

          {/* Comment */}
          <Link
            to={`/posts/${post.id}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-(--color-text-muted) hover:text-(--color-primary) hover:bg-(--color-primary)/5 transition-all"
          >
            <FontAwesomeIcon icon={faComment} className="text-lg" />
            <span className="text-[0.9rem] font-medium">
              {post.comments_count}
            </span>
          </Link>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer ${
            bookmarked
              ? "text-(--color-primary) bg-(--color-primary)/10"
              : "text-(--color-text-muted) hover:text-(--color-primary) hover:bg-(--color-primary)/5"
          }`}
        >
          <FontAwesomeIcon
            icon={bookmarked ? faBookmarkSolid : faBookmarkRegular}
            className="text-lg"
          />
          <span className="text-sm font-medium">
            {bookmarked ? "Saved" : "Save"}
          </span>
        </button>
      </div>
    </article>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  return date.toLocaleDateString();
}

export default PostCard;
