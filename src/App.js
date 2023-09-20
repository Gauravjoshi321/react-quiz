import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./main";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Loader from "./Loader";
import Question from "./Question";

const initialState = {
  questions: [],

  // loading, error, ready, active, finished
  status: 'loading'
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

    default: throw new Error("unknown action")
  }
}

function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

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
        {status === "dataFailed" && <Error />}
        {status === "active" && <Question />}
      </Main>
    </div>
  );
}

export default App;
