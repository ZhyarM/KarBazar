import ProfileProgress from "./profileProgress";
import ProfileDetails from "./profileDetails";
import Statscard from "./ProfileStatsCard";
import { faStar, faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faDollar } from "@fortawesome/free-solid-svg-icons";
import UserBio from "./userBio";
import UserWork from "./userWork";
import UserWorkExperience from "./userWorkExperience";
import { useState } from "react";
import UserQuickActions from "./userQuickActions";
import UserQuickInfo from "./userQuickinfo";
import UserTopSkills from "./userTopSkills";
import UserLanguages from "./userLanguages";
import UserCertification from "./userCertification";
import UserProfileStrength from "./userProfileStrength";

function UserProfile() {
  const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);

  const enablePublicProfile = () => {
    setIsPublicProfile((prev) => !prev);
  };

  return (
    <div className="flex justify-center bg-(--color-bg) min-h-screen">
      <div className="flex flex-col gap-3 w-full max-w-7xl px-4 py-6">
        {/* Progress Bar - Full Width */}
        <div className="w-full">
          <ProfileProgress />
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Left Column: Details & Work (Stacked on mobile, 2/3 width on desktop) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <ProfileDetails
              available={true}
              topRated={true}
              cover_url=""
              avatar_url=""
              name="Daratoo.comp"
              username="daratoo22"
              saves={500}
              typeOfBussiness="Construction"
              views={3000}
            />

            {/* Stats Grid: 1 column on tiny phones, 2 on tablets, 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Statscard
                icon={<FontAwesomeIcon icon={faStar} />}
                IconColor="text-orange-500"
                bg_color="bg-orange-100"
                label="Rating"
                value="4.9"
                rating={234}
                reviews={5236}
              />
              <Statscard
                icon={<FontAwesomeIcon icon={faBriefcase} />}
                IconColor="text-blue-500"
                bg_color="bg-blue-100"
                label="Completed"
                value="24"
                completed_projects={22}
                projects={33}
              />
              <Statscard
                icon={<FontAwesomeIcon icon={faDollar} />}
                IconColor="text-green-500"
                bg_color="bg-green-100"
                label="Revenue"
                value="200"
                revenue={222}
                total_earnings={5200}
              />
              <Statscard
                icon={<FontAwesomeIcon icon={faClock} />}
                IconColor="text-purple-500"
                bg_color="bg-purple-100"
                label="Response"
                value="2"
                response_time={2}
                avgTime={1}
              />
            </div>

            <div className="w-full">
              <UserBio bio="" />
            </div>
            <div className="w-full">
              <UserWork images={[]} />
            </div>
            <div className="w-full">
              <UserWorkExperience experience="" />
            </div>
          </div>

          {/* Right Column: Sidebar Info (Stacked on mobile, 1/3 width on desktop) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <UserQuickActions
              EnablePublicProfile={enablePublicProfile}
              ProfileLink="yourprofile.com"
              publicProfile={isPublicProfile ? "active" : ""}
            />
            <UserQuickInfo
              Email="example@gmail.com"
              Phone="0750 232 9093"
              Location="Erbil"
              MemberSince="234 days"
              Website="www.youtube.com"
            />
            <UserTopSkills skills={["html", "css", "js"]} />
            <UserLanguages languages={["Kurdish", "English", "Arabic"]} />
            <UserCertification certifications={[]} />
            <UserProfileStrength
              basicInfo={true}
              professionalBio={true}
              skills={false}
              portfolio={false}
              workExperience={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
