import UseGlobalContextProvider from "./ContextApi";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuizStart from "./quiz-start/Page";
import QuizBuild from "./quiz-build/Page";
import HomePage from "./Page"
// import Navbar from "./components/Navbar";

function App() {
  const {quizToStartObject} = UseGlobalContextProvider();
  const { setSelectQuizToStart } = quizToStartObject;
  
  useEffect(()=>{
    setSelectQuizToStart(null);
  },[])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/quiz-build" element={<QuizBuild/>} />
        <Route path="/quiz-start" element={<QuizStart />} />
      </Routes>
    </Router>
  );
}
export default App;