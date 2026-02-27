import {
  faAdd,
  faUpload,
  faTimes,
  faExternalLink,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";
import { useState } from "react";
import type { PortfolioItem } from "../../API/ProfileAPI";
import { getImageUrl } from "../../utils/imageUrl";

interface UserWorkProps {
  portfolio?: PortfolioItem[];
  onSave?: (portfolio: PortfolioItem[]) => Promise<void>;
}

function UserWork({ portfolio = [], onSave }: UserWorkProps) {
  const [myPortfolio, setMyPortfolio] = useState<PortfolioItem[]>(portfolio);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState<PortfolioItem>({
    title: "",
    description: "",
    image_url: "",
    project_url: "",
    category: "",
  });

  const handleAddItem = async () => {
    if (newItem.title && newItem.image_url) {
      const updatedPortfolio = [...myPortfolio, { ...newItem, id: Date.now() }];
      setMyPortfolio(updatedPortfolio);
      setNewItem({
        title: "",
        description: "",
        image_url: "",
        project_url: "",
        category: "",
      });
      setIsAdding(false);

      if (onSave) {
        setSaving(true);
        await onSave(updatedPortfolio);
        setSaving(false);
      }
    }
  };

  const handleRemoveItem = async (itemId: number | undefined) => {
    const updatedPortfolio = myPortfolio.filter((item) => item.id !== itemId);
    setMyPortfolio(updatedPortfolio);

    if (onSave) {
      setSaving(true);
      await onSave(updatedPortfolio);
      setSaving(false);
    }
  };

  return (
    <div className="rounded-4xl shadow-2xl bg-(--color-card)">
      <div className="rounded-4xl p-4 flex justify-between items-center">
        <div>
          <h1 className="font-extrabold text-(--color-text) text-3xl">
            Portfolio & Work
          </h1>
          <p className="text-(--color-text-muted)">
            Showcase your best projects
            {saving && <span className="ml-2">(Saving...)</span>}
          </p>
        </div>

        <div>
          <Button
            bgColor="gradient-secondary"
            text="Add Work"
            icon={<FontAwesomeIcon icon={faAdd} />}
            textColor="text-(--color-text)"
            onClick={() => setIsAdding(!isAdding)}
          />
        </div>
      </div>

      {/* Add Portfolio Item Form */}
      {isAdding && (
        <div className="px-4 pb-4">
          <div className="p-4 bg-(--color-surface) rounded-xl space-y-3">
            <input
              type="text"
              placeholder="Project Title"
              value={newItem.title}
              onChange={(e) =>
                setNewItem({ ...newItem, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={newItem.image_url}
              onChange={(e) =>
                setNewItem({ ...newItem, image_url: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <input
              type="url"
              placeholder="Project URL (optional)"
              value={newItem.project_url || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, project_url: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <input
              type="text"
              placeholder="Category (e.g., Web Design, Development)"
              value={newItem.category || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm"
            />
            <textarea
              placeholder="Description (optional)"
              value={newItem.description || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-card) text-(--color-text) text-sm resize-none h-20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                className="flex-1 px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} />
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {myPortfolio.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myPortfolio.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-2xl overflow-hidden border-2 border-(--color-border) hover:border-blue-500 transition-colors"
              >
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    {item.category && (
                      <p className="text-sm text-gray-300">{item.category}</p>
                    )}
                    {item.project_url && (
                      <a
                        href={item.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-sm text-blue-400 hover:underline"
                      >
                        <FontAwesomeIcon icon={faExternalLink} />
                        View Project
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
            {/* Add More Button */}
            <div
              onClick={() => setIsAdding(true)}
              className="flex hover:text-blue-700 justify-center items-center flex-col bg-gray-200 dark:bg-gray-700 border-2 border-blue-300 hover:border-blue-500 border-dashed rounded-2xl min-h-48 cursor-pointer transition-colors"
            >
              <FontAwesomeIcon
                icon={faUpload}
                className="text-4xl hover:text-blue-300"
              />
              <p className="font-semibold text-md">Add project</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 min-h-96">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                onClick={() => setIsAdding(true)}
                className="flex hover:text-blue-700 justify-center items-center flex-col bg-gray-200 dark:bg-gray-700 border-2 border-blue-300 hover:border-blue-500 border-dashed rounded-2xl h-48 cursor-pointer transition-colors"
              >
                <FontAwesomeIcon
                  icon={faUpload}
                  className="text-4xl hover:text-blue-300"
                />
                <p className="font-semibold text-md">Add project images</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserWork;
