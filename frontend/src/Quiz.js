import { useState, useEffect, useCallback } from "react";
import { getQuestions, submitQuiz } from "./api";

function Quiz({ setQuizStarted }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [started, setStarted] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user") || "null");

  const loadQuestions = async () => {
    try {
      const data = await getQuestions();

      setQuestions(data);
      setStarted(true);
      setQuizStarted(true);
    } catch (err) {
      alert("Failed to load questions");
      console.error(err);
    }
  };

  const handleSelect = (qId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  const submitTest = useCallback(async () => {
    try {
      const data = await submitQuiz({
        answers,
        user_id: userData.id,
      });

      if (data.message) {
        alert(data.message);
      } else {
        setScore(data.score);
      }

      // 🔥 reset states
      setStarted(false);
      setQuizStarted(false);

    } catch (err) {
      alert("Submission failed");
      console.error(err);
    }
  }, [answers, userData, setQuizStarted]);

  useEffect(() => {
    if (!started) return;

    const handleTabSwitch = () => {
      if (document.hidden) {
        alert("Tab switched! Submitting test...");
        submitTest();
      }
    };

    document.addEventListener("visibilitychange", handleTabSwitch);

    return () => {
      document.removeEventListener("visibilitychange", handleTabSwitch);
    };
  }, [submitTest, started]);

  // 🚫 Block if not logged in
  if (!userData) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Please login first</h3>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz</h2>

      <p>Welcome, <b>{userData.username}</b></p>

      {!started && (
        <button onClick={loadQuestions}>Start Quiz</button>
      )}

      {started && questions.map((q) => (
        <div key={q.id} className="card">
          <p><b>{q.question}</b></p>

          {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                onChange={() => handleSelect(q.id, opt)}
              />
              {" "}{opt}
              <br />
            </label>
          ))}
        </div>
      ))}

      {started && questions.length > 0 && (
        <button onClick={submitTest}>Submit</button>
      )}

      {score !== null && !started && (
        <div className="score">Your Score: {score}</div>
      )}
    </div>
  );
}

export default Quiz;