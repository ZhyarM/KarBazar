import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faTags,
  faPaperPlane,
  faSpinner,
  faXmark,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { createPost, updatePost, getPost } from "../API/PostsAPI";
import type { CreatePostData } from "../API/PostsAPI";
import { apiCall } from "../API/apiClient";
import MessageToast from "../utils/message";

interface Category {
  id: number;
  name: string;
  slug: string;
}

function CreatePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load categories
    apiCall<{ success: boolean; data: Category[] }>("/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);

    // Load existing post if editing
    if (isEditing && id) {
      getPost(Number(id))
        .then((post) => {
          setTitle(post.title);
          setDescription(post.description);
          setCategoryId(post.category?.id);
          setTags(post.tags || []);
          setImages(post.images || []);
        })
        .catch(console.error);
    }
  }, [id, isEditing]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      const data: CreatePostData = {
        title,
        description,
        category_id: categoryId,
        tags: tags.length > 0 ? tags : undefined,
        images: images.length > 0 ? images : undefined,
      };

      if (isEditing && id) {
        await updatePost(Number(id), data);
        setSuccess(true);
        setMessage("Post updated successfully!");
      } else {
        await createPost(data);
        setSuccess(true);
        setMessage("Post created successfully!");
      }

      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setSuccess(false);
      setMessage(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MessageToast
        visible={success !== null}
        message={message}
        success={success}
        onClose={() => {
          setSuccess(null);
          setMessage(null);
        }}
      />

      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-(--color-surface) text-(--color-text-muted) transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-bold text-(--color-text)">
            {isEditing ? "Edit Post" : "Create Post"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-(--color-text) mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a catchy title"
              required
              className="w-full px-4 py-3 rounded-xl bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-(--color-text) mb-1.5">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you want to share?"
              required
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-(--color-text) mb-1.5">
              Category
            </label>
            <select
              value={categoryId || ""}
              onChange={(e) =>
                setCategoryId(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="w-full px-4 py-3 rounded-xl bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-(--color-text) mb-1.5">
              <FontAwesomeIcon icon={faTags} className="mr-1" /> Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-3 py-1 bg-(--color-primary)/10 text-(--color-primary) rounded-full text-sm font-medium"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(i)}>
                    <FontAwesomeIcon icon={faXmark} className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-4 py-2 rounded-xl bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary) text-sm"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-(--color-primary) text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Add
              </button>
            </div>
          </div>

          {/* Image URLs (simple approach) */}
          <div>
            <label className="block text-sm font-semibold text-(--color-text) mb-1.5">
              <FontAwesomeIcon icon={faImage} className="mr-1" /> Images
            </label>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder="Paste image URL and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const url = (e.target as HTMLInputElement).value.trim();
                  if (url && images.length < 5) {
                    setImages([...images, url]);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
              className="w-full px-4 py-2 rounded-xl bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary) text-sm"
            />
            <p className="text-xs text-(--color-text-muted) mt-1">
              Max 5 images. Press Enter after each URL.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !title.trim() || !description.trim()}
            className="w-full py-3 bg-(--color-primary) text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} />
                {isEditing ? "Update Post" : "Publish Post"}
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreatePost;
