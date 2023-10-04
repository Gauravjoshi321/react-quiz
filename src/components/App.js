import { useEffect } from "react";

import Header from "./Header";
import Main from "./main";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Loader from "./Loader";
import Question from "./Question";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { useQuiz } from "../quizContext";

function App() {
  const { dispatch, status, questions, index } = useQuiz();

  useEffect(function () {

    fetch('http://localhost:9000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: "dataRecieved", payload: data }))
      .catch(err => dispatch({ type: 'dataFailed' }))

  }, [dispatch])

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "ready" && <StartScreen />}
        {status === "error" && <Error />}

        {status === "active"
          && <>
            <Progress />
            <Question question={questions[index]} />
            <Footer>
              <Timer />

              <NextQuestion />
            </Footer>
          </>
        }
        {status === "finish"
          && <FinishScreen />}

      </Main>
    </div>
  );
}

export default App;
