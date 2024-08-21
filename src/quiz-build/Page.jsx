
import { useState, useEffect } from "react";
import QuizBuildNav from "../components/QuizBuidPage/QuizBuildNav";
import QuizBuildTitle from "../components/QuizBuidPage/QuizBuildTitle";
import QuizBuildQuestions from "../components/QuizBuidPage/QuizBuildQuestion";
import { v4 as uuidv4 } from "uuid";
// import { faCode } from "@fortawesome/free-solid-svg-icons";
// import { Toaster } from "react-hot-toast";
import IconsComponents from "../components/QuizBuidPage/IconsComponents";
import useGlobalContextProvider from "../ContextApi";

function Page() {
  const prefixes = ["A", "B", "C", "D"];
  const { selectedIconObject, selectedQuizObject } = useGlobalContextProvider();
  const { selectedIcon } = selectedIconObject;
  const { selectedQuiz } = selectedQuizObject;
  const [focusFirst, setFocusFirst] = useState(true);

  const [quizQuestions, setQuizQuestions] = useState(() => {
    if (selectedQuiz) {
      return selectedQuiz.quizQuestions;
    } else {
      return [
        {
          id: uuidv4(),
          mainQuestion: "",
          choices: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
          correctAnswer: "",
          answeredResult: -1,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
          },
        },
      ];
    }
  });

  const [newQuiz, setNewQuiz] = useState(() => {
    if (selectedQuiz) {
      return selectedQuiz;
    } else {
      return {
        id: uuidv4(),
        icon: selectedIcon.faIcon,
        quizTitle: "",
        quizQuestions: quizQuestions,
      };
    }
  });

  console.log(newQuiz);

  useEffect(() => {
    setNewQuiz((prevQuiz) => ({
      ...prevQuiz,
      icon: selectedIcon.faIcon,
      quizQuestions: quizQuestions,
    }));
  }, [quizQuestions, selectedIcon.faIcon]);

  function onChangeQuizTitle(text) {
    setNewQuiz((prevQuiz) => ({ ...prevQuiz, quizTitle: text }));
  }

  const quizNavBarProps = {
    quizQuestions,
    newQuiz,
    setNewQuiz,
  };

  const quizTitleProps = {
    focusProp: { focus: focusFirst, setFocusFirst },
    onChangeQuizTitle,
  };

  const quizQuestionsProps = {
    focusProp: { focus: !focusFirst, setFocusFirst },
    quizQuestions,
    setQuizQuestions,
  };

  return (
    <div className=" relative mx-16 poppins">
      <IconsComponents />
      <QuizBuildNav {...quizNavBarProps} />
      <QuizBuildTitle {...quizTitleProps} />
      <QuizBuildQuestions {...quizQuestionsProps} />
    </div>
  );
}

export default Page;
