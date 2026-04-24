import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileProgress from "./profileProgress";
import ProfileDetails from "./profileDetails";
import Statscard from "./ProfileStatsCard";
import { faStar, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faDollar,
  faSpinner,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import UserBio from "./userBio";
import UserWork from "./userWork";
import UserWorkExperience from "./userWorkExperience";
import UserEducation from "./userEducation";
import UserQuickActions from "./userQuickActions";
import UserQuickInfo from "./userQuickinfo";
import UserTopSkills from "./userTopSkills";
import UserLanguages from "./userLanguages";
import UserCertification from "./userCertification";
import UserProfileStrength from "./userProfileStrength";
import UserSocialLinks from "./userSocialLinks";
import UserPosts from "./UserPosts";
import UserPrivacySettings from "./UserPrivacySettings";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import {
  getMyProfile,
  getProfileByUsername,
  updateProfile,
  uploadProfilePicture,
  uploadCoverPhoto,
  updateUserName,
  type Profile,
  type UpdateProfileData,
} from "../../API/ProfileAPI";
import { isAuthenticated } from "../../API/apiClient";
import { getImageUrl } from "../../utils/imageUrl";
import { useLanguage } from "../../context/LanguageContext.tsx";

function UserProfile() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { username: usernameParam } = useParams<{ username?: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [profileImageVersion, setProfileImageVersion] = useState(0);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [responseTimeInput, setResponseTimeInput] = useState("24");
  const [savingResponseTime, setSavingResponseTime] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Get logged-in user id for PostCard ownership checks
  const currentUserId = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u)?.id : undefined;
    } catch {
      return undefined;
    }
  })();

  useEffect(() => {
    fetchProfile();
  }, [usernameParam, navigate]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (profile) {
      setResponseTimeInput(String(profile.response_time || 0));
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      let data: Profile;

      if (usernameParam) {
        data = await getProfileByUsername(usernameParam);
        setIsOwner(false);
      } else {
        if (!isAuthenticated()) {
          navigate("/auth/login", { replace: true });
          return;
        }
        data = await getMyProfile();
        setIsOwner(true);
      }

      setProfile(data);
      setIsPublicProfile(data.is_public);
    } catch (err) {
      setError(t("profilePage.loadFailed"));
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    try {
      setSaving(true);
      const updatedProfile = await updateProfile(data);
      setProfile(updatedProfile);
      setToast({ message: t("profilePage.toast.updated"), type: "success" });
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      setToast({ message: t("profilePage.toast.updateFailed"), type: "error" });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const avatarUrl = await uploadProfilePicture(file);
      const version = Date.now();
      setProfileImageVersion(version);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              avatar_url: avatarUrl,
            }
          : prev,
      );
      await fetchProfile();
      setToast({
        message: t("profilePage.toast.avatarUpdated"),
        type: "success",
      });
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setToast({ message: t("profilePage.toast.avatarFailed"), type: "error" });
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      const coverUrl = await uploadCoverPhoto(file);
      const version = Date.now();
      setProfileImageVersion(version);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              cover_url: coverUrl,
            }
          : prev,
      );
      await fetchProfile();
      setToast({
        message: t("profilePage.toast.coverUpdated"),
        type: "success",
      });
    } catch (err) {
      console.error("Error uploading cover:", err);
      setToast({ message: t("profilePage.toast.coverFailed"), type: "error" });
    }
  };

  const handleUpdateBasicInfo = async (data: {
    title?: string;
    username?: string;
    name?: string;
  }) => {
    try {
      // Update name via auth endpoint
      if (data.name) {
        await updateUserName(data.name);
      }
      // Update title and username via profile endpoint
      const profileData: UpdateProfileData = {};
      if (data.title) profileData.title = data.title;
      if (data.username) profileData.username = data.username;
      if (Object.keys(profileData).length > 0) {
        await updateProfile(profileData);
      }
      await fetchProfile(); // Refresh all data
      setToast({
        message: t("profilePage.toast.infoUpdated"),
        type: "success",
      });
      return true;
    } catch (err) {
      console.error("Error updating basic info:", err);
      setToast({ message: t("profilePage.toast.infoFailed"), type: "error" });
      return false;
    }
  };

  const handleToggleAvailability = async () => {
    if (!profile) return;
    const newState = !profile.is_available;
    // Optimistic update
    setProfile({ ...profile, is_available: newState });
    await handleUpdateProfile({ is_available: newState });
  };

  const enablePublicProfile = async () => {
    const newState = !isPublicProfile;
    setIsPublicProfile(newState);
    await handleUpdateProfile({ is_public: newState });
  };

  const handlePreviewPublicProfile = () => {
    if (!profile?.username) return;
    navigate(`/profile/${profile.username}`);
  };

  const handleSendMessage = () => {
    if (profile?.user?.id) {
      navigate(`/messages/${profile.user.id}`);
    }
  };

  const handleProgressSuggestionClick = (
    section: "basicInfo" | "bio" | "skills" | "portfolio" | "work",
  ) => {
    const sectionIdMap: Record<typeof section, string> = {
      basicInfo: "profile-section-basic-info",
      portfolio: "profile-section-portfolio",
      bio: "profile-section-bio",
      skills: "profile-section-skills",
      work: "profile-section-work-experience",
    };

    const targetElement = document.getElementById(sectionIdMap[section]);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSaveResponseTime = async () => {
    const parsed = Number(responseTimeInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setToast({
        message: t("profilePage.toast.responsePositive"),
        type: "error",
      });
      return;
    }

    const clamped = Math.min(168, Math.round(parsed));

    try {
      setSavingResponseTime(true);
      await handleUpdateProfile({ response_time: clamped });
      setResponseTimeInput(String(clamped));
    } finally {
      setSavingResponseTime(false);
    }
  };

  // Calculate profile completion percentage
  const calculateProfileStrength = (): {
    percentage: number;
    items: {
      basicInfo: boolean;
      professionalBio: boolean;
      skills: boolean;
      portfolio: boolean;
      workExperience: boolean;
    };
  } => {
    if (!profile) {
      return {
        percentage: 0,
        items: {
          basicInfo: false,
          professionalBio: false,
          skills: false,
          portfolio: false,
          workExperience: false,
        },
      };
    }

    const items = {
      basicInfo: !!(profile.user?.name && profile.username && profile.title),
      professionalBio: !!profile.bio?.trim(),
      skills: !!(profile.skills && profile.skills.length > 0),
      portfolio: !!(profile.portfolio && profile.portfolio.length > 0),
      workExperience: !!(
        profile.work_experience && profile.work_experience.length > 0
      ),
    };

    const completed = Object.values(items).filter(Boolean).length;
    const percentage = Math.round((completed / 5) * 100);

    return { percentage, items };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-(--color-bg)">
        <div className="flex flex-col items-center gap-4">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-(--color-primary) animate-spin"
          />
          <p className="text-(--color-text-muted)">
            {t("profilePage.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-(--color-bg)">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || t("profilePage.notFound")}
          </p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90"
          >
            {t("profilePage.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  // Hide profile if private and not owner
  if (!isPublicProfile && !isOwner) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-(--color-bg)">
        <div className="text-center">
          <p className="text-(--color-text) mb-4">{t("profilePage.private")}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90"
          >
            {t("profilePage.goBack")}
          </button>
        </div>
      </div>
    );
  }

  const { percentage, items } = calculateProfileStrength();
  const completionSuggestions: Array<{
    section: "basicInfo" | "bio" | "skills" | "portfolio" | "work";
    text: string;
  }> = [];

  if (!items.basicInfo) {
    completionSuggestions.push({
      section: "basicInfo",
      text: t("profilePage.progress.addBasicInfo"),
    });
  }
  if (!items.professionalBio) {
    completionSuggestions.push({
      section: "bio",
      text: t("profilePage.progress.addCompleteBio"),
    });
  }
  if (!items.skills) {
    completionSuggestions.push({
      section: "skills",
      text: t("profilePage.progress.addSkills"),
    });
  }
  if (!items.portfolio) {
    completionSuggestions.push({
      section: "portfolio",
      text: t("profilePage.progress.addPortfolio"),
    });
  }
  if (!items.workExperience) {
    completionSuggestions.push({
      section: "work",
      text: t("profilePage.progress.addWorkExperience"),
    });
  }

  return (
    <div className="flex justify-center bg-(--color-bg) min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl font-semibold text-sm flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="opacity-70 hover:opacity-100"
          >
            x
          </button>
        </div>
      )}

      {/* Modals */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
      <DeleteAccountModal
        isOpen={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
      />
      <UserPrivacySettings
        isOpen={showPrivacySettings}
        isPublic={isPublicProfile}
        onTogglePublicProfile={enablePublicProfile}
        onClose={() => setShowPrivacySettings(false)}
      />

      <div className="flex flex-col gap-3 w-full max-w-7xl px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-(--color-accent) hover:text-(--color-primary) font-semibold self-start"
        >
          &larr; {t("profilePage.back")}
        </button>

        {/* Progress Bar - Only show for owner when not fully complete */}
        {isOwner && percentage < 100 && (
          <div className="w-full">
            <ProfileProgress
              initialProgress={percentage}
              suggestions={completionSuggestions}
              onSuggestionClick={handleProgressSuggestionClick}
            />
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Left Column: Details & Work */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <div id="profile-section-basic-info" className="scroll-mt-24">
              <ProfileDetails
                available={profile.is_available ?? true}
                topRated={profile.rating >= 4.5}
                cover_url={profile.cover_url || ""}
                avatar_url={profile.avatar_url || profile.user?.image || ""}
                imageVersion={profileImageVersion}
                name={profile.user?.name || t("profile.user")}
                username={profile.username}
                title={profile.title || ""}
                saves={profile.total_post_likes ?? 0}
                typeOfBussiness={profile.title || t("profilePage.business")}
                views={profile.profile_views}
                isOwner={isOwner}
                onAvatarUpload={isOwner ? handleAvatarUpload : undefined}
                onCoverUpload={isOwner ? handleCoverUpload : undefined}
                onUpdateBasicInfo={isOwner ? handleUpdateBasicInfo : undefined}
                onToggleAvailability={
                  isOwner ? handleToggleAvailability : undefined
                }
              />
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Statscard
                icon={<FontAwesomeIcon icon={faStar} />}
                IconColor="text-orange-500"
                bg_color="bg-orange-100"
                label={t("profilePage.stats.rating")}
                value={profile.rating.toFixed(1)}
                rating={profile.rating}
                reviews={profile.total_reviews}
              />
              <Statscard
                icon={<FontAwesomeIcon icon={faBriefcase} />}
                IconColor="text-blue-500"
                bg_color="bg-blue-100"
                label={t("profilePage.stats.jobs")}
                value={profile.total_jobs.toString()}
                projects={profile.total_jobs}
              />
              <Statscard
                icon={<FontAwesomeIcon icon={faDollar} />}
                IconColor="text-green-500"
                bg_color="bg-green-100"
                label={t("profilePage.stats.completed")}
                value={profile.total_jobs.toString()}
                projects={profile.total_jobs}
              />
              {isOwner ? (
                <div className="bg-(--color-card) shadow-lg rounded-3xl w-full min-h-45 flex flex-col justify-between p-5 border border-(--color-border)">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl bg-purple-100 text-purple-500">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <h1 className="font-extrabold text-(--color-text) text-3xl tracking-tight">
                      {`${profile.response_time ?? 0}h`}
                    </h1>
                    <label className="text-(--color-text-muted) font-medium text-sm uppercase tracking-wider">
                      {t("profilePage.stats.response")} (
                      {t("profilePage.hours")})
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        max={168}
                        value={responseTimeInput}
                        onChange={(e) => setResponseTimeInput(e.target.value)}
                        className="w-full bg-(--color-surface) text-(--color-text) border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:border-(--color-primary)"
                      />
                      <button
                        type="button"
                        onClick={handleSaveResponseTime}
                        disabled={savingResponseTime}
                        className="px-3 py-2 bg-(--color-primary) text-(--color-text-inverse) rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
                      >
                        {savingResponseTime
                          ? t("profilePage.saving")
                          : t("profilePage.save")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Statscard
                  icon={<FontAwesomeIcon icon={faClock} />}
                  IconColor="text-purple-500"
                  bg_color="bg-purple-100"
                  label={t("profilePage.stats.response")}
                  value={`${profile.response_time}h`}
                  avgTime={profile.response_time}
                />
              )}
            </div>
            {/* Bio Section */}
            <div id="profile-section-bio" className="w-full scroll-mt-24">
              {isOwner ? (
                <UserBio
                  bio={profile.bio || ""}
                  onSave={async (bio: string) => {
                    await handleUpdateProfile({ bio });
                  }}
                  saving={saving}
                />
              ) : (
                <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
                  <h3 className="text-lg font-bold text-(--color-text) mb-3">
                    {t("profilePage.about")}
                  </h3>
                  <p className="text-(--color-text) leading-relaxed">
                    {profile.bio || t("profilePage.noBio")}
                  </p>
                </div>
              )}
            </div>
            {/* Portfolio Section */}
            <div id="profile-section-portfolio" className="w-full scroll-mt-24">
              {isOwner ? (
                <UserWork
                  portfolio={profile.portfolio}
                  onSave={async (portfolio) => {
                    await handleUpdateProfile({ portfolio });
                  }}
                />
              ) : (
                <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
                  <h3 className="text-lg font-bold text-(--color-text) mb-4">
                    {t("profilePage.portfolio")}
                  </h3>
                  {profile.portfolio && profile.portfolio.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {profile.portfolio.map((item, idx) => (
                        <div
                          key={idx}
                          className="border border-(--color-border) rounded-lg overflow-hidden"
                        >
                          {item.image_url && (
                            <img
                              src={getImageUrl(item.image_url)}
                              alt={item.title}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h4 className="font-bold text-(--color-text)">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-(--color-text-muted) text-sm">
                                {item.description}
                              </p>
                            )}
                            {item.project_url && (
                              <a
                                href={item.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-(--color-primary) text-sm hover:underline"
                              >
                                {t("profilePage.viewProject")}
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-(--color-text-muted)">
                      {t("profilePage.noPortfolio")}
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* Work Experience Section */}
            <div
              id="profile-section-work-experience"
              className="w-full scroll-mt-24"
            >
              {isOwner ? (
                <UserWorkExperience
                  experience={profile.work_experience}
                  onSave={async (work_experience) => {
                    await handleUpdateProfile({ work_experience });
                  }}
                />
              ) : (
                <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
                  <h3 className="text-lg font-bold text-(--color-text) mb-4">
                    {t("profilePage.workExperience")}
                  </h3>
                  {profile.work_experience &&
                  profile.work_experience.length > 0 ? (
                    <div className="space-y-4">
                      {profile.work_experience.map((exp, idx) => (
                        <div
                          key={idx}
                          className="border-l-2 border-(--color-primary) pl-4"
                        >
                          <h4 className="font-bold text-(--color-text)">
                            {exp.position}
                          </h4>
                          <p className="text-sm text-(--color-text-muted)">
                            {exp.company}
                          </p>
                          <p className="text-sm text-(--color-text-muted)">
                            {new Date(exp.start_date).getFullYear()} -{" "}
                            {exp.end_date
                              ? new Date(exp.end_date).getFullYear()
                              : t("profilePage.present")}
                          </p>
                          {exp.description && (
                            <p className="text-(--color-text) text-sm mt-2">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-(--color-text-muted)">
                      {t("profilePage.noWorkExperience")}
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* Education Section */}
            <div className="w-full">
              {isOwner ? (
                <UserEducation
                  education={profile.education}
                  onSave={async (education) => {
                    await handleUpdateProfile({ education });
                  }}
                />
              ) : (
                profile.education &&
                profile.education.length > 0 && (
                  <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
                    <h3 className="text-lg font-bold text-(--color-text) mb-4">
                      {t("profilePage.education")}
                    </h3>
                    <div className="space-y-4">
                      {profile.education.map((edu, idx) => (
                        <div
                          key={idx}
                          className="border-l-2 border-indigo-500 pl-4"
                        >
                          <h4 className="font-bold text-(--color-text)">
                            {edu.degree} in {edu.field}
                          </h4>
                          <p className="text-sm text-(--color-text-muted)">
                            {edu.institution}
                          </p>
                          <p className="text-sm text-(--color-text-muted)">
                            {new Date(edu.start_date).getFullYear()} -{" "}
                            {edu.current
                              ? t("profilePage.present")
                              : edu.end_date
                                ? new Date(edu.end_date).getFullYear()
                                : ""}
                          </p>
                          {edu.description && (
                            <p className="text-(--color-text) text-sm mt-2">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
            {/* User Posts Section */}
            {profile.user?.id && (
              <UserPosts
                userId={profile.user.id}
                currentUserId={currentUserId}
                isOwner={isOwner}
              />
            )}{" "}
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {isOwner ? (
              <>
                <UserQuickActions
                  ProfileLink={`/profile/${profile.username}`}
                  onPreviewPublicProfile={handlePreviewPublicProfile}
                  onPrivacySettings={() => setShowPrivacySettings(true)}
                  onChangePassword={() => setShowChangePassword(true)}
                  onDeleteAccount={() => setShowDeleteAccount(true)}
                />
                <UserQuickInfo
                  Email={profile.user?.email || ""}
                  Phone={profile.phone || ""}
                  Website={profile.website || ""}
                  Location={profile.location || ""}
                  MemberSince={new Date(
                    profile.created_at,
                  ).toLocaleDateString()}
                  onSave={async (data) => {
                    await handleUpdateProfile(data);
                  }}
                />
              </>
            ) : (
              <>
                {/* Viewer Mode - Contact Button */}
                <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
                  <button
                    onClick={handleSendMessage}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-(--color-primary) hover:bg-(--color-accent) text-(--color-text-inverse) font-semibold rounded-lg transition"
                  >
                    <FontAwesomeIcon icon={faMessage} />
                    {t("profilePage.contactBusiness")}
                  </button>
                </div>

                {/* Additional Info */}
                <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
                  <h3 className="font-bold text-(--color-text) mb-4">
                    {t("profilePage.contactInfo")}
                  </h3>
                  {profile.location && (
                    <p className="text-(--color-text) text-sm mb-2">
                      <span className="text-(--color-text-muted)">
                        {t("profilePage.location")}:
                      </span>{" "}
                      {profile.location}
                    </p>
                  )}
                  {profile.phone && (
                    <p className="text-(--color-text) text-sm mb-2">
                      <span className="text-(--color-text-muted)">
                        {t("profilePage.phone")}:
                      </span>{" "}
                      {profile.phone}
                    </p>
                  )}
                  {profile.website && (
                    <p className="text-(--color-text) text-sm">
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-(--color-primary) hover:underline"
                      >
                        {profile.website}
                      </a>
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Social Links */}
            <UserSocialLinks
              socialLinks={profile.social_links}
              onSave={
                isOwner
                  ? async (social_links) => {
                      await handleUpdateProfile({ social_links });
                    }
                  : undefined
              }
              readOnly={!isOwner}
            />

            <div id="profile-section-skills" className="scroll-mt-24">
              <UserTopSkills
                skills={profile.skills}
                onSave={
                  isOwner
                    ? async (skills) => {
                        await handleUpdateProfile({ skills });
                      }
                    : undefined
                }
                readOnly={!isOwner}
              />
            </div>
            <UserLanguages
              languages={profile.languages}
              onSave={
                isOwner
                  ? async (languages) => {
                      await handleUpdateProfile({ languages });
                    }
                  : undefined
              }
              readOnly={!isOwner}
            />
            <div id="profile-section-certification" className="scroll-mt-24">
              <UserCertification
                certifications={profile.certifications}
                onSave={
                  isOwner
                    ? async (certifications) => {
                        await handleUpdateProfile({ certifications });
                      }
                    : undefined
                }
                readOnly={!isOwner}
              />
            </div>
            {isOwner && (
              <UserProfileStrength
                basicInfo={items.basicInfo}
                professionalBio={items.professionalBio}
                skills={items.skills}
                portfolio={items.portfolio}
                workExperience={items.workExperience}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
