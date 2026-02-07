import { faEye, faStar } from "@fortawesome/free-regular-svg-icons";
import { faGear, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageToast from "../../utils/message";
import { useState, type ReactNode } from "react";



interface UserQuickActionsProps {
  privacySettings?: JSON;
  publicProfile: string;
  ProfileLink: string;
  EnablePublicProfile: () => void;
}




function UserQuickActions({
  privacySettings,
  ProfileLink,
  EnablePublicProfile,
}: UserQuickActionsProps) {
  const [MessageIsSent, SetMessageIsSent] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const handleCopy =  (valueToCopy: string) :undefined => {
    try {
      navigator.clipboard.writeText(valueToCopy);
      SetMessageIsSent((prev) => !prev);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setShowError(true);
    }
  };




  return (
    <>
      
      {/* <MessageToast message={"copied"}
        success={MessageIsSent}
        visible={MessageIsSent}
        onClose={() => SetMessageIsSent((prev) => !prev)}
        duration={2000}
        
      /> */}
      <div className="w-full h-full p-6 bg-mint rounded-4xl  flex flex-col text-black   gap-2 font-bold text-md">
        <div className="flex items-center pb-2 font-extrabold gap-4 text-left ">
          <FontAwesomeIcon icon={faStar} />
          <p>Quick Actions</p>
        </div>
        <div
          onClick={() => EnablePublicProfile()}
          className="flex  items-center gap-2 bg-white/20 backdrop-blur-md border    p-4 rounded-2xl "
        >
          <FontAwesomeIcon icon={faEye} />
          <p>Preview Public Profile</p>
        </div>
        <div
          onClick={() => handleCopy(ProfileLink)}
          className="flex  items-center gap-2 bg-white/20 backdrop-blur-md border p-4 rounded-2xl"
        >
          <FontAwesomeIcon icon={faShare} />
          <p>Share Profile Link</p>
        </div>
        <div className="flex   items-center gap-2 bg-white/20 backdrop-blur-md border p-4 rounded-2xl">
          <FontAwesomeIcon icon={faGear} />
          <p>Privacy Settings</p>
        </div>
      </div>
    </>
  );
}

export default UserQuickActions;
