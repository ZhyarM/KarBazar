import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Hero() {
  return (
    <>
      <section
        className="relative flex flex-row flex-nowrap py-32 px-4 
         w-full max-w-9xl h-screen justify-center align-middle
         font-sans text-base font-normal leading-6 text-(--color-text) text-left
         bg-transparent border-0 rounded-none
         opacity-100 transition-all overflow-visible "
      >
        <div className="flex justify-start items-center flex-col gap-10">
          <span
            className="inline-flex items-center justify-center gap-1 py-0.5 px-2 
                     w-[250px] h-[22px] font-inter text-[12px] font-medium leading-4 
                     text-center text-(--color-text) input-text 
                     border border-[oklab(0.999994_0.0000455678_0.0000200868/_0.3)] 
                     rounded-md transition-colors duration-150 ease-in-out overflow-hidden hover:backdrop:backdrop-blur-2xl cursor-default"
          >
            🎉 Join 50,000+ Freelancers Worldwide
          </span>
          <h1
            className="text-center font-inter text-2xl sm:text-5xl md:text-[50px] 
            font-bold leading-normal md:leading-[55px] 
            w-full max-w-[700px] text-(--color-text)"
          >
            Find the Perfect <br />
            Freelancer for Your <br />
            Project
          </h1>

          <p
            className="text-center font-inter mx-auto 
             w-full max-w-[650px]
             text-base sm:text-lg md:text-xl
             leading-normal sm:leading-normal md:leading-normal
             transition-all duration-300"
          >
            Connect with talented professionals and get your work done with
            quality and speed
          </p>

          <div className="flex flex-row justify-center items-center gap-2">
            <Button
              text={
                <>
                  Get started <FontAwesomeIcon icon={faArrowRight} />
                </>
              }
              bgColor="bg-(--btn-primary)"
              textColor="var(--btn-secondary-text)"
              backdropColor=""
            />
            <Button
              text="Become a Seller"
              bgColor="transparent"
              textColor="white"
              backdropColor="backdrop-brightness-50"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
