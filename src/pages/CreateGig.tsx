import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createGig, updateGig, getGig } from "../API/GigsAPI";
import type { CreateGigData } from "../API/GigsAPI";
import { getCategories } from "../API/CategoriesAPI";
import { uploadGigImage, uploadGigGallery } from "../API/UploadAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faUpload,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import MessageToast from "../utils/message";
import { getImageUrl } from "../utils/imageUrl";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface FAQ {
  question: string;
  answer: string;
}

function CreateGig() {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id?: string }>();
  const isEditMode = !!editId;

  const [loading, setLoading] = useState(false);
  const [loadingGig, setLoadingGig] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateGigData>({
    category_id: 0,
    title: "",
    description: "",
    tags: [],
    basic_price: 0,
    basic_delivery_time: 1,
    basic_description: "",
    standard_price: undefined,
    standard_delivery_time: undefined,
    standard_description: undefined,
    premium_price: undefined,
    premium_delivery_time: undefined,
    premium_description: undefined,
    faqs: [],
    requirements: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  // Check role authorization
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const allowedRoles = ["business", "freelancer", "admin"];
    if (!currentUser.id || !allowedRoles.includes(currentUser.role)) {
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    if (isEditMode && editId) {
      loadExistingGig(Number(editId));
    }
  }, [editId]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadExistingGig = async (gigId: number) => {
    setLoadingGig(true);
    try {
      const gig = await getGig(gigId);
      // Check ownership
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (gig.seller_id !== currentUser.id && currentUser.role !== "admin") {
        setSuccess(false);
        setMessage("You can only edit your own gigs");
        setTimeout(() => navigate("/my-gigs"), 2000);
        return;
      }

      setFormData({
        category_id: gig.category_id,
        title: gig.title,
        description: gig.description,
        tags: gig.tags
          ? typeof gig.tags === "string"
            ? JSON.parse(gig.tags)
            : gig.tags
          : [],
        basic_price: gig.basic_price || 0,
        basic_delivery_time: gig.basic_delivery_time || 1,
        basic_description: gig.basic_description || "",
        standard_price: gig.standard_price || undefined,
        standard_delivery_time: gig.standard_delivery_time || undefined,
        standard_description: gig.standard_description || undefined,
        premium_price: gig.premium_price || undefined,
        premium_delivery_time: gig.premium_delivery_time || undefined,
        premium_description: gig.premium_description || undefined,
        requirements: gig.requirements || "",
        faqs: [],
      });

      // Handle existing image
      if (gig.image_url) {
        const url = getImageUrl(gig.image_url);
        setExistingImageUrl(url || "");
        setImagePreview(url || "");
      }

      // Handle existing gallery
      if (gig.gallery) {
        const galleryArr =
          typeof gig.gallery === "string"
            ? JSON.parse(gig.gallery)
            : gig.gallery;
        if (Array.isArray(galleryArr)) {
          const urls = galleryArr
            .map((img: string) => getImageUrl(img) || "")
            .filter(Boolean);
          setExistingGallery(urls);
          setGalleryPreviews(urls);
        }
      }

      // Handle FAQs
      if (gig.faqs) {
        const faqData =
          typeof gig.faqs === "string" ? JSON.parse(gig.faqs) : gig.faqs;
        if (Array.isArray(faqData)) {
          setFaqs(faqData);
        }
      }
    } catch (error) {
      console.error("Failed to load gig:", error);
      setSuccess(false);
      setMessage("Failed to load gig for editing");
    } finally {
      setLoadingGig(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setExistingImageUrl("");
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(files);
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
    setExistingGallery([]);
  };

  const addTag = () => {
    if (tagInput.trim() && formData.tags && formData.tags.length < 5) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const updateFAQ = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = existingImageUrl ? undefined : "";
      let galleryUrls: string[] | undefined =
        existingGallery.length > 0 ? undefined : [];

      // Upload main image if new file selected
      if (imageFile) {
        imageUrl = await uploadGigImage(imageFile);
      }

      // Upload gallery images if new files selected
      if (galleryFiles.length > 0) {
        galleryUrls = await uploadGigGallery(galleryFiles);
      }

      // Prepare data
      const gigData: CreateGigData = {
        ...formData,
        faqs: faqs.filter((faq) => faq.question && faq.answer),
      };

      // Only include image/gallery if we have new ones
      if (imageUrl !== undefined) {
        gigData.image_url = imageUrl;
      }
      if (galleryUrls !== undefined) {
        gigData.gallery = galleryUrls;
      }

      if (isEditMode && editId) {
        await updateGig(Number(editId), gigData);
        setSuccess(true);
        setMessage("Gig updated successfully!");
        setTimeout(() => {
          navigate(`/gigs/${editId}`);
        }, 2000);
      } else {
        const createdGig = await createGig(gigData);
        setSuccess(true);
        setMessage("Gig created successfully!");
        setTimeout(() => {
          navigate(`/gigs/${createdGig.id}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error("Gig save error:", error);
      setSuccess(false);
      setMessage(
        error.message || `Failed to ${isEditMode ? "update" : "create"} gig`,
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Show unauthorized message
  if (authorized === false) {
    return (
      <div className="min-h-screen bg-(--color-bg) flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-(--color-surface) rounded-lg p-8 shadow-md border border-(--color-border)">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-(--color-text) mb-2">
            Access Denied
          </h2>
          <p className="text-(--color-text-muted) mb-6">
            Only business accounts can create and manage gigs. Please upgrade
            your account or sign in with a business account.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-(--color-primary) text-(--color-text-inverse) rounded-lg hover:opacity-90 transition-all cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loadingGig) {
    return (
      <div className="min-h-screen bg-(--color-bg) flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-bg) py-8 px-4">
      <MessageToast
        visible={success !== null}
        message={message}
        success={success}
        onClose={() => {
          setSuccess(null);
          setMessage(null);
        }}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-(--color-text) mb-8">
          {isEditMode ? "Edit Gig" : "Create New Gig"}
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= step
                    ? "bg-(--color-primary) text-white"
                    : "bg-(--color-surface) text-(--color-text-muted)"
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step
                      ? "bg-(--color-primary)"
                      : "bg-(--color-surface)"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-(--color-surface) rounded-lg p-8 shadow-md"
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-(--color-text) mb-4">
                Basic Information
              </h2>

              <div>
                <label className="block text-(--color-text) font-semibold mb-2">
                  Gig Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="I will create a professional website design"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                />
              </div>

              <div>
                <label className="block text-(--color-text) font-semibold mb-2">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: Number(e.target.value),
                    })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                >
                  <option value={0}>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-(--color-text) font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  required
                  placeholder="Describe your service in detail..."
                  className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                />
              </div>

              <div>
                <label className="block text-(--color-text) font-semibold mb-2">
                  Tags (up to 5)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-(--color-bg) text-(--color-text) rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(index)}>
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="text-red-500"
                        />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Packages */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-(--color-text) mb-4">
                Pricing & Packages
              </h2>

              {/* Basic Package */}
              <div className="border border-(--color-border) rounded-lg p-4">
                <h3 className="text-xl font-bold text-(--color-text) mb-4">
                  Basic Package *
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-(--color-text) mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.basic_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basic_price: Number(e.target.value),
                        })
                      }
                      min="5"
                      required
                      className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                    />
                  </div>
                  <div>
                    <label className="block text-(--color-text) mb-2">
                      Delivery Time (days) *
                    </label>
                    <input
                      type="number"
                      value={formData.basic_delivery_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basic_delivery_time: Number(e.target.value),
                        })
                      }
                      min="1"
                      required
                      className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-(--color-text) mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.basic_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basic_description: e.target.value,
                      })
                    }
                    rows={3}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                  />
                </div>
              </div>

              {/* Standard Package (Optional) */}
              <div className="border border-(--color-border) rounded-lg p-4">
                <h3 className="text-xl font-bold text-(--color-text) mb-4">
                  Standard Package (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-(--color-text) mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={formData.standard_price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          standard_price: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      min="5"
                      className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                    />
                  </div>
                  <div>
                    <label className="block text-(--color-text) mb-2">
                      Delivery Time (days)
                    </label>
                    <input
                      type="number"
                      value={formData.standard_delivery_time || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          standard_delivery_time: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-(--color-text) mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.standard_description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        standard_description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                  />
                </div>
              </div>

              {/* Premium Package (Optional) */}
              <div className="border border-(--color-border) rounded-lg p-4">
                <h3 className="text-xl font-bold text-(--color-text) mb-4">
                  Premium Package (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-(--color-text) mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={formData.premium_price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          premium_price: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      min="5"
                      className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                    />
                  </div>
                  <div>
                    <label className="block text-(--color-text) mb-2">
                      Delivery Time (days)
                    </label>
                    <input
                      type="number"
                      value={formData.premium_delivery_time || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          premium_delivery_time: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-(--color-text) mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.premium_description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        premium_description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Media & Requirements */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-(--color-text) mb-4">
                Media & Requirements
              </h2>

              <div>
                <label className="block text-(--color-text) font-semibold mb-2">
                  Gig Image *
                </label>
                <div className="border-2 border-dashed border-(--color-border) rounded-lg p-8 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <FontAwesomeIcon
                        icon={faUpload}
                        className="text-4xl text-(--color-text-muted) mb-4"
                      />
                      <p className="text-(--color-text)">
                        Click to upload image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-(--color-text) font-semibold mb-2">
                  Gallery Images (Optional)
                </label>
                <div className="border-2 border-dashed border-(--color-border) rounded-lg p-8 text-center">
                  {galleryPreviews.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {galleryPreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Gallery ${index}`}
                          className="h-32 w-full object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <FontAwesomeIcon
                        icon={faUpload}
                        className="text-4xl text-(--color-text-muted) mb-4"
                      />
                      <p className="text-(--color-text)">
                        Click to upload gallery images
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-(--color-text) font-semibold mb-2">
                  Requirements (what you need from buyers)
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  rows={4}
                  placeholder="e.g., Please provide your brand colors, logo files, etc."
                  className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                />
              </div>
            </div>
          )}

          {/* Step 4: FAQs */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-(--color-text) mb-4">
                Frequently Asked Questions
              </h2>

              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-(--color-border) rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-(--color-text)">
                      FAQ {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="text-red-500"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) =>
                        updateFAQ(index, "question", e.target.value)
                      }
                      placeholder="Question"
                      className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) =>
                        updateFAQ(index, "answer", e.target.value)
                      }
                      placeholder="Answer"
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) focus:outline-none focus:border-(--color-primary)"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addFAQ}
                className="w-full py-3 border-2 border-dashed border-(--color-border) rounded-lg text-(--color-text) hover:bg-(--color-bg) transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add FAQ
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-(--color-bg) text-(--color-text) border border-(--color-border) rounded-lg hover:bg-opacity-80 transition-all"
              >
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-3 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Gig"
                    : "Create Gig"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGig;
