function FinishScreen({ points, maxPoints, highScore, dispatch }) {
  const percentage = (points / maxPoints) * 100;
  console.log(percentage);

  let emoji;

  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🤔";
  if (percentage >= 10 && percentage < 50) emoji = "☹️";
  if (percentage === 0) emoji = "😭";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of {maxPoints} ({Math.ceil(percentage)}%).
      </p>

      <p className="highscore">
        (Highscore: {highScore} points)
      </p>

      <button
        className="btn btn-ui"
        style={{ cursor: "pointer" }}
        onClick={() => dispatch({ type: "restart" })}
      >RESTART</button>
    </>
  )
}

export default FinishScreen;