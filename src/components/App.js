import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./main";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Loader from "./Loader";
import Question from "./Question";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],

  // loading, error, ready, active, finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
};

const reducer = function (state, action) {
  switch (action.type) {
    case "dataRecieved": {
      return { ...state, questions: action.payload, status: 'ready' }
    }
    case "dataFailed": {
      return { ...state, status: 'error' }
    }
    case "start": {
      return { ...state, status: 'active' }
    }
    case "newAnswer": {
      const question = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? question.points + state.points : state.points,
      }
    }
    case "nextQuestion": {
      return {
        ...state,
        index: state.index + 1,
        answer: null
      }
    }
    case "finishQuiz": {
      return {
        ...state,
        answer: null,
        status: "finish",
        highScore: state.highScore > state.points ? state.highScore : state.points
      }
    }
    case "restart": {
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
        restart: true
      }
    }

    default: throw new Error("unknown action")
  }
}

function App() {
  const [{ questions, status, index, answer, points, highScore, restart }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => {
    return prev + cur.points
  }, 0)

  useEffect(function () {

    fetch('http://localhost:9000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: "dataRecieved", payload: data }))
      .catch(err => dispatch({ type: 'dataFailed' }))

  }, [])

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "ready" && <StartScreen
          numQuestions={numQuestions}
          dispatch={dispatch}
        />}
        {status === "error" && <Error />}

        {status === "active"
          && <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextQuestion
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        }
        {status === "finish"
          && <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
            restart={restart}
          />}

      </Main>
    </div>
  );
}

export default App;
