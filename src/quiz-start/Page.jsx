

import  { useEffect, useState } from "react";
import useGlobalContextProvider from "../ContextApi";
import QuizStartHeader from "../components/QuizStartPage/QuizStartHeader";
import QuizStartQuestions from "../components/QuizStartPage/QuizStartQuestions";
import { Navigate } from "react-router-dom";
 

function Page() {
  const { quizToStartObject} = useGlobalContextProvider();
 
  const { selectQuizToStart } = quizToStartObject;
  const [parentTimer, setParentTimer] = useState(0);

  useEffect(() => {
    if (selectQuizToStart === null) {
       Navigate("/");
    }
  }, []);

  function OnUpdateTime(currentTime) {
    setParentTimer(currentTime);
  }
   console.log( 'print the type of' + typeof(handleTime));
  return (
    <div className="relative poppins flex flex-col px-24 mt-[35px] ">
      {selectQuizToStart === null ? (
        <div className="  h-svh flex flex-col gap-2 items-center justify-center">
          <image src="/errorIcon.png" alt="" width={180} height={180} />
          <h2 className="text-xl font-bold">
            Please Select your quiz first...
          </h2>
          <span className="font-light">
            You will be redirected to the home page
          </span>
        </div>
      ) : (
        <>
          <QuizStartHeader parentTimer={parentTimer} />
          <div className="mt-10 flex items-center justify-center">
            <QuizStartQuestions OnUpdateTime={OnUpdateTime} />
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
