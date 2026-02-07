import { faAdd, faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";

interface UserBioProps {
  experience?: string;
}

function UserWorkExperience({ experience}: UserBioProps) {
  return (
    <div className=" rounded-4xl shadow-2xl">
      <div className="rounded-4xl  p-4 flex justify-between items-center">
        <div>
          <h1 className="font-extrabold text-(--color-text) text-3xl">
            work experience
          </h1>
          <p className="text-(--color-text-muted)">
            {" "}
            Your professional journey
          </p>
        </div>

        <div>
          <Button
            bgColor="bg-indigo-200 font-bold"
            text="add Experience"
            icon={<FontAwesomeIcon icon={faAdd} />}
            textColor="text-indigo-700 "
          />
        </div>
      </div>
      <div className=" h-60 p-4">
        <div
          className={`${experience ? " " : "border-dashed"} border-2 border-e-blue-300 border-blue-300  hover:border-blue-500   rounded-2xl   h-full`}
        >
          {experience ? (
            <div className="h-full max-h-96">
              <div className="flex justify-center h-full w-full border p-8 font-semibold">
                {experience}
              </div>
            </div>
          ) : (
            <div className="h-full">
              <div className=" flex items-center justify-center flex-col h-full gap-4">
                
                <h1 className="font-extrabold text-(--color-text) text-2xl leading-relaxed">
                  Your story starts here
                </h1>
                <h1 className="w-3/4 text-center text-(--color-text-muted) text-sm font-semibold">
                  Add your work experience to build credibility
                </h1>
                <div>
                  <Button
                    text="add your first experience"
                   
                    textColor="text-xl text-indigo-700"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default UserWorkExperience;
