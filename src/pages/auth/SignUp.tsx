import CheckMark from "../../components/style_components/checkMark";
import Input from "../../components/input";
import { useState } from "react";
import { prefix } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import { Link } from "react-router";

function SignUp() {
  interface SignupForm {
    first_name: string;
    last_name: string;
    Type: "Client" | "Bussiness" | "";
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

  return (
    <div className="flex flex-row h-screen m-auto max-w-[1400px] background-image ">
      <div
        id="fill_up_side"
        className="fade-up   w-2/3 p-16  h-fit m-auto  rounded-2xl "
      >
        <h1 className="fade-up page-title gradient-text">
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
        className="fade-up  border-(--color-text) border-l-3  w-1/2  m-auto flex flex-col justify-baseline p-8  "
      >
        <div className="fade-up flex  flex-row gap-1 h-fit">
          <p className="fade-up flex justify-center items-center h-[40px] w-[40px] bg-(--color-primary) text-amber-50 rounded-lg font-bold hover:scale-110 transition-transform duration-300">
            K
          </p>

          <div className="fade-up text-2xl font-bold text-(--color-primary) whitespace-nowrap">
            KarBazar
          </div>
        </div>
        <div className="pt-8">
          <p className="section-title">Create your First Account</p>
        </div>
        <div className="fade-up flex mt-8">
          <div
            onClick={() => updateForm("Type", "Client")}
            className={`font-bold fade-up text-lg btn rounded-l-lg border w-1/2 p-2 flex justify-center btn-hover ${
              form.Type === "Client" ? "selected" : ""
            } `}
          >
            Client Account
          </div>
          <div
            onClick={() => updateForm("Type", "Bussiness")}
            className={`font-bold text-lg fade-up btn rounded-r-lg border w-1/2 p-2 flex justify-center btn-hover ${
              form.Type === "Bussiness" ? "selected" : ""
            } `}
          >
            Bussiness Account
          </div>
        </div>

        <div className="fade-up flex flex-col gap-10 mt-8">
          <div className="fade-up flex flex-row gap-4">
            <Input
              onChange={(value) => updateForm("first_name", value)}
              icon=""
              label="First Name"
              placeholder="Zhyar"
              size="1/2"
            ></Input>
            <Input
              onChange={(value) => updateForm("last_name", value)}
              icon=""
              label="Last Name"
              placeholder="Mohhammad"
              size="1/2"
            ></Input>
          </div>

          <Input
            onChange={(value) => updateForm("email", value)}
            icon=""
            label="Email Address"
            placeholder="Exmaple@gmail.com"
            size="full"
          ></Input>
          <Input
            onChange={(value) => updateForm("password", value)}
            icon=""
            label="Password"
            placeholder="d$bb*****"
            size="full"
          ></Input>
          <Input
            onChange={(value) => updateForm("confirm_password", value)}
            icon=""
            label="Confirm Passowrd"
            placeholder="d$bb*****"
            size="full"
          ></Input>
        </div>

        <div className="fade-up flex flex-row items-center justify-center w-full h-fit mt-10">
          <button className="fade-up 
           SingUpBtn">Sign Up</button>
        </div>
        <div className="fade-up flex gap-1 items-center justify-center mt-4">
          already have an
          <Link className="text-blue-600 font-bold" to={"/sign-in"}>
            
            Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
