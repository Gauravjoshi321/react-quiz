import { createContext, useContext, useReducer } from "react";

const QuizContext = createContext();

const SEC_PER_QUESTION = 20;

const initialState = {
  questions: [],

  // loading, error, ready, active, finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null
};

const reducer = function (state, action) {
  switch (action.type) {
    case "dataRecieved": {
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
        secondsRemaining: state.questions.length * SEC_PER_QUESTION
      }
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
    case "tick": {
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining < 1 ? "finish" : state.status
      }
    }

    default: throw new Error("unknown action")
  }
}

function QuizProvider({ children }) {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highScore,
      secondsRemaining
    }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => {
    return prev + cur.points
  }, 0)

  return (
    <QuizContext.Provider value={{
      questions,
      status,
      index,
      answer,
      points,
      highScore,
      secondsRemaining,
      dispatch,
      numQuestions,
      maxPoints,

    }}>
      {children}
    </QuizContext.Provider>
  )
}

function useQuiz() {
  const context = useContext(QuizContext);

  if (context === undefined) throw new Error("Context used outside the Provider");

  return context;
}

export { QuizProvider, useQuiz };