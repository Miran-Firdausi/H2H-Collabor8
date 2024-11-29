import { useState } from "react";
import { Link } from "react-router-dom";
import "./QuestionPage.css";

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const initialQuestions = [
  {
    id: 1,
    title: "Best practices for React state management",
    description:
      "I'm looking for efficient ways to manage state in a large React application.",
    author: "DevStudent",
    createdAt: new Date("2024-01-15T10:30:00"),
    tags: ["react", "state-management", "frontend"],
    answers: [
      {
        id: 1,
        text: "Consider using Redux or React Context for complex state management.",
        author: "SeniorDev",
        createdAt: new Date("2024-01-15T11:45:00"),
      },
      {
        id: 2,
        text: "For smaller projects, useReducer hook can be a great lightweight solution.",
        author: "ReactPro",
        createdAt: new Date("2024-01-16T09:20:00"),
      },
    ],
  },
  {
    id: 2,
    title: "Docker deployment best practices",
    description:
      "What are the most efficient ways to deploy a React application using Docker?",
    author: "CloudDev",
    createdAt: new Date("2024-01-14T15:45:00"),
    tags: ["docker", "deployment", "devops"],
    answers: [],
  },
];

const QuestionPage = () => {
  const questionId = parseInt(window.location.pathname.split("/").pop());
  const question = initialQuestions.find((q) => q.id === questionId);

  const [newAnswer, setNewAnswer] = useState("");

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    // In a real app, this would be an API call
    question.answers.push({
      id: question.answers.length + 1,
      text: newAnswer,
      author: "CurrentUser",
      createdAt: new Date(),
    });

    setNewAnswer("");
  };

  if (!question) {
    return <div className="pforum-error-page">Question not found</div>;
  }

  return (
    <div className="pforum-question-detail-page">
      <header className="pforum-page-header">
        <Link to="/discussion" className="pforum-back-link">
          ← Back to Questions
        </Link>
      </header>

      <div className="pforum-question-detail-container">
        <div className="pforum-question-detail-header">
          <h1 className="pforum-question-detail-title">{question.title}</h1>
          <div className="pforum-question-detail-meta">
            <span>
              Asked by {question.author} on {formatDate(question.createdAt)}
            </span>
          </div>
        </div>

        <div className="pforum-question-detail-body">
          <p>{question.description}</p>
        </div>

        <div className="pforum-question-tags">
          {question.tags.map((tag) => (
            <span key={tag} className="pforum-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="pforum-answers-section">
          <h2>{question.answers.length} Answers</h2>
          {question.answers.map((answer) => (
            <div key={answer.id} className="pforum-answer-item">
              <p className="pforum-answer-text">{answer.text}</p>
              <div className="pforum-answer-meta">
                <span>
                  Answered by {answer.author} on {formatDate(answer.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form className="pforum-answer-form" onSubmit={handleAnswerSubmit}>
          <h3>Your Answer</h3>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here"
            className="pforum-answer-textarea"
            required
          />
          <button type="submit" className="pforum-submit-answer-btn">
            Post Answer
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionPage;
