import CheckMark from "../../components/style_components/checkMark";
import Input from "../../components/navbar_components/input";
import { useState } from "react";
import {
  faEye,
  faEyeSlash,
  faUserPlus,
  faBriefcase,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../../API/RegisterAPI";

import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageToast from "../../utils/message";

interface SignupForm {
  first_name: string;
  last_name: string;
  Type: "client" | "business" | "";
  email: string;
  password: string;
  confirm_password: string;
  // Business-specific fields
  company_name: string;
  description: string;
  team_size: string;
  industry: string;
}

function SignUp() {
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState<SignupForm>({
    first_name: "",
    last_name: "",
    Type: "",
    email: "",
    password: "",
    confirm_password: "",
    company_name: "",
    description: "",
    team_size: "",
    industry: "",
  });

  const updateForm = (Field: keyof SignupForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [Field]: value,
    }));
  };

  const [IsHidden, setIsHidden] = useState(false);

  //API call
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setMessage(null);

    const payload: Parameters<typeof registerUser>[0] = {
      name: form.first_name + " " + form.last_name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirm_password,
      role: form.Type,
    };

    if (form.Type === "business") {
      payload.company_name = form.company_name;
      payload.description = form.description;
      payload.team_size = Number(form.team_size);
      payload.industry = form.industry;
    }

    const res = await registerUser(payload);

    if (res.success) {
      setSuccess(true);
      setMessage(res.message);
    } else {
      setSuccess(false);
      setMessage(res.message || "Registration failed. Please try again.");
    }

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
      <div className="flex flex-row h-screen w-full background-image">
        {/* Left decorative panel */}
        <div
          id="fill_up_side"
          className="fade-up hidden md:flex svg w-1/2 bg-(--color-bg) flex-col justify-center items-center p-24"
        >
          <div className="h-fit w-fit flex flex-col gap-5 svg-light">
            <div className="fade-up flex flex-row gap-1 h-fit">
              <p className="fade-up flex justify-center items-center h-10 w-10 bg-(--color-primary) text-amber-50 rounded-lg font-bold hover:scale-110 transition-transform duration-300">
                K
              </p>
              <div className="fade-up text-2xl font-bold text-(--color-primary) whitespace-nowrap">
                KarBazar
              </div>
            </div>
            <h1
              className="font-inter text-2xl sm:text-5xl md:text-7xl
            tracking-tight font-bold font-sans
            leading-normal md:leading-[90px]
            text-(--color-text)"
            >
              Start Your Online Service
            </h1>
            <h2
              className="font-inter text-2xl sm:text-5xl md:text-xl
            tracking-tight font-bold font-sans
            text-(--color-text)"
            >
              Join KarBazar and connect with clients Nation-wide. <br /> Turn
              your skills into income.
            </h2>
            <ul className="fade-up label-heading mt-10 flex flex-col gap-5">
              <li className="fade-up flex gap-1">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  Create your professional profile
                </p>
              </li>
              <li className="fade-up flex gap-1">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  Showcase your portfolio
                </p>
              </li>
              <li className="fade-up flex gap-1">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  Increase your income
                </p>
              </li>
              <li className="fade-up flex gap-1">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  Build your reputation
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right sign-up panel — scrollable */}
        <div
          id="sign_up_side"
          className="fade-up w-full md:w-1/2 bg-(--color-bg-inverse) flex flex-col items-center overflow-y-auto py-12 px-6"
        >
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <h1
              className="font-inter text-2xl sm:text-4xl
            tracking-tight font-bold font-sans
            leading-normal
            text-(--color-text-inverse)"
            >
              <FontAwesomeIcon
                className="mr-2 text-(--color-accent)"
                icon={faUserPlus}
              />
              Create your Account
            </h1>

            {/* Account type selector */}
            <div className="fade-up mt-8">
              <p className="text-(--color-text-inverse) opacity-70 text-sm mb-3 font-semibold">
                Select account type
              </p>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => updateForm("Type", "client")}
                  className={`animated font-bold text-base fade-up rounded-l-lg border w-1/2 p-3 flex justify-center items-center gap-2 cursor-pointer
                    ${
                      form.Type === "client"
                        ? "selected"
                        : "bg-(--color-surface) text-(--color-text) border-(--color-border)"
                    }`}
                >
                  <FontAwesomeIcon icon={faUser} />
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => updateForm("Type", "business")}
                  className={`animated font-bold text-base fade-up rounded-r-lg border w-1/2 p-3 flex justify-center items-center gap-2 cursor-pointer
                    ${
                      form.Type === "business"
                        ? "selected"
                        : "bg-(--color-surface) text-(--color-text) border-(--color-border)"
                    }`}
                >
                  <FontAwesomeIcon icon={faBriefcase} />
                  Business
                </button>
              </div>

              {/* Account type description */}
              {form.Type === "client" && (
                <p className="mt-2 text-sm text-(--color-text-inverse) opacity-60">
                  Hire talented freelancers and get your projects done.
                </p>
              )}
              {form.Type === "business" && (
                <p className="mt-2 text-sm text-(--color-text-inverse) opacity-60">
                  Post jobs, manage a team and grow your business.
                </p>
              )}
            </div>

            {/* Common fields */}
            <div className="fade-up flex flex-col gap-10 mt-10">
              <div className="fade-up flex flex-row gap-4">
                <Input
                  type="text"
                  onChange={(value) => updateForm("first_name", value)}
                  icon=""
                  label="First Name"
                  placeholder="Zhyar"
                  size="1/2"
                />
                <Input
                  type="text"
                  onChange={(value) => updateForm("last_name", value)}
                  icon=""
                  label="Last Name"
                  placeholder="Mohammad"
                  size="1/2"
                />
              </div>

              <Input
                type="text"
                onChange={(value) => updateForm("email", value)}
                icon=""
                label="Email Address"
                placeholder="Example@gmail.com"
                size="full"
              />

              <div className="relative">
                <Input
                  type={IsHidden ? "text" : "password"}
                  onChange={(value) => updateForm("password", value)}
                  icon=""
                  label="Password"
                  placeholder="d$bb*****"
                  size="full"
                />
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
                />
                <FontAwesomeIcon
                  onClick={() => setIsHidden((prev) => !prev)}
                  className="absolute top-1/3 hover:cursor-pointer right-2 text-(--color-text-inverse)"
                  icon={IsHidden ? faEye : faEyeSlash}
                />
              </div>
            </div>

            {/* Business-specific fields */}
            {form.Type === "business" && (
              <div className="fade-up flex flex-col gap-10 mt-10">
                <p className="text-(--color-text-inverse) font-semibold text-sm opacity-70 -mb-4">
                  Business Details
                </p>

                <Input
                  type="text"
                  onChange={(value) => updateForm("company_name", value)}
                  icon=""
                  label="Company Name"
                  placeholder="Acme Corp"
                  size="full"
                />

                <div
                  className={`flex flex-col align-baseline relative p-2 font-bold text-md pl-2 border border-(--color-border) w-full input-focus rounded-xl`}
                >
                  <label className="bg-transparent absolute -top-6 label text-(--color-text-inverse) opacity-80">
                    Description
                  </label>
                  <textarea
                    className="focus:outline-none placeholder-gray-400 text-(--color-text-inverse) resize-none bg-transparent"
                    placeholder="Tell us about your business..."
                    rows={3}
                    onChange={(e) => updateForm("description", e.target.value)}
                  />
                </div>

                <Input
                  type="number"
                  onChange={(value) => updateForm("team_size", value)}
                  icon=""
                  label="Team Size"
                  placeholder="10"
                  size="full"
                />

                <Input
                  type="text"
                  onChange={(value) => updateForm("industry", value)}
                  icon=""
                  label="Industry"
                  placeholder="Technology"
                  size="full"
                />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || form.Type === ""}
              className="animated fade-up w-full h-11 mt-10 bg-(--color-accent) text-white font-bold rounded-xl
                disabled:opacity-60 disabled:cursor-not-allowed
                hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating Account…
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="fade-up flex gap-1 items-center justify-center mt-4 text-(--color-text-inverse)">
              Already have an{" "}
              <Link className="text-blue-400 font-bold" to={"/sign-in"}>
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

