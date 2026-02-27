import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartSolid,
  faBookmark as faBookmarkSolid,
  faSpinner,
  faPaperPlane,
  faArrowLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
  faComment,
} from "@fortawesome/free-regular-svg-icons";
import {
  getPost,
  getPostComments,
  addPostComment,
  deletePostComment,
  togglePostLike,
  togglePostBookmark,
} from "../API/PostsAPI";
import type { Post, PostComment } from "../API/PostsAPI";
import { toggleFollow } from "../API/FollowAPI";
import { isAuthenticated } from "../API/apiClient";
import { getAvatarUrl } from "../utils/imageUrl";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const currentUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const postData = await getPost(Number(id));
        setPost(postData);
        setLiked(postData.is_liked);
        setLikesCount(postData.likes_count);
        setBookmarked(postData.is_bookmarked);
        setFollowing(postData.is_following_author);

        const commentsRes = await getPostComments(Number(id));
        setComments(commentsRes.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated() || !post) return;
    try {
      const res = await togglePostLike(post.id);
      setLiked(res.data.is_liked);
      setLikesCount(res.data.likes_count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated() || !post) return;
    try {
      const res = await togglePostBookmark(post.id);
      setBookmarked(res.data.is_bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated() || !post?.user) return;
    try {
      const res = await toggleFollow(post.user.id);
      setFollowing(res.data.is_following);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post) return;
    setSendingComment(true);
    try {
      const res = await addPostComment(post.id, commentText.trim());
      setComments([res.data, ...comments]);
      setCommentText("");
      setPost({ ...post, comments_count: post.comments_count + 1 });
    } catch (err) {
      console.error(err);
    }
    setSendingComment(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!post) return;
    try {
      await deletePostComment(post.id, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      setPost({
        ...post,
        comments_count: Math.max(0, post.comments_count - 1),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-3xl text-(--color-primary) animate-spin"
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-(--color-text-muted) text-lg">Post not found</p>
      </div>
    );
  }

  const isOwner = currentUser?.id === post.user?.id;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-(--color-text-muted) hover:text-(--color-text) mb-6 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Feed
      </Link>

      <div className="bg-(--color-surface) rounded-2xl shadow-md border border-(--color-border) overflow-hidden">
        {/* Author header */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <Link
              to={
                post.user?.profile?.username
                  ? `/profile/${post.user.profile.username}`
                  : "#"
              }
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-(--color-primary) flex items-center justify-center text-white font-bold text-lg">
                {post.user?.profile?.avatar_url ? (
                  <img
                    src={getAvatarUrl(post.user.profile.avatar_url)}
                    alt={post.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  post.user?.name?.charAt(0).toUpperCase()
                )}
              </div>
            </Link>
            <div>
              <Link
                to={
                  post.user?.profile?.username
                    ? `/profile/${post.user.profile.username}`
                    : "#"
                }
                className="font-semibold text-(--color-text) hover:underline"
              >
                {post.user?.name}
              </Link>
              <p className="text-sm text-(--color-text-muted)">
                {post.user?.profile?.title || post.user?.role}
                {" · "}
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {!isOwner && isAuthenticated() && (
            <button
              onClick={handleFollow}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                following
                  ? "border border-(--color-primary) text-(--color-primary)"
                  : "bg-(--color-primary) text-white"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-3">
          <h1 className="text-2xl font-bold text-(--color-text) mb-3">
            {post.title}
          </h1>
          <p className="text-(--color-text) leading-relaxed whitespace-pre-wrap">
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-(--color-bg) text-(--color-primary) rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {post.category && (
            <div className="mt-3">
              <span className="px-3 py-1 bg-(--color-accent)/10 text-(--color-accent) rounded-full text-sm font-medium">
                {post.category.name}
              </span>
            </div>
          )}
        </div>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="relative">
            <img
              src={post.images[imageIndex]}
              alt=""
              className="w-full max-h-125 object-cover"
            />
            {post.images.length > 1 && (
              <div className="flex justify-center gap-2 py-2 bg-(--color-bg)">
                {post.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === imageIndex
                        ? "border-(--color-primary)"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 px-5 py-4 border-t border-(--color-border)">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all ${
              liked
                ? "text-red-500"
                : "text-(--color-text-muted) hover:text-red-500"
            }`}
          >
            <FontAwesomeIcon
              icon={liked ? faHeartSolid : faHeartRegular}
              className="text-xl"
            />
            <span className="font-medium">{likesCount} likes</span>
          </button>

          <span className="flex items-center gap-2 text-(--color-text-muted)">
            <FontAwesomeIcon icon={faComment} className="text-xl" />
            <span className="font-medium">{post.comments_count} comments</span>
          </span>

          <button
            onClick={handleBookmark}
            className={`ml-auto transition-all ${
              bookmarked
                ? "text-(--color-primary)"
                : "text-(--color-text-muted) hover:text-(--color-primary)"
            }`}
          >
            <FontAwesomeIcon
              icon={bookmarked ? faBookmarkSolid : faBookmarkRegular}
              className="text-xl"
            />
          </button>
        </div>

        {/* Comment form */}
        {isAuthenticated() && (
          <form
            onSubmit={handleComment}
            className="flex items-center gap-3 px-5 py-3 border-t border-(--color-border)"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 rounded-full bg-(--color-bg) border border-(--color-border) text-(--color-text) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            <button
              type="submit"
              disabled={sendingComment || !commentText.trim()}
              className="p-2 text-(--color-primary) disabled:opacity-50"
            >
              <FontAwesomeIcon
                icon={sendingComment ? faSpinner : faPaperPlane}
                className={sendingComment ? "animate-spin" : ""}
              />
            </button>
          </form>
        )}

        {/* Comments */}
        <div className="px-5 pb-5">
          {comments.length === 0 ? (
            <p className="text-(--color-text-muted) text-sm py-4 text-center">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-(--color-primary) flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {comment.user.avatar_url ? (
                      <img
                        src={getAvatarUrl(comment.user.avatar_url)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      comment.user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-(--color-bg) rounded-xl px-3 py-2">
                      <span className="font-semibold text-sm text-(--color-text)">
                        {comment.user.name}
                      </span>
                      <p className="text-sm text-(--color-text) mt-0.5">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-1">
                      <span className="text-xs text-(--color-text-muted)">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      {currentUser?.id === comment.user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      )}
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2 ml-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-(--color-primary) flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                              {reply.user.avatar_url ? (
                                <img
                                  src={getAvatarUrl(reply.user.avatar_url)}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                reply.user.name?.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="bg-(--color-bg) rounded-xl px-3 py-1.5">
                              <span className="font-semibold text-xs text-(--color-text)">
                                {reply.user.name}
                              </span>
                              <p className="text-xs text-(--color-text)">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
