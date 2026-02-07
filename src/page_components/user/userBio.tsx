import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";

interface UserBioProps {
  bio?: string;
}

function UserBio({ bio }: UserBioProps) {
  return (
    <div className=" rounded-4xl shadow-2xl">
      <div className="rounded-4xl  p-4 flex justify-between items-center">
        <div>
          <h1 className="font-extrabold text-(--color-text) text-3xl">
            Professional Bio
          </h1>
          <p className="text-(--color-text-muted)">
            {" "}
            Tell clients what makes you unique
          </p>
        </div>
        {/* <button className="gradient-secondary h-fit flex rounded-xl p-2 gap-2 pl-3 pr-4 justify-center items-center ">
            <FontAwesomeIcon icon={faPen} />
            <p>Edit Bio</p>
          </button> */}
        <div>
          <Button
            bgColor="gradient-secondary "
            text="Edit Bio"
            icon={<FontAwesomeIcon icon={faPen} />}
            textColor="text-(--color-text)"
          />
        </div>
      </div>
      <div className=" h-96 p-4">
        <div
          className={`${bio ? " " : "border-dashed"} border-2 border-e-blue-300 border-blue-300  hover:border-blue-500  rounded-2xl   h-full`}
        >
          {bio ? (
            <div className="h-full max-h-96">
              <div className="flex justify-center h-full w-full border p-8 font-semibold">
                {bio}
              </div>
            </div>
          ) : (
            <div className="h-full">
              <div className=" flex items-center justify-center flex-col h-full gap-4">
                <div className="text-indigo-500 bg-indigo-300 h-14 w-14 flex items-center justify-center rounded-2xl">
                  <FontAwesomeIcon icon={faPen} className="text-3xl" />
                </div>
                <h1 className="font-extrabold text-(--color-text) text-2xl">
                  Your story starts here
                </h1>
                <h1 className="w-3/4 text-center text-(--color-text-muted) text-sm font-semibold">
                  A compelling bio helps you get 40% more job offers. Highlight
                  your expertise and passion!
                </h1>
                <div>
                  <Button
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    text="Write Your Bio"
                    bgColor="gradient-secondary"
                    textColor="text-xl text-(--color-text)"
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
export default UserBio;
