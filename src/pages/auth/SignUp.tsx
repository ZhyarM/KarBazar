import CheckMark from "../../components/style_components/checkMark";
import Input from "../../components/navbar_components/input";
import { useState } from "react";
import {
  faEye,
  faEyeSlash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../../API/RegisterAPI";

import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageToast from "../../utils/message";
import { categoriesData } from "../../utils/CategoriesData";
import { useLanguage } from "../../context/LanguageContext.tsx";

type StepType = 1 | 2 | 3;

function SignUp() {
  const { t } = useLanguage();
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const businessCategories = categoriesData.map((category) => category.name);

  interface SignupForm {
    first_name: string;
    last_name: string;
    Type: "client" | "business";
    email: string;
    password: string;
    confirm_password: string;
    location?: string;
    budget_min?: string;
    budget_max?: string;
    company_name?: string;
    business_category?: string;
    hourly_rate?: string;
  }

  const [form, setForm] = useState<SignupForm>({
    first_name: "",
    last_name: "",
    Type: "client",
    email: "",
    password: "",
    confirm_password: "",
    location: "",
    budget_min: "",
    budget_max: "",
    company_name: "",
    business_category: "",
    hourly_rate: "",
  });

  const updateForm = (Field: keyof SignupForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [Field]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[Field]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[Field];
        return updated;
      });
    }
  };

  const [IsHidden, setIsHidden] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepType>(1);

  //API call
  const [loading, setLoading] = useState(false); // show saving spinner
  const [success, setSuccess] = useState<boolean | null>(null); // track success/error

  const goToNextStep = () => {
    if (currentStep === 1 && !form.Type) {
      setSuccess(false);
      setMessage(t("auth.validation.selectAccountType"));
      return;
    }
    if (currentStep === 2) {
      if (
        !form.first_name ||
        !form.last_name ||
        !form.email ||
        !form.password ||
        !form.confirm_password
      ) {
        setSuccess(false);
        setMessage(t("auth.validation.fillRequired"));
        return;
      }
      if (form.password !== form.confirm_password) {
        setSuccess(false);
        setMessage(t("auth.validation.passwordMismatch"));
        return;
      }
    }
    setCurrentStep((prev) => (prev + 1) as StepType);
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => (prev - 1) as StepType);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("creating user");
    e.preventDefault();

    if (form.Type === "client") {
      if (!form.location) {
        setSuccess(false);
        setMessage(t("auth.validation.enterLocation"));
        return;
      }
    } else if (form.Type === "business") {
      if (!form.company_name || !form.business_category || !form.hourly_rate) {
        setSuccess(false);
        setMessage(t("auth.validation.businessDetails"));
        return;
      }
    }

    setLoading(true);

    console.log(form);

    const res = await registerUser({
      name: form.first_name + " " + form.last_name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirm_password,
      role: form.Type,
      business_category: form.business_category,
    });

    if (res.success) {
      setSuccess(true);
      setMessage(res.message);
      setTimeout(() => {
        localStorage.setItem("auth_token", res.data?.token || "");
        localStorage.setItem("user", JSON.stringify(res.data?.user || {}));
        navigate("/");
      }, 1500);
    } else {
      setSuccess(false);
      setMessage(res.message || t("auth.validation.registrationFailed"));
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
              {t("auth.startOnlineService")}
            </h1>
            <h2
              className="  font-inter text-2xl sm:text-5xl md:text-xl
            tracking-tight font-bold font-sans
              text-(--color-text)"
            >
              {t("auth.joinKarBazar")}
            </h2>
            <ul className="fade-up label-heading mt-10 flex flex-col gap-5">
              <li className="fade-up flex  gap-1  ">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  {t("auth.benefit.profile")}
                </p>
              </li>
              <li className="fade-up flex  gap-1  ">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  {t("auth.benefit.portfolio")}
                </p>
              </li>
              <li className="fade-up flex  gap-1  ">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  {t("auth.benefit.income")}
                </p>
              </li>
              <li className="fade-up flex  gap-1  ">
                <CheckMark bg_color="bg-gray-400" mark_color="text-gray-200" />
                <p className="font-semibold text-lg fade-up flex flex-col self-center text-(--color-text)">
                  {t("auth.benefit.reputation")}
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
              {t("auth.signUpTitle")}
            </h1>

            {/* Progress Steps */}
            <div className="flex gap-2 mt-8 mb-8 justify-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 1
                    ? "bg-(--color-primary) text-white"
                    : "bg-(--color-surface) text-gray-400"
                }`}
              >
                1
              </div>
              <div
                className={`flex-1 h-1 self-center ${currentStep >= 2 ? "bg-(--color-primary)" : "bg-(--color-surface)"}`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 2
                    ? "bg-(--color-primary) text-white"
                    : "bg-(--color-surface) text-gray-400"
                }`}
              >
                2
              </div>
              <div
                className={`flex-1 h-1 self-center ${currentStep >= 3 ? "bg-(--color-primary)" : "bg-(--color-surface)"}`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 3
                    ? "bg-(--color-primary) text-white"
                    : "bg-(--color-surface) text-gray-400"
                }`}
              >
                3
              </div>
            </div>

            {/* STEP 1: Account Type Selection */}
            {currentStep === 1 && (
              <div className="fade-up">
                <h2 className="text-lg font-bold text-(--color-text-inverse) mb-4">
                  {t("auth.selectAccountType")}
                </h2>
                <div className="fade-up flex gap-4 mt-4">
                  <div
                    onClick={() => updateForm("Type", "client")}
                    className={`flex-1 p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      form.Type === "client"
                        ? "border-(--color-primary) bg-(--color-primary)/10"
                        : "border-(--color-border)/20 bg-transparent hover:bg-(--color-surface)/30"
                    }`}
                  >
                    <h3 className="font-bold text-(--color-text-inverse) text-center">
                      {t("auth.accountType.client")}
                    </h3>
                    <p className="text-sm text-(--color-text-inverse) text-center mt-2">
                      {t("auth.accountType.clientDesc")}
                    </p>
                  </div>
                  <div
                    onClick={() => updateForm("Type", "business")}
                    className={`flex-1 p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      form.Type === "business"
                        ? "border-(--color-primary) bg-(--color-primary)/10"
                        : "border-(--color-border)/20 bg-transparent hover:bg-(--color-surface)/30"
                    }`}
                  >
                    <h3 className="font-bold text-(--color-text-inverse) text-center">
                      {t("auth.accountType.business")}
                    </h3>
                    <p className="text-sm text-(--color-text-inverse) text-center mt-2">
                      {t("auth.accountType.businessDesc")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Personal & Login Info */}
            {currentStep === 2 && (
              <div className="fade-up">
                <h2 className="text-lg font-bold text-(--color-text-inverse) mb-4">
                  {t("auth.tellUsAboutYourself")}
                </h2>
                <div className="fade-up flex flex-col gap-10 mt-8">
                  <div className="fade-up flex flex-row gap-4">
                    <Input
                      type="text"
                      onChange={(value) => updateForm("first_name", value)}
                      value={form.first_name}
                      icon=""
                      label={t("auth.firstName")}
                      placeholder="John"
                      size="1/2"
                      error={fieldErrors.first_name}
                    />
                    <Input
                      type="text"
                      onChange={(value) => updateForm("last_name", value)}
                      value={form.last_name}
                      icon=""
                      label={t("auth.lastName")}
                      placeholder="Doe"
                      size="1/2"
                      error={fieldErrors.last_name}
                    />
                  </div>
                  <Input
                    type="email"
                    onChange={(value) => updateForm("email", value)}
                    value={form.email}
                    icon=""
                    label={t("auth.emailAddress")}
                    placeholder="john@example.com"
                    size="full"
                    error={fieldErrors.email}
                  />
                  <div className="relative">
                    <Input
                      type={IsHidden ? "text" : "password"}
                      onChange={(value) => updateForm("password", value)}
                      value={form.password}
                      icon=""
                      label={t("auth.password")}
                      placeholder="••••••••"
                      size="full"
                      error={fieldErrors.password}
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
                      onChange={(value) =>
                        updateForm("confirm_password", value)
                      }
                      value={form.confirm_password}
                      icon=""
                      label={t("auth.confirmPassword")}
                      placeholder="••••••••"
                      size="full"
                      error={fieldErrors.confirm_password}
                    />
                    <FontAwesomeIcon
                      onClick={() => setIsHidden((prev) => !prev)}
                      className="absolute top-1/3 hover:cursor-pointer right-2 text-(--color-text-inverse)"
                      icon={IsHidden ? faEye : faEyeSlash}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Type-Specific Details */}
            {currentStep === 3 && (
              <div className="fade-up">
                {form.Type === "client" && (
                  <>
                    <h2 className="text-lg font-bold text-(--color-text-inverse) mb-4">
                      {t("auth.whereLocated")}
                    </h2>
                    <div className="fade-up flex flex-col gap-10 mt-8">
                      <Input
                        type="text"
                        onChange={(value) => updateForm("location", value)}
                        value={form.location}
                        icon=""
                        label={t("auth.yourLocation")}
                        placeholder="City, Country"
                        size="full"
                        error={fieldErrors.location}
                      />
                      <div className="flex flex-row gap-4">
                        <Input
                          type="number"
                          onChange={(value) => updateForm("budget_min", value)}
                          value={form.budget_min}
                          icon=""
                          label={t("auth.minBudget")}
                          placeholder="100"
                          size="1/2"
                          error={fieldErrors.budget_min}
                          prefix="$"
                        />
                        <Input
                          type="number"
                          onChange={(value) => updateForm("budget_max", value)}
                          value={form.budget_max}
                          icon=""
                          label={t("auth.maxBudget")}
                          placeholder="10000"
                          size="1/2"
                          error={fieldErrors.budget_max}
                          prefix="$"
                        />
                      </div>
                    </div>
                  </>
                )}

                {form.Type === "business" && (
                  <>
                    <h2 className="text-lg font-bold text-(--color-text-inverse) mb-4">
                      {t("auth.businessDetails")}
                    </h2>
                    <div className="fade-up flex flex-col gap-10 mt-8">
                      <Input
                        type="text"
                        onChange={(value) => updateForm("company_name", value)}
                        value={form.company_name}
                        icon=""
                        label={t("auth.companyName")}
                        placeholder="Acme Corp"
                        size="full"
                        error={fieldErrors.company_name}
                      />
                      <div className="flex flex-col">
                        <div className="flex flex-col align-baseline relative p-2 font-bold text-md pl-2 border w-full input-focus rounded-xl transition-colors border-(--color-border)">
                          <label className="bg-transparent absolute -top-6 label text-(--color-text-inverse) opacity-80">
                            {t("auth.businessCategory")}
                          </label>
                          <select
                            className="focus:outline-none placeholder-gray-400 text-(--color-text-inverse) bg-transparent w-full"
                            value={form.business_category}
                            onChange={(e) =>
                              updateForm("business_category", e.target.value)
                            }
                          >
                            <option value="" className="text-black">
                              {t("auth.selectCategory")}
                            </option>
                            {businessCategories.map((category) => (
                              <option
                                key={category}
                                value={category}
                                className="text-black"
                              >
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                        {fieldErrors.business_category && (
                          <p className="text-red-500 text-sm mt-1 ml-2">
                            {fieldErrors.business_category}
                          </p>
                        )}
                      </div>
                      <Input
                        type="number"
                        onChange={(value) => updateForm("hourly_rate", value)}
                        value={form.hourly_rate}
                        icon=""
                        label={t("auth.hourlyRate")}
                        placeholder="75"
                        size="full"
                        error={fieldErrors.hourly_rate}
                        prefix="$"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="fade-up flex gap-3 mt-8 w-full">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="flex-1 py-2.5 px-4 bg-(--color-surface) text-(--color-text) font-bold rounded-lg hover:bg-opacity-80 transition-all"
                >
                  {t("auth.back")}
                </button>
              )}
              {currentStep < 3 && (
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-(--color-primary) text-white font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-70"
                >
                  {t("auth.next")}
                </button>
              )}
            </div>

            {currentStep === 3 && (
              <div className="fade-up flex flex-row items-center justify-center w-full h-10 mt-4 bg-(--color-accent) rounded-xl">
                <button
                  type="submit"
                  disabled={loading}
                  className="fade-up SingUpBtn w-full h-full disabled:opacity-70"
                >
                  {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
                </button>
              </div>
            )}
            <div className="fade-up flex gap-1 items-center justify-center mt-4 text-(--color-text-inverse)">
              {t("auth.alreadyHave")}
              <Link className="text-blue-600 font-bold" to={"/sign-in"}>
                {t("auth.account")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
