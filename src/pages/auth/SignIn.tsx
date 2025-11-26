import CheckMark from "../../components/style_components/checkMark";
import Input from "../../components/input";
import { useState } from "react";
import { prefix } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import { Link } from "react-router";

function SignIn() {
  interface SignInForm {
  
    email: string;
    password: string;
   
  }

  const [form, setForm] = useState<SignInForm>({
   
 
    email: "",
    password: "",
    
  });

  const updateForm = (Field: keyof SignInForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [Field]: value,
    }));
  };

  return (
    <div className="flex flex-row h-screen m-auto max-w-[1400px] background-image ">
      <div
        id="sign_up_side"
        className="fade-up  border-(--color-text) border-r-3  w-1/2  m-auto flex flex-col justify-baseline p-8  "
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
          <p className="section-title">Login To your Account</p>
        </div>

        <div className="fade-up flex flex-col gap-10 mt-8">
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
        </div>

        <div className="fade-up flex flex-row items-center justify-center w-full h-fit mt-10">
          <button
            className="fade-up 
           SingUpBtn"
          >
            Sign In
          </button>
        </div>
        <div>
          <input type="checkbox" />
        </div>
        <div className="fade-up flex gap-1 items-center justify-center mt-4">
          Don't have an 
          <Link className="text-blue-600 font-bold" to={"/sign-up"}>
            Account
          </Link>
        </div>
      </div>
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
              Access to 50,000+ verified freelancers
            </p>
          </li>
          <li className="fade-up flex  gap-1  ">
            <CheckMark />
            <p className="fade-up flex flex-col self-center">
              Secure payment protection
            </p>
          </li>
          <li className="fade-up flex  gap-1  ">
            <CheckMark />
            <p className="fade-up flex flex-col self-center">
              24/7 customer support
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
    </div>
  );
}

export default SignIn;
