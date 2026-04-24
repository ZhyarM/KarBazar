import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faTimes } from "@fortawesome/free-solid-svg-icons";

interface UserPrivacySettingsProps {
  isOpen: boolean;
  isPublic: boolean;
  onTogglePublicProfile: () => Promise<void>;
  onClose: () => void;
}

function UserPrivacySettings({
  isOpen,
  isPublic,
  onTogglePublicProfile,
  onClose,
}: UserPrivacySettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-(--color-card) rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-(--color-border)">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faGear} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-(--color-text)">
              Privacy Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-(--color-surface) transition-colors text-(--color-text-muted)"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl border border-(--color-border) bg-(--color-surface)">
            <p className="text-sm text-(--color-text-muted) mb-1">
              Profile Visibility
            </p>
            <p className="text-(--color-text) font-semibold mb-3">
              {isPublic ? "Public" : "Private"}
            </p>
            <button
              onClick={onTogglePublicProfile}
              className="w-full py-2.5 rounded-xl bg-(--color-primary) text-white font-semibold hover:opacity-90 transition"
            >
              Make Profile {isPublic ? "Private" : "Public"}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-(--color-surface) text-(--color-text) border border-(--color-border) font-semibold hover:bg-(--color-border) transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserPrivacySettings;
