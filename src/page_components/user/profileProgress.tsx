import rise from "../../assets/rise.png";
import ProgressSuggestions from "./progressSuggestions";

interface ProfileProgressProps {
  // Added a prop so you can control this from the parent UserProfile page
  initialProgress?: number;
}

function ProfileProgress({ initialProgress = 50 }: ProfileProgressProps) {
  const progressValue = initialProgress;

  return (
    <div className="bg-orange-100 rounded-3xl md:rounded-4xl w-full h-fit p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start lg:items-center">
      {/* Icon Container - Centered on mobile, aligned left on tablet+ */}
      <div className="shrink-0 p-4 bg-orange-200 rounded-2xl flex items-center justify-center">
        <img
          src={rise}
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
          alt="Rise Icon"
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-4 md:gap-6 w-full text-center sm:text-left">
        <div>
          <h1 className="font-bold text-lg md:text-xl text-gray-800">
            Your profile is {progressValue}% complete
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl">
            Complete your profile to attract more clients and stand out from the
            competition.
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="flex items-center gap-3">
          <div className="w-full bg-orange-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-700 ease-in-out shadow-sm"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <span className="text-sm font-bold text-orange-600 min-w-[35px]">
            {progressValue}%
          </span>
        </div>

        {/* Suggestions Grid - Uses flex-wrap for mobile responsiveness */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <ProgressSuggestions text="+ Add Portfolio" />
          <ProgressSuggestions text="+ Add certificate" />
          <ProgressSuggestions text="+ Add complete bio" />
          <ProgressSuggestions text="+ Add work experience" />
        </div>
      </div>
    </div>
  );
}

export default ProfileProgress;
