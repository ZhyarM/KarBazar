import { faLanguage, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface UserLanguagesProps {
  languages: string[]; // Lowercase 'l' for standard naming
}

function UserLanguages({ languages }: UserLanguagesProps) {
  const [myLanguages, setMyLanguages] = useState<string[]>(languages);

  // Example function to handle removals
  const removeLanguage = (target: string) => {
    setMyLanguages(myLanguages.filter((lang) => lang !== target));
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
        </div>

        <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
          <FontAwesomeIcon icon={faPlus} className="text-sm" />
          <p>Add</p>
        </button>
      </div>

      {/* Language Pills/Badges */}
      <div className="flex flex-wrap gap-2">
        {myLanguages.length > 0 ? (
          myLanguages.map((lang) => (
            <div
              key={lang}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 transition-all hover:bg-indigo-100"
            >
              <span className="text-sm">{lang}</span>
              <button
                onClick={() => removeLanguage(lang)}
                className="hover:text-red-500 flex items-center"
              >
                <FontAwesomeIcon icon={faXmark} className="text-xs" />
              </button>
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
