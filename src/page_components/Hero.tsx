import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




function Hero() {
  return (
    <>
      <section
        className="relative flex flex-row flex-nowrap items-center align-middle justify-center 
         w-full max-w-9xl h-screen 
         font-sans text-base font-normal leading-6 text-(--color-text) text-left
         bg-(--color-bg) border-0 rounded-none svg-hero
         opacity-100 transition-all overflow-visible p-1 "
      >
        <div className="flex justify-start items-center flex-col gap-10 md:gap-5 lg:gap-7 z-10">
          <span
            className=" bg-(--color-accent) text-(--color-text-inverse)
            font-bold text-4xl rounded-2xl p-4 pt-8 pb-8 color-animation 
            mt-3
            "
          >
            KarBazar
          </span>
          <h1
            className="text-center  font-inter text-2xl sm:text-5xl md:text-7xl
            tracking-tight font-bold font-sans
             leading-normal md:leading-[90px] 
            w-full  text-(--color-text)"

          >
            Discover nation-wide <br /> services
          </h1>

          <p
            className="text-center font-inter mx-auto 
             w-full max-w-[650px]
             text-base sm:text-lg md:text-xl
             leading-normal sm:leading-normal md:leading-normal
             transition-all duration-300 text-(--color-text-muted) opacity-55 "
          >
            Connect with talented professionals and get your work done with
            quality and speed
          </p>

          <div className="flex flex-row justify-center items-center gap-2">
            <div className="border-2 p-1 rounded-4xl bg-(--color-bg-inverse) text-(--color-text-inverse) font-">
              <Button
                text="join for free"
                bgColor="bg-(--btn-primary)"
                textColor="var(--btn-secondary-text)"
                backdropColor=""
              />
            </div>
            <div className="border-2 rounded-4xl p-1">
              <Button
                text={
                  <>
                    our services
                    <div className="ml-1 w-6 h-6 flex items-center rounded-full justify-center bg-(--color-accent)">
                      <FontAwesomeIcon
                        className="text-white"
                        icon={faArrowRight}
                      />
                    </div>
                  </>
                }
                bgColor="transparent"
                textColor="var(--color-text)"
                backdropColor=""
              />
            </div>
          </div>
          <section className="hidden md:hidden lg:block">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-center  text-(--color-text-muted)  font-semibold  mb-4">
                Trusted by professionals from all fields
              </h2>

              <div className="flex flex-wrap justify-center gap-10 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center ">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <span className="text-gray-500 text-lg font-medium">
                    Plumbers
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center ">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <span className="text-gray-500 text-lg font-medium">
                    Programmers
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center ">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <span className="text-gray-500 text-lg font-medium">
                    Electricians
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center ">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <span className="text-gray-500 text-lg font-medium">
                    Designers
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center ">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <span className="text-gray-500 text-lg font-medium">
                    Singers
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center ">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                  <span className="text-gray-500 text-lg font-medium">
                    Even more
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

export default Hero;
