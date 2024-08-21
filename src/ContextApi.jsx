
import { createContext, useContext, useEffect, useState } from "react";
import { quizzesData } from "./QuizzData";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
 
const GlobalContext = createContext();

export function ContextProvider({ children }) {
  const defaultUser ={
    id:1,
    name:'quizUser',
    isLogged: true,
    experience:1,
  }
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectQuizToStart, setSelectQuizToStart] = useState(null);
  const [user, setUser] = useState({});
  const [openIconBox, setOpenIconBox] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState({ faIcon: faQuestion });

  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [threeDotsPositions, setThreeDotsPositions] = useState({ x: 0, y: 0 });
  
  const [userXP, setUserXP] = useState(()=>{
    const saveUserData = localStorage.getItem('user');
    return saveUserData ? JSON.parse(saveUserData).experience : 0;
  });

  useEffect(()=>{
    localStorage.setItem('user', JSON.stringify(user));
   },[user]);
   
  useEffect (()=>{
      if(typeof window !== 'undefined'){
        const saveUserData = localStorage.getItem('user');
        console.log(saveUserData);
        if(saveUserData){
          const userData = JSON.parse(saveUserData);
          console.log(userData)
          setUser({
            ...userData,
            isLogged: true, // ensure islogged ramains true
          });
          setUserXP(userData.experience);
        }else {
          setUser(defaultUser);// set default user if no user data found 
          setUserXP(defaultUser.experience); //ser default expericence
        }
      }
  }, [])
  useEffect(() => {
    setAllQuizzes(quizzesData);
  }, []);

  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      experience: userXP,
    }));
  }, [userXP]);

  useEffect(() => {
    if (selectedQuiz) {
      setSelectedIcon({ faIcon: selectedQuiz.icon });
    } else {
      setSelectedIcon({ faIcon: faQuestion });
    }
  }, [selectedQuiz]);

  return (
    <GlobalContext.Provider
      value={{
        allQuizzes,
        setAllQuizzes,
        quizToStartObject: { selectQuizToStart, setSelectQuizToStart },
        userObject: { user, setUser },
        openBoxToggle: { openIconBox, setOpenIconBox },
        selectedIconObject: { selectedIcon, setSelectedIcon },
        dropDownToggleObject: { dropDownToggle, setDropDownToggle },
        threeDotsPositionsObject: { threeDotsPositions, setThreeDotsPositions },
        selectedQuizObject: { selectedQuiz, setSelectedQuiz },
        userXpObject: { userXP, setUserXP },
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default function UseGlobalContextProvider() {
  return useContext(GlobalContext);
}
