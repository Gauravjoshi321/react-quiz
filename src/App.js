import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./main";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Loader from "./Loader";

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
    case "error": {
      return { ...state, status: 'error' }
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
      .catch(err => dispatch({ type: 'error' }))

  }, [])

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} />}
        {status === "error" && <Error />}
      </Main>
    </div>
  );
}

export default App;
