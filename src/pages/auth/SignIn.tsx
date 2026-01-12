import CheckMark from "../../components/style_components/checkMark";
import Input from "../../components/navbar_components/input";
import { useState } from "react";
import { faEye, faEyeSlash, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loginuser } from "../../API/LoginAPI";
import MessageToast from "../../utils/message";


function isLogedIn() {
  if (localStorage.getItem("LoginUsertoken")) {
    return true;
  } else {
    return false;
  }
}

function SignIn() {
  if (isLogedIn()) {
    window.location.href = "/";
  }



  const navigate = useNavigate();

  interface SignInForm {
    email: string;
    password: string;
  }

  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
  });

  const updateForm = (field: keyof SignInForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [IsHidden, setIsHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("logging in user");
    e.preventDefault();

    setLoading(true);
    setSuccess(null);
    setMessage(null);

    try {
      const res = await loginuser({
        email: form.email,
        password: form.password,
      });

      if (res.success && res.data) {
        
        cookieStore.set("Authorization", res.data.token);
        localStorage.setItem("User", JSON.stringify(res.data.user));

        console.log(res.data);
        setSuccess(true);
        setMessage(res.message);
        navigate("/");
      } else {
        setSuccess(false);
        setMessage(res.message);
      }
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
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
        <form
          onSubmit={handleSubmit}
          id="sign_up_side"
          className="fade-up w-full md:w-1/2 bg-(--color-bg-inverse) flex flex-col justify-center items-center     "
        >
          <div className=" h-fit w-fit  ">
            <h1
              className="  font-inter text-2xl sm:text-5xl md:text-5xl
            tracking-tight font-bold font-sans text-center mb-20
             leading-normal md:leading-[90px] 
              text-(--color-text-inverse)"
            >
              Sign In
              <FontAwesomeIcon
                className="mr-2 text-(--color-accent)"
                icon={faSignIn}
              />
            </h1>
            <h2
              className="  font-inter text-2xl sm:text-5xl md:text-xl
            tracking-tight font-bold font-sans pb-14
              text-(--color-text-inverse)"
            >
              Welcome back we are happy to have you again
            </h2>

            <div className="fade-up flex flex-col gap-10 mt-8">
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
            </div>

            <div className="text-white font-bold fade-up flex flex-row items-center justify-center w-full h-10  mt-10 bg-(--color-accent) rounded-xl  ">
              <button
                type="submit"
                disabled={loading}
                className="fade-up 
           SingUpBtn w-full h-full disabled:opacity-70"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
            <div className="fade-up flex gap-1 items-center justify-center mt-4 text-(--color-text-inverse)">
              Don't have an account?
              <Link className="text-blue-600 font-bold" to={"/sign-up"}>
                Sign Up
              </Link>
            </div>
          </div>
        </form>
        <div
          id="fill_up_side"
          className="fade-up hidden md:block svg  w-1/2 bg-(--color-bg) flex-col justify-center items-center p-24    "
        >
          <div className=" h-fit w-fit flex flex-col gap-5   ">
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
      </div>
    </>
  );
}

export default SignIn;
