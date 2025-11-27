
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import check from "../../assets//check.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

  type check = {
    bg_color: string;
    mark_color: string;
  };



export default function checkmark({ bg_color, mark_color }: check) {


    return (
      <div className={`w-10 h-10 rounded-full ${bg_color}  flex items-center justify-center opacity-80 `}>
        <FontAwesomeIcon className={`${mark_color}`} icon={faCheck} />
      </div>
    );
}