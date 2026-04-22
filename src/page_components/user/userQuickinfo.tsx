import { faCalendar, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faGlobe,
  faLink,
  faLocationDot,
  faPhone,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import type { UpdateProfileData } from "../../API/ProfileAPI";
import { useLanguage } from "../../context/LanguageContext";

interface UserQuickInfoProps {
  Email: string;
  Location: string;
  Website: string;
  MemberSince: string;
  Phone: string;
  onSave?: (data: Partial<UpdateProfileData>) => Promise<void>;
}

function UserQuickInfo({
  Email = "",
  Location = "",
  Website = "",
  MemberSince = "",
  Phone = "",
  onSave,
}: UserQuickInfoProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    phone: Phone,
    location: Location,
    website: Website,
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData({
      phone: Phone,
      location: Location,
      website: Website,
    });
  }, [Phone, Location, Website]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (onSave && hasChanges) {
      setSaving(true);
      await onSave(formData);
      setSaving(false);
      setHasChanges(false);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-(--color-card) shadow-xl text-(--color-text) rounded-4xl flex flex-col gap-2 font-bold text-md">
      <div className="flex items-center pb-2 font-extrabold gap-4 text-left">
        <FontAwesomeIcon icon={faGlobe} className="text-indigo-700 text-xl" />
        <p className="text-xl">{t("profile.quickInfo.title")}</p>
        {saving && (
          <span className="text-sm text-(--color-text-muted) font-normal">
            ({t("profile.quickInfo.saving")})
          </span>
        )}
      </div>

      {/* Email - Read Only */}
      <div className="flex items-center gap-4 border-b border-(--color-text-muted) font-semibold p-4">
        <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center bg-indigo-200 text-indigo-700">
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-(--color-text-muted) text-sm">
            {t("profile.quickInfo.email")}
          </p>
          <p className="font-bold text-(--color-text)">{Email || t("profile.quickInfo.notSet")}</p>
        </div>
      </div>

      {/* Phone - Editable */}
      <div className="flex items-center gap-4 border-b border-(--color-text-muted) font-semibold p-4">
        <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center bg-indigo-200 text-indigo-700">
          <FontAwesomeIcon icon={faPhone} />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-(--color-text-muted) text-sm">
            {t("profile.quickInfo.phoneNumber")}
          </p>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder={t("profile.quickInfo.phonePlaceholder")}
            className="font-bold border-none outline-none bg-transparent appearance-none w-full text-(--color-text)"
          />
        </div>
      </div>

      {/* Location - Editable */}
      <div className="flex items-center gap-4 border-b border-(--color-text-muted) font-semibold p-4">
        <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center bg-indigo-200 text-indigo-700">
          <FontAwesomeIcon icon={faLocationDot} />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-(--color-text-muted) text-sm">
            {t("profile.quickInfo.location")}
          </p>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder={t("profile.quickInfo.locationPlaceholder")}
            className="font-bold border-none outline-none bg-transparent appearance-none w-full text-(--color-text)"
          />
        </div>
      </div>

      {/* Website - Editable */}
      <div className="flex items-center gap-4 border-b border-(--color-text-muted) font-semibold p-4">
        <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center bg-indigo-200 text-indigo-700">
          <FontAwesomeIcon icon={faLink} />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-(--color-text-muted) text-sm">
            {t("profile.quickInfo.website")}
          </p>
          <input
            type="text"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder={t("profile.quickInfo.websitePlaceholder")}
            className="font-bold border-none outline-none bg-transparent appearance-none w-full text-(--color-text)"
          />
        </div>
      </div>

      {/* Member Since - Read Only */}
      <div className="flex items-center gap-4 font-semibold p-4">
        <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center bg-indigo-200 text-indigo-700">
          <FontAwesomeIcon icon={faCalendar} />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-(--color-text-muted) text-sm">
            {t("profile.quickInfo.memberSince")}
          </p>
          <p className="font-bold text-(--color-text)">{MemberSince}</p>
        </div>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faSave} />
          {saving ? t("profile.quickInfo.saving") : t("profile.quickInfo.saveChanges")}
        </button>
      )}
    </div>
  );
}

export default UserQuickInfo;
