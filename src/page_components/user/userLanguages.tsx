import { faLanguage, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface UserLanguagesProps {
  languages: string[];
  onSave?: (languages: string[]) => Promise<void>;
  readOnly?: boolean;
}

function UserLanguages({
  languages,
  onSave,
  readOnly = false,
}: UserLanguagesProps) {
  const [myLanguages, setMyLanguages] = useState<string[]>(languages);
  const [newLanguage, setNewLanguage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddLanguage = async () => {
    if (newLanguage.trim() && !myLanguages.includes(newLanguage.trim())) {
      const updatedLanguages = [...myLanguages, newLanguage.trim()];
      setMyLanguages(updatedLanguages);
      setNewLanguage("");
      setIsAdding(false);

      if (onSave) {
        setSaving(true);
        await onSave(updatedLanguages);
        setSaving(false);
      }
    }
  };

  const removeLanguage = async (target: string) => {
    const updatedLanguages = myLanguages.filter((lang) => lang !== target);
    setMyLanguages(updatedLanguages);

    if (onSave) {
      setSaving(true);
      await onSave(updatedLanguages);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-(--color-card) shadow-xl text-(--color-text) rounded-4xl flex flex-col gap-4 font-bold text-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faLanguage}
            className="text-indigo-700 text-xl"
          />
          <h3 className="text-xl font-extrabold">Languages</h3>
          {saving && (
            <span className="text-sm text-(--color-text-muted) font-normal">
              (Saving...)
            </span>
          )}
        </div>

        {!readOnly && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="text-sm" />
            <p>Add</p>
          </button>
        )}
      </div>

      {/* Add Language Input */}
      {isAdding && !readOnly && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddLanguage()}
            placeholder="Enter language..."
            className="flex-1 px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-surface) text-(--color-text) text-sm focus:outline-none focus:border-(--color-primary)"
          />
          <button
            onClick={handleAddLanguage}
            className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90"
          >
            Add
          </button>
        </div>
      )}

      {/* Language Pills/Badges */}
      <div className="flex flex-wrap gap-2">
        {myLanguages.length > 0 ? (
          myLanguages.map((lang) => (
            <div
              key={lang}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 transition-all hover:bg-indigo-100"
            >
              <span className="text-sm">{lang}</span>
              {!readOnly && (
                <button
                  onClick={() => removeLanguage(lang)}
                  className="hover:text-red-500 flex items-center"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-(--color-text-muted) font-normal italic">
            No languages added yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default UserLanguages;
