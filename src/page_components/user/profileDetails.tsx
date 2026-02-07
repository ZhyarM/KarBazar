import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faEye,
  faHeart,
  faPen,
  faStar,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import moon from "../../assets/moon.png";

interface ProfileDetailsProps {
  name?: string;
  username?: string;
  views?: number;
  saves?: number;
  available?: boolean;
  topRated?: boolean;
  cover_url?: string;
  avatar_url?: string;
  typeOfBussiness: string;
}

function ProfileDetails({
  name = "Daratoo.comp",
  username = "@daratoo.comp1",
  views = 500,
  saves = 500,
  available = false,
  topRated = false,
  cover_url,
  avatar_url,
  typeOfBussiness,
}: ProfileDetailsProps) {
  const finalCover =
    cover_url && cover_url.trim().length > 0 ? cover_url : null;
  const finalAvatar =
    avatar_url && avatar_url.trim().length > 0 ? avatar_url : moon;

  return (
    <div className="w-full">
      <div className="w-full min-h-[400px] lg:h-96 bg-white rounded-3xl lg:rounded-4xl overflow-hidden shadow-xl flex flex-col">
        {/* COVER SECTION */}
        <div
          className={`relative h-48 lg:h-3/4 p-4 flex justify-between items-start transition-all ${
            finalCover
              ? "bg-cover bg-center"
              : "bg-gradient-to-r from-indigo-500 to-purple-600"
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
          <div className="flex gap-2">
            <button className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl flex justify-center items-center text-white hover:bg-white/40 transition-all">
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl flex justify-center items-center text-white hover:bg-white/40 transition-all">
              <FontAwesomeIcon icon={faUpload} />
            </button>
          </div>
        </div>

        {/* PROFILE INFO SECTION */}
        <div className="flex-1 bg-white px-6 pb-6 pt-0 lg:pt-0 relative flex flex-col lg:flex-row items-center lg:items-end">
          {/* Avatar Wrapper */}
          <div className="relative -top-12 lg:-top-16 shrink-0">
            <img
              src={finalAvatar}
              alt={name}
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
            />
          </div>

          {/* Identity & Status */}
          <div className="flex flex-col lg:flex-row justify-between w-full lg:ml-6 mt-[-40px] lg:mt-0 pb-2">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-800">
                {name}
              </h2>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 mt-1">
                <span className="text-sm lg:text-lg font-bold text-indigo-600">
                  {username}
                </span>
                <span className="hidden lg:inline text-gray-300">•</span>
                <span className="text-sm lg:text-lg font-semibold text-gray-500 flex items-center gap-1">
                  {typeOfBussiness}
                </span>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2 mt-4 lg:mt-0 justify-center items-end">
              {available ? (
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
