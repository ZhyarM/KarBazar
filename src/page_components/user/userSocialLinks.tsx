import {
  faGlobe,
  faSave,
  faPen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faGithub,
  faTwitter,
  faFacebook,
  faInstagram,
  faYoutube,
  faDribbble,
  faBehance,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { SocialLinks } from "../../API/ProfileAPI";

interface UserSocialLinksProps {
  socialLinks?: SocialLinks | null;
  onSave?: (socialLinks: SocialLinks) => Promise<void>;
  readOnly?: boolean;
}

const SOCIAL_PLATFORMS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: faLinkedin,
    color: "text-blue-600",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "github",
    label: "GitHub",
    icon: faGithub,
    color: "text-gray-800 dark:text-gray-200",
    placeholder: "https://github.com/username",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: faTwitter,
    color: "text-sky-500",
    placeholder: "https://twitter.com/username",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: faFacebook,
    color: "text-blue-500",
    placeholder: "https://facebook.com/username",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: faInstagram,
    color: "text-pink-500",
    placeholder: "https://instagram.com/username",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: faYoutube,
    color: "text-red-500",
    placeholder: "https://youtube.com/@channel",
  },
  {
    key: "dribbble",
    label: "Dribbble",
    icon: faDribbble,
    color: "text-pink-400",
    placeholder: "https://dribbble.com/username",
  },
  {
    key: "behance",
    label: "Behance",
    icon: faBehance,
    color: "text-blue-400",
    placeholder: "https://behance.net/username",
  },
  {
    key: "website",
    label: "Website",
    icon: faGlobe,
    color: "text-indigo-500",
    placeholder: "https://yourwebsite.com",
  },
] as const;

function UserSocialLinks({
  socialLinks,
  onSave,
  readOnly = false,
}: UserSocialLinksProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SocialLinks>(socialLinks || {});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);
      await onSave(formData);
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(socialLinks || {});
    setIsEditing(false);
  };

  const activePlatforms = SOCIAL_PLATFORMS.filter(
    (p) => formData[p.key as keyof SocialLinks],
  );

  return (
    <div className="w-full p-6 bg-(--color-card) shadow-xl text-(--color-text) rounded-4xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faGlobe} className="text-indigo-700 text-xl" />
          <h3 className="text-xl font-extrabold">Social Links</h3>
          {saving && (
            <span className="text-sm text-(--color-text-muted) font-normal">
              (Saving...)
            </span>
          )}
        </div>
        {!readOnly && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors font-bold"
          >
            <FontAwesomeIcon icon={faPen} className="text-sm" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {isEditing && !readOnly ? (
        /* Edit Mode */
        <div className="space-y-3">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform.key} className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <FontAwesomeIcon
                  icon={platform.icon}
                  className={`text-lg ${platform.color}`}
                />
              </div>
              <input
                type="url"
                placeholder={platform.placeholder}
                value={formData[platform.key as keyof SocialLinks] || ""}
                onChange={(e) => handleChange(platform.key, e.target.value)}
                className="flex-1 px-3 py-2 border border-(--color-border) rounded-lg bg-(--color-surface) text-(--color-text) text-sm focus:outline-none focus:border-(--color-primary)"
              />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSave} />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-1" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="space-y-2">
          {activePlatforms.length > 0 ? (
            activePlatforms.map((platform) => {
              const url = formData[platform.key as keyof SocialLinks];
              return (
                <a
                  key={platform.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-(--color-surface) transition-colors group"
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={platform.icon}
                      className={`text-lg ${platform.color}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{platform.label}</p>
                    <p className="text-xs text-(--color-text-muted) truncate">
                      {url}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="text-xs text-(--color-text-muted) opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              );
            })
          ) : (
            <p className="text-sm text-(--color-text-muted) italic py-4 text-center">
              {readOnly
                ? "No social links added"
                : "Add your social links to help clients find you"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserSocialLinks;
