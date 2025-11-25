import CheckMark from "../../components/style_components/checkMark";
import Input from "../../components/input";
import { useState } from "react";
import { prefix } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";

function SignUp() {
  interface SignupForm {
    first_name: string;
    last_name: string;
    gender: "Male" | "Female" | "";
    email: string;
    password: string;
    confirm_password: string;
  }

  const [form, setForm] = useState<SignupForm>({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const updateForm = (Field: keyof SignupForm, value: string) => {
    alert(value)
    setForm((prev) => ({
      ...prev,
      [Field]: value,
    }));
  };

  return (
    <div className="flex flex-row h-screen m-auto max-w-[1400px] background-image ">
      <div
        id="fill_up_side"
        className="fade-up   w-2/3 p-16  h-fit m-auto  rounded-2xl "
      >
        <h1 className="fade-up page-title gradient-text p-3">
          Start Your Freelance Journey
        </h1>
        <h2 className="fade-up small-title mt-10 w-2/3">
          Join KarBazar and connect with clients worldwide. Turn your skills
          into income.
        </h2>
        <ul className="fade-up label-heading mt-10">
          <li className="fade-up flex  gap-1  ">
            <CheckMark />
            <p className="fade-up flex flex-col self-center">
              create your professional profile
            </p>
          </li>
          <li className="fade-up flex  gap-1  ">
            <CheckMark />
            <p className="fade-up flex flex-col self-center">
              showcase your protfolio
            </p>
          </li>
          <li className="fade-up flex  gap-1  ">
            <CheckMark />
            <p className="fade-up flex flex-col self-center">
              Increae your income
            </p>
          </li>
          <li className="fade-up flex  gap-1  ">
            <CheckMark />
            <p className="fade-up flex flex-col self-center">
              Build your reputation
            </p>
          </li>
        </ul>
      </div>
      <div
        id="sign_up_side"
        className="fade-up    w-1/2  m-auto flex flex-col justify-baseline p-8 background-blur"
      >
        <div className="fade-up flex  flex-row gap-1 h-fit">
          <p className="fade-up flex justify-center items-center h-[30px] w-[30px] bg-(--color-primary) text-amber-50 rounded-lg font-bold hover:scale-110 transition-transform duration-300">
            K
          </p>

          <div className="fade-up text-lg font-bold text-(--color-primary) whitespace-nowrap">
            KarBazar
          </div>
        </div>
        <div className="fade-up flex mt-8">
          <div
            onClick={() => updateForm("gender", "Male")}
            className={`fade-up btn rounded-l-lg border w-1/2 p-2 flex justify-center btn-hover ${
              form.gender === "Male" ? "selected" : ""
            } `}
          >
            Male
          </div>
          <div
            onClick={() => updateForm("gender", "Female")}
            className={`fade-up btn rounded-r-lg border w-1/2 p-2 flex justify-center btn-hover ${
              form.gender === "Female" ? "selected" : ""
            } `}
          >
            Female
          </div>
        </div>

        <div className="fade-up flex flex-col gap-10 mt-8">
          <div className="fade-up flex flex-row gap-4">
            <Input
              icon=""
              label="First Name"
              placeholder="Zhyar"
              size="1/2"
            ></Input>
            <Input
              icon=""
              label="Last Name"
              placeholder="Mohhammad"
              size="1/2"
            ></Input>
          </div>

          <Input
            icon=""
            label="Email Address"
            placeholder="Exmaple@gmail.com"
            size="full"
          ></Input>
          <Input
            icon=""
            label="Password"
            placeholder="d$bb*****"
            size="full"
          ></Input>
          <Input
            icon=""
            label="Confirm Passowrd"
            placeholder="d$bb*****"
            size="full"
          ></Input>
        </div>
        <div className="fade-up felx flex-row mt-4">
          <input type="checkbox" />I agree to the
          <span className="fade-up text-blue-600 font-bold ">
            Terms of Service{" "}
          </span>
          and
          <span className="fade-up text-blue-600 font-bold ">
            Privacy Policy
          </span>
        </div>
        <div className="fade-up flex flex-row items-center justify-center w-full h-fit mt-10">
          <button className="fade-up SingUpBtn">Sign Up</button>
        </div>
        <div className="fade-up flex gap-1 items-center justify-center mt-4">
          already have an{" "}
          <span className="text-blue-600 font-bold">Account</span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
