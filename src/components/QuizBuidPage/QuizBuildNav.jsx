
import React, { useEffect, useState } from "react";
// import Image from "next/image";
import useGlobalContextProvider from "../../ContextApi";
import { v4 as uuidv4 } from "uuid";
import { faCode } from "@fortawesome/free-solid-svg-icons";

import {Navigate}  from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import convertFromFaToText from "../../convertFromFaToText";
import { icon } from "@fortawesome/fontawesome-svg-core";

function validateQuizQuestions(quizQuestions) {
  for (let question of quizQuestions) {
    // Check if the main question is empty
    if (!question.mainQuestion.trim()) {
      return { valid: false, message: "Please fill in the main question." };
    }

    // Check if any choice is empty
    if (question.choices.some((choice) => !choice.trim().substring(2))) {
      return { valid: false, message: "Please fill in all choices." };
    }

    // Check if the correct answer is empty
    if (question.correctAnswer.length === 0) {
      return { valid: false, message: "Please specify the correct answer." };
    }
  }
  return { valid: true };
}

function QuizBuildNav({ newQuiz, setNewQuiz }) {
  const { allQuizzes, setAllQuizzes, selectedQuizObject } =
    useGlobalContextProvider();

  const { selectedQuiz, setSelectedQuiz } = selectedQuizObject;

  const [isLoading, setIsLoading] = useState(false);

   function createNewQuiz() {
      const textIcon = convertFromFaToText(newQuiz.icon);
      const quizWithTextIcon = {
        ...newQuiz,
        icon: textIcon,
      };
        localStorage.setItem(quizWithTextIcon); //adding quiz in local storage

      const { id } = localStorage.getItem(id);
      console.log(id);
      // Update the _id property of the newQuiz object
      const updatedQuiz = { ...newQuiz, xid: id, icon: textIcon };
      setAllQuizzes([...allQuizzes, updatedQuiz]);
      toast.success("The quiz has been created successfully!");
  }

   function saveQuiz() {
    if (newQuiz.quizTitle.trim(" ").length === 0) {
      return toast.error("Please add a name for the quiz!");
    }

    const isValid = validateQuizQuestions(newQuiz.quizQuestions);
    if (isValid.valid === false) {
      toast.error(isValid.message);
      return;
    }

    if (selectedQuiz) {
      setIsLoading(true);
      setAllQuizzes((prevQuizState)=>{
         const updatedQuiz = [...allQuizzes]; 
         const findIndexQuiz = updatedQuiz.findIndex(
           (quiz) => quiz.id === newQuiz.id
         );
           if (findIndexQuiz !== -1) {
             updatedQuiz[findIndexQuiz] = newQuiz;
           }
          
           return updatedQuiz;
      })
      // Assuming allQuizzes contains the current state of quizzes
      
        toast.success("The quiz has been saved successfully.");
        setIsLoading(false);
    }else{
      saveQuiz();
    }  
    Navigate('/')
  }
  console.log(newQuiz);

  return (
    <div className="poppins my-12 flex justify-between items-center ">
      <div className="flex gap-2 items-center">
        <image src="/quiz-builder-icon.png" alt="" height={50} width={50} />
        <span className="text-2xl">
          Quiz <span className="text-green-700 font-bold">Builder</span>
        </span>
      </div>
      <button
        onClick={() => {
          createNewQuiz();
        }}
        className="p-2 px-4 bg-green-700 rounded-md text-white"
      >
        {isLoading ? "Loading..." : "Save"}
      </button>
    </div>
  );
}

export default QuizBuildNav;
