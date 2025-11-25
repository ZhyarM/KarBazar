
import check from "../../assets//check.png";

export default function checkmark() {
    return (
      <div className="w-10  h-10 rounded-full m-1 gradient text-transparent ">
        <img  src={check} alt="" />
      </div>
    );
}