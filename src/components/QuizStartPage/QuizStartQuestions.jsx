
import  { useEffect, useState } from "react";
import useGlobalContextProvider from "../../ContextApi";
// import Image from "next/image";
import {  Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
// import convertFromFaToText from "@/app/convertFromFaToText";

function QuizStartQuestions({ onUpdateTime }) {
    console.log(typeof(onUpdateTime));
  const time = 20;
  const {
    quizToStartObject,
    allQuizzes,
    setAllQuizzes,
    userXpObject,
  } = useGlobalContextProvider();
  const { setUserXP } = userXpObject;
  const { selectQuizToStart } = quizToStartObject;
  const { quizQuestions } = selectQuizToStart;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [indexOfQuizSelected, setIndexOfQuizSelected] = useState(null);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [score, setScore] = useState(0);
  // const { user, setUser } = userObject;

  const [timer, setTimer] = useState(time);
  let interval;

  function startTimer() {
    clearInterval(interval);
    setTimer(time);

    interval = setInterval(() => {
      setTimer((currentTime) => {
        onUpdateTime(currentTime);
        if (currentTime === 0) {
          clearInterval(interval);
          return 0;
        }
        return currentTime - 1;
      });
    }, 1000);
  }


  console.log(indexOfQuizSelected);

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval);
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (timer === 0 && !isQuizEnded) {
      // Updating the allQuizzes
      const currentQuizzes = [...allQuizzes];
      currentQuizzes[indexOfQuizSelected].quizQuestions[
        currentQuestionIndex
      ].statistics.totalAttempts += 1;
      currentQuizzes[indexOfQuizSelected].quizQuestions[
        currentQuestionIndex
      ].statistics.incorrectAttempts += 1;

      setAllQuizzes(currentQuizzes);
      // --------------------
      if (currentQuestionIndex !== quizQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((current) => {
            return current + 1;
          });
        }, 1000);
      } else {
        setIsQuizEnded(true);
        clearInterval(interval);
      }
    }
  }, [timer]);

  // With the useEffect every time the component is loaded up
  //we need to get the index of the quiz we selected inside
  // the allquizzes array to update it when we choose tne answer
  
  
  useEffect(() => {
    const quizIndexFound = allQuizzes.findIndex(
      (quiz) => quiz.id === selectQuizToStart.id
    );
    setIndexOfQuizSelected(quizIndexFound);
  }, []);

  useEffect(() => {
    if (isQuizEnded) {
      // renitialize all answers to -1
      quizQuestions.forEach((quizQuestion) => {
        quizQuestion.answeredResult = -1;
      });
        console.log('quiz has ended ...');
    }
  }, [isQuizEnded]);

  function selectChoiceFunction(choiceIndexClicked) {
    // update the selectedChoice variable state
    setSelectedChoice(choiceIndexClicked);
    //---------------------------------------

    //We update the answerResult proprety in the allQuizzes array
    const currentAllQuizzes = [...allQuizzes];

    currentAllQuizzes[indexOfQuizSelected].quizQuestions[
      currentQuestionIndex
    ].answeredResult = choiceIndexClicked;

    setAllQuizzes(currentAllQuizzes);
    //------------------------------------
  }

  function moveToTheNextQuestion() {
    // Check if the we did select the an answer by using the answerResult proprety if
    //it's still equal to -1
    if (
      allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
        .answeredResult === -1
    ) {
      toast.error("please select an answer");
      return;
    }

    // Update the statistics of the question
    // ======================================
    // update the total Attemptes:
    allQuizzes[indexOfQuizSelected].quizQuestions[
      currentQuestionIndex
    ].statistics.totalAttempts += 1;

    // if the answer is incorrect
    if (
      allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
        .answeredResult !==
      allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
        .correctAnswer
    ) {
      // update the incorrect attemptes
      allQuizzes[indexOfQuizSelected].quizQuestions[
        currentQuestionIndex
      ].statistics.incorrectAttempts += 1;
      toast.error("Incorrect Answer!");

      // if the answer is incorrect, go to the next question only
      // if we are not at the last question
      if (currentQuestionIndex != quizQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((current) => current + 1);
          // initialize the choice after going to the next question
          setSelectedChoice(null);
        }, 1200);
      } else {
        // if we select the wrong choice and we are at the end of the question
        // end the quiz
        setTimer(0);
        clearInterval(interval);
        setIsQuizEnded(true);
      }

      return;
    }

    // update the correct attemptes
    allQuizzes[indexOfQuizSelected].quizQuestions[
      currentQuestionIndex
    ].statistics.correctAttempts += 1;
    // Increment the score by 1
    setScore((prevState) => prevState + 1);

    toast.success("Awesome!");
    setUserXP((prevState) => prevState+1);

    // This will stop the timer and end the quiz when currentQuestionIndex is the last
    // and only if we select the correct otherwise the timer is still running
    if (
      currentQuestionIndex === quizQuestions.length - 1 &&
      allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
        .answeredResult ===
        allQuizzes[indexOfQuizSelected].quizQuestions[currentQuestionIndex]
          .correctAnswer
    ) {
      setTimer(0);
      clearInterval(interval);
      setIsQuizEnded(true);
      return;
    }

    // increment the currentQuestionIndex by 1 to go to the next question
    setTimeout(() => {
      setCurrentQuestionIndex((current) => current + 1);
      // initialize the choice after going to the next question
      setSelectedChoice(null);
    }, 2000);
  }


  return (
    <div className="relative poppins rounded-sm m-9 w-9/12  ">
      <Toaster
        toastOptions={{
          // Define default options
          className: "",
          duration: 1500,
          style: {
            padding: "12px",
          },
        }}
      />
      {/* The Question Part */}
      <div className="flex   items-center gap-2">
        <div className="bg-green-700 flex  justify-center items-center rounded-md w-11 h-11 text-white p-3">
          {currentQuestionIndex + 1}
        </div>
        <p>{quizQuestions[currentQuestionIndex].mainQuestion}</p>
      </div>
      {/* The Answers Part */}
      <div className="mt-7 flex flex-col gap-2">
        {quizQuestions[currentQuestionIndex].choices.map(
          (choice, indexChoice) => (
            <div
              key={indexChoice}
              onClick={() => {
                selectChoiceFunction(indexChoice);
              }}
              className={`p-3 ml-11 w-10/12 border border-green-700 rounded-md
               hover:bg-green-700 hover:text-white transition-all select-none ${
                 selectedChoice === indexChoice
                   ? "bg-green-700 text-white"
                   : "bg-white"
               }`}
            >
              {choice}
            </div>
          )
        )}
      </div>
      {/* Submit Button */}
      <div className="flex justify-end mt-7  ">
        <button
          onClick={() => {
            moveToTheNextQuestion();
          }}
          disabled={isQuizEnded ? true : false}
          className={`p-2 px-5 text-[15px] text-white rounded-md bg-green-700 mr-[70px] ${
            isQuizEnded ? "opacity-60" : "opacity-100"
          }`}
        >
          Submit
        </button>
      </div>
      {isQuizEnded && (
        <ScoreComponent
          quizStartParentProps={{
            setIsQuizEnded,
            setIndexOfQuizSelected,
            setCurrentQuestionIndex,
            setSelectedChoice,
            score,
            setScore,
          }}
        />
      )}
    </div>
  );
}

export default QuizStartQuestions;

function ScoreComponent({ quizStartParentProps }) {
  const { quizToStartObject, allQuizzes } = useGlobalContextProvider();
  const { selectQuizToStart } = quizToStartObject;
  const numberOfQuestions = selectQuizToStart.quizQuestions.length;
  const {
    setIsQuizEnded,
    setIndexOfQuizSelected,
    setCurrentQuestionIndex,
    setSelectedChoice,
    setScore,
    score,
  } = quizStartParentProps;

  function emojiIconScore() {
    const emojiFaces = [
      "confused-emoji.png",
      "happy-emoji.png",
      "very-happy-emoji.png",
    ];
    const result = (score / selectQuizToStart.quizQuestions.length) * 100;

    if (result < 25) {
      return emojiFaces[0];
    }

    if (result == 50) {
      return emojiFaces[1];
    }

    return emojiFaces[2];
  }

  console.log(emojiIconScore());

  function tryAgainFunction() {
    setIsQuizEnded(false);
    const newQuizIndex = allQuizzes.findIndex(
      (quiz) => quiz.id === selectQuizToStart.id
    );
    console.log(newQuizIndex);
    setIndexOfQuizSelected(newQuizIndex);
    setCurrentQuestionIndex(0);
    setSelectedChoice(null);
    setScore(0);
    console.log(selectQuizToStart);
  }

  return (
    <div className=" flex items-center justify-center rounded-md top-[-100px] border border-gray-200 absolute w-full h-[450px] bg-white">
      {/* Score */}
      <div className=" flex gap-4 items-center justify-center flex-col">
        {/* <Image src={`/${emojiIconScore()}`} alt="" width={100} height={100} /> */}
        <div className="flex gap-1 flex-col">
          <span className="font-bold text-2xl">Your Score</span>
          <div className="text-[22px] text-center">
            {score}/{numberOfQuestions}
          </div>
        </div>
        <button
          onClick={() => tryAgainFunction()}
          className="p-2 bg-green-700 rounded-md text-white px-6"
        >
          Try Again
        </button>
        {/* statistics */}
        <div className="  w-full flex gap-2 flex-col mt-3">
          <div className="flex gap-1 items-center justify-center">
            {/* <Image src="/correct-answer.png" alt="" width={20} height={20} /> */}
            <span className="text-[14px]">Correct Answers: {score}</span>
          </div>
          <div className="flex gap-1 items-center justify-center">
            {/* <Image src="/incorrect-answer.png" alt="" width={20} height={20} /> */}
            <span className="text-[14px]">
              Incorrect Answers:
              {selectQuizToStart.quizQuestions.length - score}
            </span>
          </div>
        </div>
        {/* <span>Or</span> */}
        <span
          onClick={() => {
            Navigate("/");
          }}
          className="text-green-700 select-none cursor-pointer text-sm mt-8 "
        >
          Select Another Quiz
        </span>
      </div>
    </div>
  );
}
