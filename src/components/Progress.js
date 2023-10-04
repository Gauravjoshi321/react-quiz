import { useQuiz } from "../quizContext";

function Progress() {
  const { index, numQuestions, points, maxPoints, answer } = useQuiz();

  return (
    <header className="progress">
      <progress max={numQuestions} value={answer ? index + 1 : index} />

      <p>Question <strong>{index + 1}</strong> / {numQuestions}</p>
      <p>{points} / {maxPoints} </p>
    </header>
  )
}

export default Progress;