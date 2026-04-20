import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  type AdminCategory,
} from "../../API/AdminAPI";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fieldClassName =
    "px-3 py-2 rounded-md border border-(--color-border) bg-(--color-bg) text-(--color-text) placeholder:text-(--color-text-muted)";

  const loadCategories = async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createAdminCategory({ name, description });
      setName("");
      setDescription("");
      await loadCategories();
    } catch (error) {
      console.error("Failed to create category:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create category.",
      );
    }
  };

  const handleRename = async (category: AdminCategory) => {
    const nextName = window.prompt("New category name", category.name);
    if (!nextName || nextName === category.name) {
      return;
    }

    try {
      await updateAdminCategory(category.id, { name: nextName });
      await loadCategories();
    } catch (error) {
      console.error("Failed to update category:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update category.",
      );
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await deleteAdminCategory(categoryId);
      await loadCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete category.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-(--color-text)">
          Manage Categories
        </h2>
        <p className="text-(--color-text-muted) mt-2">
          Create and organize categories for listings and content.
        </p>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className={fieldClassName}
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={fieldClassName}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-(--color-primary) text-white font-semibold"
          >
            Add Category
          </button>
        </form>
      </div>

      <div className="bg-(--color-surface) rounded-lg p-6 shadow-md">
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between border border-(--color-border) rounded-md p-3 bg-(--color-bg)"
            >
              <div>
                <p className="font-semibold text-(--color-text)">
                  {category.name}
                </p>
                <p className="text-sm text-(--color-text-muted)">
                  {category.description || "No description"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRename(category)}
                  className="px-3 py-1 rounded-md border border-(--color-border) text-sm text-(--color-text) bg-(--color-surface)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  className="px-3 py-1 rounded-md border border-red-500/20 bg-red-500/10 text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminCategoriesPage;
