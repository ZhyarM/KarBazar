import CheckMark from "../../components/style_components/checkMark";


function SignUp() {
  return (
    <div className="flex flex-row w-full m-auto max-w-[1400px] ">
      <div id="sign_up_side" className=" to-0% w-1/2 p-16 ">
        <h1 className="page-title gradient-text  text-transparent">Start Your Freelance Journey</h1>
        <h2 className="small-title mt-8 ">
          Join KarBazar and connect with clients worldwide. Turn your skills
          into income.
        </h2>
        <ul className="small-title mt-8">
          <li className="flex  gap-1  ">
            <CheckMark />
            <p className="flex flex-col self-center">
              create your professional profile
            </p>
          </li>
          <li className="flex  gap-1  ">
            <CheckMark />
            <p className="flex flex-col self-center">showcase your protfolio</p>
          </li>
          <li className="flex  gap-1  ">
            <CheckMark />
            <p className="flex flex-col self-center">Increae your income</p>
          </li>
          <li className="flex  gap-1  ">
            <CheckMark />
            <p className="flex flex-col self-center">Build your reputation</p>
          </li>
          
        </ul>
      </div>
      <div id="sign_up_side" className="background to-0% w-1/2 p-8">
        
        
      </div>
    </div>
  );
}

export default SignUp;
