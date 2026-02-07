import { faCalendar, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faGlobe,
  faLink,
  faLocationDot,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";
import { useState } from "react";

interface UserTopSkillsProps {
  skills: string[];
}

function UserTopSkills({ skills }: UserTopSkillsProps) {
  const [mySkils, setMySkills] = useState<string[]>(skills);

  return (
    <>
      <form className="w-full h-full p-6 bg-(--color-card) shadow-xl text-(--color-text) rounded-4xl  flex flex-col    gap-2 font-bold text-md">
        <div className="flex   justify-between pb-2 font-extrabold gap-4 text-left ">
          <div className="flex items-center">
            
            <p className="text-xl">Skills</p>
          </div>
          <button>
            <FontAwesomeIcon icon={faPlus} />
          </button>
              </div>

              <ul className="list-inside list-disc w-full">
                  {mySkils.map(element => (
                      <li key={element}>{element}</li>
                  ))}
              </ul>

        <div className="w-full border border-(--color-text-muted) flex rounded-xl border-dashed">
          <Button
            text="Add More Skills"
            textColor="text-indigo-700"
            bold="font-bold"
          />
        </div>
      </form>
    </>
  );
}

export default UserTopSkills;
