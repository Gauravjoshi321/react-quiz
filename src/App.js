import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./main";

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
      return { ...state, questions: [], status: 'error' }
    }

    default: throw new Error("unknown action")
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status } = state;

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
        <p>1/15</p>
        <p>Questions?</p>
      </Main>
    </div>
  );
}

export default App;
