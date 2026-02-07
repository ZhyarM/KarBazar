import { faCalendar, faEnvelope, faEye, faStar } from "@fortawesome/free-regular-svg-icons";
import {
  faBorderAll,
  faGear,
  faGlobe,
  faLink,
  faLocationDot,
  faLocationPin,
  faMailBulk,
  faPhone,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageToast from "../../utils/message";
import { useState, type ReactNode } from "react";
import { faInternetExplorer } from "@fortawesome/free-brands-svg-icons";
import Button from "../../components/btns/Button";

interface UserQuickInfoProps {
  Email: string;
  Location: string;
  Website: string;
  MemberSince: string;
  Phone: string;
}

function UserQuickInfo({
  Email="example@gamil.com",
  Location="myLocation",
  Website="www.example.com",
  MemberSince = "234days",
  Phone= "07XX XXX XXXX"
}: UserQuickInfoProps) {
  const [EmailInPut, setEmail] = useState<string>(Email);
  const [LocationInPut, setLocation] = useState<string>(Location);
  const [WebsiteInPut, setWebsite] = useState<string>(Website);
  const [MemberSinceInPut, setMemberSince] = useState<string>(MemberSince);
  const [PhoneInPut, setPhone] = useState<string>(Phone);

  return (
    <>
      {/* <MessageToast message={"copied"}
        success={MessageIsSent}
        visible={MessageIsSent}
        onClose={() => SetMessageIsSent((prev) => !prev)}
        duration={2000}
        
      /> */}
      <form className="w-full h-full p-6 bg-(--color-card) shadow-xl text-(--color-text) rounded-4xl  flex flex-col    gap-2 font-bold text-md">
        <div className="flex items-center pb-2 font-extrabold gap-4 text-left ">
          <FontAwesomeIcon icon={faGlobe} className="text-indigo-700 text-xl" />
          <p className="text-xl">Quick Info</p>
        </div>
        <div className="flex  items-center gap-4 text- border-b border-(--color-text-muted) font-semibold    p-4 ">
          <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center  bg-indigo-200 text-indigo-700">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <div>
            <p className="font-extrabold text-(--color-text-muted)">Email</p>
            <input
              type="text"
              placeholder={EmailInPut}
              value={EmailInPut}
              className="font-bold border-none outline-none bg-transparent appearance-none"
            />
          </div>
        </div>
        <div className="flex  items-center gap-4 text- border-b border-(--color-text-muted) font-semibold    p-4 ">
          <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center  bg-indigo-200 text-indigo-700">
            <FontAwesomeIcon icon={faPhone} />
          </div>
          <div>
            <p className="font-extrabold text-(--color-text-muted)">Phone Number</p>
            <input
              type="text"
              placeholder={PhoneInPut}
              value={PhoneInPut}
              className="font-bold border-none outline-none bg-transparent appearance-none"
            />
          </div>
        </div>
        <div className="flex  items-center gap-4 text- border-b border-(--color-text-muted) font-semibold    p-4 ">
          <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center  bg-indigo-200 text-indigo-700">
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div>
            <p className="font-extrabold text-(--color-text-muted)">Location</p>
            <input
              type="text"
              placeholder={LocationInPut}
              value={LocationInPut}
              className="font-bold border-none outline-none bg-transparent appearance-none"
            />
          </div>
        </div>
        <div className="flex  items-center gap-4 text- border-b border-(--color-text-muted) font-semibold    p-4 ">
          <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center  bg-indigo-200 text-indigo-700">
            <FontAwesomeIcon icon={faLink} />
          </div>
          <div>
            <p className="font-extrabold text-(--color-text-muted)">Website</p>
            <input
              type="text"
              placeholder={WebsiteInPut}
              value={WebsiteInPut}
              className="font-bold border-none outline-none bg-transparent appearance-none"
            />
          </div>
        </div>
        <div className="flex  items-center gap-4  font-semibold    p-4 ">
          <div className="p-2 rounded-xl h-8 w-8 flex items-center justify-center  bg-indigo-200 text-indigo-700">
            <FontAwesomeIcon icon={faCalendar} />
          </div>
          <div>
            <p className="font-extrabold text-(--color-text-muted)">Member Since</p>
            <input
              type="text"
              placeholder={MemberSince}
              value={MemberSince}
              className="font-bold border-none outline-none bg-transparent appearance-none"
            />
                  </div>
        </div>
            <Button backdropColor="bg-indigo-200 " text="update Info" textColor="text-indigo-700" bold="font-bold"/>
      </form>
    </>
  );
}

export default UserQuickInfo;
