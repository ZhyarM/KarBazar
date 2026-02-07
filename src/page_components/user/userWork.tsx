import {
  faAdd,
  faPen,
  faPlus,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";
import { Upload } from "lucide-react";

interface UserBioProps {
  images?: string[];
}

function UserWork({ images }: UserBioProps) {
  return (
    <div className=" rounded-4xl shadow-2xl">
      <div className="rounded-4xl  p-4 flex justify-between items-center">
        <div>
          <h1 className="font-extrabold text-(--color-text) text-3xl">
            Portfolio & work
          </h1>
          <p className="text-(--color-text-muted)">
            {" "}
            Showcase your best projects
          </p>
        </div>

        <div>
          <Button
            bgColor="gradient-secondary "
            text="add work"
            icon={<FontAwesomeIcon icon={faAdd} />}
            textColor="text-(--color-text)"
          />
        </div>
      </div>
      <div className=" h-120 p-4 flex gap-4">
        <div className="h-full w-1/2 gap-4 flex  flex-col  ">
          <div
            className={`flex hover:text-blue-700 justify-center items-center flex-col bg-gray-200 border-2 border-e-blue-300 border-blue-300  hover:border-blue-500 border-dashed  rounded-2xl w-full  h-1/2`}
          >
            <FontAwesomeIcon
              icon={faUpload}
              className="text-4xl hover:text-blue-300"
            />
            <p className="font-semibold text-md">add project Images</p>
          </div>
          <div
            className={`flex hover:text-blue-700 justify-center items-center flex-col bg-gray-200 border-2 border-e-blue-300 border-blue-300  hover:border-blue-500 border-dashed  rounded-2xl w-full  h-1/2`}
          >
            <FontAwesomeIcon
              icon={faUpload}
              className="text-4xl hover:text-blue-300"
            />
            <p className="font-semibold text-md">add project Images</p>
          </div>
        </div>
        <div className="h-full w-1/2 gap-4 flex  flex-col  ">
          <div
            className={`flex hover:text-blue-700 justify-center items-center flex-col bg-gray-200 border-2 border-e-blue-300 border-blue-300  hover:border-blue-500 border-dashed  rounded-2xl w-full  h-1/2`}
          >
            <FontAwesomeIcon
              icon={faUpload}
              className="text-4xl hover:text-blue-300"
            />
            <p className="font-semibold text-md">add project Images</p>
          </div>
          <div
            className={`flex hover:text-blue-700 justify-center items-center flex-col bg-gray-200 border-2 border-e-blue-300 border-blue-300  hover:border-blue-500 border-dashed  rounded-2xl w-full  h-1/2`}
          >
            <FontAwesomeIcon
              icon={faUpload}
              className="text-4xl hover:text-blue-300"
            />
            <p className="font-semibold text-md">add project Images</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserWork;
