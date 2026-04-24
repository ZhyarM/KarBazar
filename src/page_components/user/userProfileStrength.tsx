import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "../../context/LanguageContext";

interface UserProfileStrengthProps {
  basicInfo: boolean;
  professionalBio: boolean;
  skills: boolean;
  portfolio: boolean;
  workExperience: boolean;
}

function UserProfileStrength({
  basicInfo,
  professionalBio,
  skills,
  portfolio,
  workExperience,
}: UserProfileStrengthProps) {
  const { t } = useLanguage();
  // 1. Calculate Progress
  const criteria = [
    basicInfo,
    professionalBio,
    skills,
    portfolio,
    workExperience,
  ];
  const completedCount = criteria.filter(Boolean).length;
  const progressPercent = (completedCount / criteria.length) * 100;

  // 2. Helper to render rows
  const StatusRow = ({ label, isDone }: { label: string; isDone: boolean }) => (
    <div
      className={`flex items-center justify-between p-2 rounded-lg ${isDone ? "opacity-100" : "opacity-50"}`}
    >
      <div className="flex items-center gap-3">
        <FontAwesomeIcon
          icon={isDone ? faCheckCircle : faCircle}
          className={isDone ? "text-green-500" : "text-gray-400"}
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {!isDone && (
        <button
          type="button"
          className="text-xs text-indigo-600 hover:underline"
        >
          {t("profile.profileStrength.add")}
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full p-6 bg-(--color-card) shadow-xl text-(--color-text) rounded-4xl flex flex-col gap-4">
      {/* Header & Percentage */}
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-extrabold">{t("profile.profileStrength.title")}</h3>
          <p className="text-sm font-medium text-gray-500">
            {completedCount}/{criteria.length} {t("profile.profileStrength.completed")}
          </p>
        </div>
        <span className="text-2xl font-black text-indigo-700">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-700 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <hr className="border-gray-100 my-2" />

      {/* List of Requirements */}
      <div className="flex flex-col gap-1">
        <StatusRow label={t("profilePage.progress.addBasicInfo")} isDone={basicInfo} />
        <StatusRow label={t("profilePage.progress.addCompleteBio")} isDone={professionalBio} />
        <StatusRow label={t("profilePage.progress.addSkills")} isDone={skills} />
        <StatusRow label={t("profilePage.progress.addPortfolio")} isDone={portfolio} />
        <StatusRow label={t("profilePage.progress.addWorkExperience")} isDone={workExperience} />
      </div>
    </div>
  );
}

export default UserProfileStrength;
