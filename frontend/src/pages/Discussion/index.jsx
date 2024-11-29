import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatting";
import "./Discussion.css";

// Mock data (replace with API in real implementation)
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

// Question List Page
const Discussion = () => {
  const [questions] = useState(initialQuestions);

  return (
    <div className="pforum-question-list-page">
      <header className="pforum-page-header">
        <h1>Discussion Forum</h1>
        <input
          type="search"
          className="discussion-search-bar"
          placeholder="search for your question here..."
        />
      </header>

      <div className="pforum-question-list-container">
        {questions.map((question) => (
          <div key={question.id} className="pforum-question-list-item">
            <div className="pforum-question-list-content">
              <Link
                to={{
                  pathname: `/question/${question.id}`,
                  state: question,
                }}
                className="pforum-question-list-title"
              >
                {question.title}
              </Link>
              <p className="pforum-question-list-description">
                {question.description.slice(0, 150)}...
              </p>
            </div>
            <div className="pforum-question-list-meta">
              <div className="pforum-question-meta-details">
                <span className="pforum-meta-author">
                  Asked by {question.author}
                </span>
                <span className="pforum-meta-date">
                  {formatDate(question.createdAt)}
                </span>
                <span className="pforum-meta-answers">
                  {question.answers.length} Answers
                </span>
              </div>
              <div className="pforum-question-tags">
                {question.tags.map((tag) => (
                  <span key={tag} className="pforum-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussion;
