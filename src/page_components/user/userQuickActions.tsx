import { faEye } from "@fortawesome/free-regular-svg-icons";
import {
  faGear,
  faShare,
  faLock,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface UserQuickActionsProps {
  ProfileLink: string;
  onPreviewPublicProfile?: () => void;
  onPrivacySettings?: () => void;
  onChangePassword?: () => void;
  onDeleteAccount?: () => void;
}

function UserQuickActions({
  ProfileLink,
  onPreviewPublicProfile,
  onPrivacySettings,
  onChangePassword,
  onDeleteAccount,
}: UserQuickActionsProps) {
  const [, SetMessageIsSent] = useState<boolean>(true);
  const [, setShowError] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (valueToCopy: string): undefined => {
    try {
      navigator.clipboard.writeText(window.location.origin + valueToCopy);
      SetMessageIsSent((prev) => !prev);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setShowError(true);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-mint rounded-4xl flex flex-col text-black gap-2 font-bold text-md">
      <div className="flex items-center pb-2 font-extrabold gap-4 text-left">
        <FontAwesomeIcon icon={faStar} />
        <p>Quick Actions</p>
      </div>
      <button
        type="button"
        onClick={onPreviewPublicProfile}
        className="flex items-center gap-2 bg-white/20 backdrop-blur-md border p-4 rounded-2xl cursor-pointer hover:bg-white/30 transition-colors"
      >
        <FontAwesomeIcon icon={faEye} />
        <p>Preview Public Profile</p>
      </button>
      <button
        type="button"
        onClick={() => handleCopy(ProfileLink)}
        className="flex items-center gap-2 bg-white/20 backdrop-blur-md border p-4 rounded-2xl cursor-pointer hover:bg-white/30 transition-colors"
      >
        <FontAwesomeIcon icon={faShare} />
        <p>{copied ? "Link Copied!" : "Share Profile Link"}</p>
      </button>
      <button
        type="button"
        className="flex items-center gap-2 bg-white/20 backdrop-blur-md border p-4 rounded-2xl cursor-pointer hover:bg-white/30 transition-colors"
        onClick={onChangePassword}
      >
        <FontAwesomeIcon icon={faLock} />
        <p>Change Password</p>
      </button>
      <button
        type="button"
        onClick={onPrivacySettings}
        className="flex items-center gap-2 bg-white/20 backdrop-blur-md border p-4 rounded-2xl cursor-pointer hover:bg-white/30 transition-colors"
      >
        <FontAwesomeIcon icon={faGear} />
        <p>Privacy Settings</p>
      </button>
      <button
        type="button"
        onClick={onDeleteAccount}
        className="flex items-center gap-2 bg-red-100/50 backdrop-blur-md border border-red-200 p-4 rounded-2xl cursor-pointer hover:bg-red-100 transition-colors text-red-700"
      >
        <FontAwesomeIcon icon={faTrash} />
        <p>Delete Account</p>
      </button>
    </div>
  );
}

export default UserQuickActions;
