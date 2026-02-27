import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faEye,
  faHeart,
  faPen,
  faStar,
  faUpload,
  faCamera,
  faSave,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import moon from "../../assets/moon.png";
import { getImageUrl } from "../../utils/imageUrl";
import { useRef, useState } from "react";

interface ProfileDetailsProps {
  name?: string;
  username?: string;
  title?: string;
  views?: number;
  saves?: number;
  available?: boolean;
  topRated?: boolean;
  cover_url?: string;
  avatar_url?: string;
  typeOfBussiness: string;
  isOwner?: boolean;
  onAvatarUpload?: (file: File) => Promise<void>;
  onCoverUpload?: (file: File) => Promise<void>;
  onUpdateBasicInfo?: (data: {
    title?: string;
    username?: string;
    name?: string;
  }) => Promise<boolean>;
  onToggleAvailability?: () => Promise<void>;
}

function ProfileDetails({
  name = "Daratoo.comp",
  username = "@daratoo.comp1",
  title,
  views = 500,
  saves = 500,
  available = false,
  topRated = false,
  cover_url,
  avatar_url,
  typeOfBussiness,
  isOwner = false,
  onAvatarUpload,
  onCoverUpload,
  onUpdateBasicInfo,
  onToggleAvailability,
}: ProfileDetailsProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editTitle, setEditTitle] = useState(title || typeOfBussiness);
  const [editUsername, setEditUsername] = useState(username);
  const [savingInfo, setSavingInfo] = useState(false);

  const finalCover =
    cover_url && cover_url.trim().length > 0 ? getImageUrl(cover_url) : null;
  const finalAvatar =
    avatar_url && avatar_url.trim().length > 0 ? getImageUrl(avatar_url) : moon;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarUpload) {
      setUploadingAvatar(true);
      try {
        await onAvatarUpload(file);
      } finally {
        setUploadingAvatar(false);
      }
    }
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onCoverUpload) {
      setUploadingCover(true);
      try {
        await onCoverUpload(file);
      } finally {
        setUploadingCover(false);
      }
    }
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const handleSaveInfo = async () => {
    if (onUpdateBasicInfo) {
      setSavingInfo(true);
      const success = await onUpdateBasicInfo({
        name: editName,
        title: editTitle,
        username: editUsername,
      });
      setSavingInfo(false);
      if (success) setIsEditingInfo(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(name);
    setEditTitle(title || typeOfBussiness);
    setEditUsername(username);
    setIsEditingInfo(false);
  };

  return (
    <div className="w-full">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={avatarInputRef}
        accept="image/jpeg,image/png,image/jpg,image/gif"
        className="hidden"
        onChange={handleAvatarChange}
      />
      <input
        type="file"
        ref={coverInputRef}
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={handleCoverChange}
      />

      <div className="w-full min-h-100 lg:h-96 bg-(--color-card) rounded-3xl lg:rounded-4xl overflow-hidden shadow-xl flex flex-col">
        {/* COVER SECTION */}
        <div
          className={`relative h-48 lg:h-3/4 p-4 flex justify-between items-start transition-all ${
            finalCover
              ? "bg-cover bg-center"
              : "bg-linear-to-r from-indigo-500 to-purple-600"
          }`}
          style={finalCover ? { backgroundImage: `url(${finalCover})` } : {}}
        >
          {/* Stats Badges */}
          <div className="px-3 py-2 bg-black/20 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-3 text-white text-sm lg:text-base">
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faEye} />
              <span className="font-semibold">{views}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faHeart} className="text-red-400" />
              <span className="font-semibold">{saves}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingInfo(true)}
                title="Edit profile info"
                className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl flex justify-center items-center text-white hover:bg-white/40 transition-all"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                title="Upload cover photo"
                className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl flex justify-center items-center text-white hover:bg-white/40 transition-all disabled:opacity-50"
              >
                {uploadingCover ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faUpload} />
                )}
              </button>
            </div>
          )}
        </div>

        {/* PROFILE INFO SECTION */}
        <div className="flex-1 bg-(--color-card) px-6 pb-6 pt-0 lg:pt-0 relative flex flex-col lg:flex-row items-center lg:items-end">
          {/* Avatar Wrapper */}
          <div className="relative -top-12 lg:-top-16 shrink-0 group">
            <img
              src={finalAvatar}
              alt={name}
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-(--color-border) shadow-lg bg-(--color-card)"
            />
            {isOwner && (
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                title="Change profile picture"
                className="absolute bottom-0 right-0 w-8 h-8 lg:w-10 lg:h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all border-2 border-(--color-card) disabled:opacity-50"
              >
                {uploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="text-xs lg:text-sm"
                  />
                )}
              </button>
            )}
          </div>

          {/* Identity & Status */}
          <div className="flex flex-col lg:flex-row justify-between w-full lg:ml-6 -mt-10 lg:mt-0 pb-2">
            {isEditingInfo ? (
              /* Edit Mode */
              <div className="flex flex-col gap-2 w-full lg:w-auto">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="text-2xl lg:text-3xl font-bold bg-(--color-surface) text-(--color-text) border border-(--color-border) rounded-lg px-3 py-1 focus:outline-none focus:border-(--color-primary)"
                />
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="username"
                    className="text-sm font-bold bg-(--color-surface) text-(--color-primary) border border-(--color-border) rounded-lg px-3 py-1 focus:outline-none focus:border-(--color-primary)"
                  />
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Professional title"
                    className="text-sm font-semibold bg-(--color-surface) text-(--color-text-muted) border border-(--color-border) rounded-lg px-3 py-1 focus:outline-none focus:border-(--color-primary)"
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleSaveInfo}
                    disabled={savingInfo}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={savingInfo ? faSave : faCheck} />
                    {savingInfo ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm font-bold hover:bg-gray-600 transition-colors flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <h2 className="text-2xl lg:text-4xl font-bold text-(--color-text)">
                  {name}
                </h2>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 mt-1">
                  <span className="text-sm lg:text-lg font-bold text-(--color-primary)">
                    {username}
                  </span>
                  <span className="hidden lg:inline text-(--color-text-muted)">
                    •
                  </span>
                  <span className="text-sm lg:text-lg font-semibold text-(--color-text-muted) flex items-center gap-1">
                    {title || typeOfBussiness}
                  </span>
                </div>
              </div>
            )}

            {/* Status Badges */}
            <div className="flex gap-2 mt-4 lg:mt-0 justify-center items-end">
              {isOwner && onToggleAvailability ? (
                <button
                  onClick={onToggleAvailability}
                  className={`${
                    available
                      ? "bg-green-100 border-green-200 text-green-700"
                      : "bg-red-100 border-red-200 text-red-700"
                  } px-3 py-1.5 rounded-lg border text-xs lg:text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  <FontAwesomeIcon
                    icon={faCircle}
                    className={`text-[8px] ${available ? "text-green-500" : "text-red-500"}`}
                  />
                  {available ? "Available" : "Busy"}
                </button>
              ) : available ? (
                <div className="bg-green-100 px-3 py-1.5 rounded-lg border border-green-200 text-xs lg:text-sm font-bold text-green-700 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-[8px] text-green-500"
                  />
                  Available
                </div>
              ) : (
                <div className="bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 text-xs lg:text-sm font-bold text-red-700 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-[8px] text-red-500"
                  />
                  Busy
                </div>
              )}

              {topRated && (
                <div className="bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 text-xs lg:text-sm font-bold text-indigo-700 flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="text-orange-400" />
                  Top Rated
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
