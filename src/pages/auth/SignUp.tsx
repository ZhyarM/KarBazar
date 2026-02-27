import CheckMark from "../../components/style_components/checkMark";
import Input from "../../components/navbar_components/input";
import { useState } from "react";
import {
  faEye,
  faEyeSlash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../../API/RegisterAPI";

import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageToast from "../../utils/message";

function SignUp() {
  const [message, setMessage] = useState<string | null>(null);
  interface SignupForm {
    first_name: string;
    last_name: string;
    Type: "client" | "business" | "";
    email: string;
    password: string;
    confirm_password: string;
  }

  const [form, setForm] = useState<SignupForm>({
    first_name: "",
    last_name: "",
    Type: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const updateForm = (Field: keyof SignupForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [Field]: value,
    }));
  };

  const [IsHidden, setIsHidden] = useState(false);

  //API call
  const [loading, setLoading] = useState(false); // show saving spinner
  const [success, setSuccess] = useState<boolean | null>(null); // track success/error

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("creating user");
    e.preventDefault();
    setLoading(true);

    console.log(form);

    const res = await registerUser({
      name: form.first_name + " " + form.last_name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirm_password,
      role: form.Type,
    });

    if (res.success) {
      setSuccess(true);
      setMessage(res.message);
    } else {
      setSuccess(false);
    }

    console.log(res);

    setLoading(false);
  };

  return (
    <>
      <MessageToast
        visible={success !== null}
        message={message}
        success={success}
        onClose={() => {
          setSuccess(null);
          setMessage(null);
        }}
      />
      <div className="flex flex-row h-screen  w-full background-image ">
        <div
          id="fill_up_side"
          className="fade-up hidden md:block svg w-1/2 bg-(--color-bg) flex-col justify-center items-center p-24    "
        >
          <div className=" h-fit w-fit flex flex-col gap-5 svg-light   ">
            <div className="fade-up flex  flex-row gap-1 h-fit">
              <p className="fade-up flex justify-center items-center h-10 w-10 bg-(--color-primary) text-amber-50 rounded-lg font-bold hover:scale-110 transition-transform duration-300">
                K
              </p>

              <div className="fade-up text-2xl font-bold text-(--color-primary) whitespace-nowrap">
                KarBazar
              </div>
            </div>
            <h1
              className="  font-inter text-2xl sm:text-5xl md:text-7xl
            tracking-tight font-bold font-sans
             leading-normal md:leading-[90px] 
              text-(--color-text)"
            >
              Start Your Online Service
            </h1>
            <h2
              className="  font-inter text-2xl sm:text-5xl md:text-xl
            tracking-tight font-bold font-sans
              text-(--color-text)"
            >
              Join KarBazar and connect with clients Nation-wide. <br /> Turn
              your skills into income.
            </h2>
            <ul className="fade-up label-heading mt-10 flex flex-col gap-5">
              <li className="fade-up flex  gap-1  ">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  create your professional profile
                </p>
              </li>
              <li className="fade-up flex  gap-1  ">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  showcase your portfolio
                </p>
              </li>
              <li className="fade-up flex  gap-1  ">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  Increase your income
                </p>
              </li>
              <li className="fade-up flex  gap-1  ">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  Build your reputation
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div
          id="sign_up_side"
          className="fade-up w-full md:w-1/2 bg-(--color-bg-inverse) flex flex-col justify-center items-center     "
        >
          <form onSubmit={handleSubmit} className=" h-fit w-fit ">
            <h1
              className="  font-inter text-2xl sm:text-5xl md:text-4xl
            tracking-tight font-bold font-sans
             leading-normal md:leading-[90px] 
              text-(--color-text-inverse)"
            >
              <FontAwesomeIcon
                className="mr-2 text-(--color-accent)"
                icon={faUserPlus}
              />
              Create your Account
            </h1>
            <div className="fade-up flex mt-8">
              <div
                onClick={() => updateForm("Type", "client")}
                className={`font-bold text-lg fade-up bg-(--color-surface) rounded-l-lg border w-1/2 p-2 flex justify-center text-(--color-text)   ${
                  form.Type === "client" ? "selected" : ""
                } `}
              >
                Regular User
              </div>
              <div
                onClick={() => updateForm("Type", "freelancer")}
                className={`font-bold text-lg fade-up bg-(--color-surface) rounded-r-lg border w-1/2 p-2 flex justify-center text-(--color-text)   ${
                  form.Type === "freelancer" ? "selected" : ""
                } `}
              >
                Freelancer
              </div>
            </div>

            <div className="fade-up flex flex-col gap-10 mt-8">
              <div className="fade-up flex flex-row gap-4">
                <Input
                  type="text"
                  onChange={(value) => updateForm("first_name", value)}
                  icon=""
                  label="First Name"
                  placeholder="Zhyar"
                  size="1/2"
                ></Input>
                <Input
                  type="text"
                  onChange={(value) => updateForm("last_name", value)}
                  icon=""
                  label="Last Name"
                  placeholder="Mohhammad"
                  size="1/2"
                ></Input>
              </div>

              <Input
                type="text"
                onChange={(value) => updateForm("email", value)}
                icon=""
                label="Email Address"
                placeholder="Example@gmail.com"
                size="full"
              ></Input>

              <div className="relative">
                <Input
                  type={IsHidden ? "text" : "password"}
                  onChange={(value) => updateForm("password", value)}
                  icon=""
                  label="Password"
                  placeholder="d$bb*****"
                  size="full"
                ></Input>
                <FontAwesomeIcon
                  onClick={() => setIsHidden((prev) => !prev)}
                  className="absolute top-1/3 hover:cursor-pointer right-2 text-(--color-text-inverse)"
                  icon={IsHidden ? faEye : faEyeSlash}
                />
              </div>

              <div className="relative">
                <Input
                  type={IsHidden ? "text" : "password"}
                  onChange={(value) => updateForm("confirm_password", value)}
                  icon=""
                  label="Confirm Password"
                  placeholder="d$bb*****"
                  size="full"
                ></Input>
                <FontAwesomeIcon
                  onClick={() => setIsHidden((prev) => !prev)}
                  className="absolute top-1/3 hover:cursor-pointer right-2 text-(--color-text-inverse)"
                  icon={IsHidden ? faEye : faEyeSlash}
                />
              </div>
            </div>

            <div className="fade-up flex flex-row items-center justify-center w-full h-10  mt-10 bg-(--color-accent) rounded-xl  ">
              <button
                type="submit"
                disabled={loading}
                className="fade-up 
           SingUpBtn"
              >
                Sign Up
              </button>
            </div>
            <div className="fade-up flex gap-1 items-center justify-center mt-4 text-(--color-text-inverse)">
              already have an
              <Link className="text-blue-600 font-bold" to={"/sign-in"}>
                Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
