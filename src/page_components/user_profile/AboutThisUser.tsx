import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useOutletContext } from "react-router-dom";

type OutletContextType = {
  intro: string;
  username: string;
  whatYoullGet?: string[];
  technologies?: string[];
};

function AboutThisUser() {
  const { username, intro, whatYoullGet, technologies } = useOutletContext<OutletContextType>();

  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="subsection-title text-(--color-text)">
          About {username}
        </h2>
        <span className="text-md text-(--color-text-muted)">{intro}</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="small-title text-(--color-text)">
          What will you get:
        </span>
        <ul>
          {whatYoullGet?.map((services: string) => (
            <li key={services} className="text-md text-(--color-text)  py-1">
              <FontAwesomeIcon
                className="text-(--color-success) text-xl pr-1 duration-200 hover:scale-110 "
                icon={faCircleCheck}
              />{" "}
              {services}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <span className="small-title text-(--color-text)">
          Technologies I use:{" "}
        </span>
        <ul className="flex gap-2 text-(--color-text) text-xs font-semibold">
          {technologies?.map((tech) => (
            <li
              key={tech}
              className="bg-(--color-bg-muted) rounded-md p-1.5 duration-300 hover:scale-110"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AboutThisUser;
