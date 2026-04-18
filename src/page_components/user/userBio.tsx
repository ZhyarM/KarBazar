import {
  faPen,
  faPlus,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";
import { useState } from "react";

interface UserBioProps {
  bio?: string;
  onSave?: (bio: string) => Promise<void>;
  saving?: boolean;
}

function UserBio({ bio = "", onSave, saving = false }: UserBioProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(bio);

  const handleSave = async () => {
    if (onSave) {
      await onSave(editedBio);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBio(bio);
    setIsEditing(false);
  };

  return (
    <div className="rounded-4xl shadow-2xl bg-(--color-card)">
      <div className="rounded-4xl p-4 flex justify-between items-center">
        <div>
          <h1 className="font-extrabold text-(--color-text) text-3xl">
            Professional Bio
          </h1>
          <p className="text-(--color-text-muted)">
            Tell clients what makes you unique
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                bgColor="bg-green-500 hover:bg-green-600"
                text={saving ? "Saving..." : "Save"}
                icon={<FontAwesomeIcon icon={faSave} />}
                textColor="text-white"
                onClick={handleSave}
                disabled={saving}
              />
              <Button
                bgColor="bg-gray-500 hover:bg-gray-600"
                text="Cancel"
                icon={<FontAwesomeIcon icon={faTimes} />}
                textColor="text-white"
                onClick={handleCancel}
              />
            </>
          ) : (
            <Button
              bgColor="gradient-secondary"
              text="Edit Bio"
              icon={<FontAwesomeIcon icon={faPen} />}
              textColor="text-(--color-text)"
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
      <div className="min-h-64 p-4">
        {isEditing ? (
          <textarea
            className="w-full h-64 p-4 border-2 border-blue-300 focus:border-blue-500 rounded-2xl resize-none bg-(--color-surface) text-(--color-text) focus:outline-none"
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            placeholder="Write about yourself, your experience, and what makes you unique..."
          />
        ) : (
          <div
            className={`${bio ? "" : "border-dashed"} border-2 border-blue-300 hover:border-blue-500 rounded-2xl min-h-64`}
          >
            {bio ? (
              <div className="p-8 font-semibold text-(--color-text) whitespace-pre-wrap">
                {bio}
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col h-64 gap-4">
                <div className="text-indigo-500 bg-indigo-300 h-14 w-14 flex items-center justify-center rounded-2xl">
                  <FontAwesomeIcon icon={faPen} className="text-3xl" />
                </div>
                <h1 className="font-extrabold text-(--color-text) text-2xl">
                  Your story starts here
                </h1>
                <p className="w-3/4 text-center text-(--color-text-muted) text-sm font-semibold">
                  A compelling bio helps you get 40% more job offers. Highlight
                  your expertise and passion!
                </p>
                <Button
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  text="Write Your Bio"
                  bgColor="gradient-secondary"
                  textColor="text-xl text-(--color-text)"
                  onClick={() => setIsEditing(true)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBio;
