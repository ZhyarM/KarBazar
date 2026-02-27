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

function UserProfile() {
  const navigate = useNavigate();
  const { username: usernameParam } = useParams<{ username?: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
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
      setError("Failed to load profile. Please try again.");
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
      setToast({ message: "Profile updated successfully", type: "success" });
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      setToast({ message: "Failed to update profile", type: "error" });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadProfilePicture(file);
      await fetchProfile(); // Refresh to get new avatar URL
      setToast({ message: "Profile picture updated", type: "success" });
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setToast({ message: "Failed to upload profile picture", type: "error" });
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      await uploadCoverPhoto(file);
      await fetchProfile(); // Refresh to get new cover URL
      setToast({ message: "Cover photo updated", type: "success" });
    } catch (err) {
      console.error("Error uploading cover:", err);
      setToast({ message: "Failed to upload cover photo", type: "error" });
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
      setToast({ message: "Profile info updated", type: "success" });
      return true;
    } catch (err) {
      console.error("Error updating basic info:", err);
      setToast({ message: "Failed to update profile info", type: "error" });
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

  const handleSendMessage = () => {
    if (profile?.user?.id) {
      navigate(`/messages/${profile.user.id}`);
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
      professionalBio: !!(profile.bio && profile.bio.length > 50),
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
          <p className="text-(--color-text-muted)">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-(--color-bg)">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Profile not found"}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90"
          >
            Try Again
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
          <p className="text-(--color-text) mb-4">This profile is private</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { percentage, items } = calculateProfileStrength();

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

      <div className="flex flex-col gap-3 w-full max-w-7xl px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-(--color-accent) hover:text-(--color-primary) font-semibold self-start"
        >
          &larr; Back
        </button>

        {/* Progress Bar - Only show for owner */}
        {isOwner && (
          <div className="w-full">
            <ProfileProgress initialProgress={percentage} />
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Left Column: Details & Work */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <ProfileDetails
              available={profile.is_available ?? true}
              topRated={profile.rating >= 4.5}
              cover_url={profile.cover_url || ""}
              avatar_url={profile.avatar_url || profile.user?.image || ""}
              name={profile.user?.name || "User"}
              username={profile.username}
              title={profile.title || ""}
              saves={profile.profile_views}
              typeOfBussiness={profile.title || "Freelancer"}
              views={profile.profile_views}
              isOwner={isOwner}
              onAvatarUpload={isOwner ? handleAvatarUpload : undefined}
              onCoverUpload={isOwner ? handleCoverUpload : undefined}
              onUpdateBasicInfo={isOwner ? handleUpdateBasicInfo : undefined}
              onToggleAvailability={
                isOwner ? handleToggleAvailability : undefined
              }
            />
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Statscard
                icon={<FontAwesomeIcon icon={faStar} />}
                IconColor="text-orange-500"
                bg_color="bg-orange-100"
                label="Rating"
                value={profile.rating.toFixed(1)}
                rating={profile.rating}
                reviews={profile.total_reviews}
              />
              <Statscard
                icon={<FontAwesomeIcon icon={faBriefcase} />}
                IconColor="text-blue-500"
                bg_color="bg-blue-100"
                label="Jobs"
                value={profile.total_jobs.toString()}
                projects={profile.total_jobs}
              />
              <Statscard
                icon={<FontAwesomeIcon icon={faDollar} />}
                IconColor="text-green-500"
                bg_color="bg-green-100"
                label="Completed"
                value={profile.total_jobs.toString()}
                projects={profile.total_jobs}
              />
              <Statscard
                icon={<FontAwesomeIcon icon={faClock} />}
                IconColor="text-purple-500"
                bg_color="bg-purple-100"
                label="Response"
                value={`${profile.response_time}h`}
                avgTime={profile.response_time}
              />
            </div>
            {/* Bio Section */}
            <div className="w-full">
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
                    About
                  </h3>
                  <p className="text-(--color-text) leading-relaxed">
                    {profile.bio || "No bio available"}
                  </p>
                </div>
              )}
            </div>
            {/* Portfolio Section */}
            <div className="w-full">
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
                    Portfolio
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
                                View Project
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-(--color-text-muted)">
                      No portfolio items
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* Work Experience Section */}
            <div className="w-full">
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
                    Work Experience
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
                              : "Present"}
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
                      No work experience
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
                      Education
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
                              ? "Present"
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
                  EnablePublicProfile={enablePublicProfile}
                  ProfileLink={`/profile/${profile.username}`}
                  publicProfile={isPublicProfile ? "active" : ""}
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
                    Contact Freelancer
                  </button>
                </div>

                {/* Additional Info */}
                <div className="bg-(--color-card) border border-(--color-border) rounded-lg p-6">
                  <h3 className="font-bold text-(--color-text) mb-4">
                    Contact Info
                  </h3>
                  {profile.location && (
                    <p className="text-(--color-text) text-sm mb-2">
                      <span className="text-(--color-text-muted)">
                        Location:
                      </span>{" "}
                      {profile.location}
                    </p>
                  )}
                  {profile.phone && (
                    <p className="text-(--color-text) text-sm mb-2">
                      <span className="text-(--color-text-muted)">Phone:</span>{" "}
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
