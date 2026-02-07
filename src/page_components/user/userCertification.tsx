import { faAward, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/btns/Button";

interface UserCertificationProps {
  certifications?: string[];
}

function UserCertification({ certifications }: UserCertificationProps) {
  return (
    <div className="rounded-4xl shadow-2xl bg-(--color-card) w-full h-full flex flex-col">
      {/* Header */}
      <div className="rounded-t-4xl p-4 sm:p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faAward}
            className="text-lg sm:text-xl text-indigo-700"
          />
          <h1 className="font-extrabold text-(--color-text) text-lg sm:text-xl">
            Certifications
          </h1>
        </div>

        <div>
          <button className="flex justify-center items-center gap-1 hover:opacity-75 transition-opacity">
            <FontAwesomeIcon icon={faPlus} className="text-xs sm:text-sm" />
            <p className="font-extrabold text-sm sm:text-base">Add</p>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 h-full flex-1">
        <div
          className={`${
            certifications && certifications.length > 0 ? "" : "border-dashed"
          } border-2 border-blue-300 hover:border-blue-500 rounded-2xl w-full h-full min-h-[200px] transition-colors duration-300`}
        >
          {certifications && certifications.length > 0 ? (
            <div className="h-full w-full">
              <div className="flex flex-col gap-2 p-4 sm:p-6 font-semibold break-words">
                {/* Renders list items properly if array, or text if string */}
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <span className="text-sm sm:text-base text-(--color-text)">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="h-full py-8 sm:py-12 flex items-center justify-center flex-col gap-4 text-center">
              <div className="text-indigo-500 h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-2xl bg-indigo-50/50">
                <FontAwesomeIcon
                  icon={faAward}
                  className="text-2xl sm:text-3xl"
                />
              </div>

              <h1 className="w-4/5 sm:w-3/4 text-center text-(--color-text-muted) text-xs sm:text-sm font-semibold">
                Add certificates to boost credibility
              </h1>

              <div className="text-xs sm:text-sm scale-90 sm:scale-100">
                <Button
                  text="Add Certifications"
                  textColor="text-base sm:text-xl text-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCertification;
