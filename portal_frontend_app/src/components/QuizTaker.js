import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; 
import { AuthContext } from '../context/AuthContext';
import API_ROUTES from '../config/api'; 

const QuizTaker = ({ skillId, onQuizComplete }) => {
  const { token } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_ROUTES.QUIZZES.START(skillId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuestions(response.data); 
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    if (skillId && token) {
      fetchQuestions();
    }
  }, [skillId, token]);

  const handleAnswerChange = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSubmitQuiz = async () => {
    try {
      const responses = Object.keys(selectedAnswers).map(questionId => ({
        question_id: parseInt(questionId),
        selected_option_id: selectedAnswers[questionId]
      }));

      const response = await axios.post(API_ROUTES.QUIZZES.SUBMIT_ATTEMPT, {
        skill_id: skillId,
        responses: responses
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setScore(response.data.score);
      setQuizSubmitted(true);
      if (onQuizComplete) {
        onQuizComplete(response.data.score);
        alert("Submit Quiz Successfully")
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit quiz');
    }
  };

  if (loading) {
    return <div className="container">Loading quiz questions...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div className="container">No questions available for this skill.</div>;
  }

  if (quizSubmitted) {
    return (
      <div className="container">
        <h3>Quiz Completed!</h3>
        <p>Your score: {score}</p>
        <button onClick={() => window.location.reload()}>Take another quiz</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isAnswerSelected = selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="">
      <h3>Quiz for Skill: {skillId}</h3>
      <div className="quiz-question-card">
        <h4>Question {currentQuestionIndex + 1} of {questions.length}</h4>
        <p className="question-text">{currentQuestion.text}</p>
        <div className="options-list">
          {currentQuestion.options.map((option) => (
            <div key={option.id} className="option-item">
              <input
                type="radio"
                id={`option-${option.id}`}
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={selectedAnswers[currentQuestion.id] === option.id}
                onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
              />
              <label htmlFor={`option-${option.id}`}>{option.text}</label>
            </div>
          ))}
        </div>
        <div className="quiz-navigation">
          <button onClick={handlePreviousQuestion} disabled={isFirstQuestion}>
            Previous
          </button>
          <button onClick={handleNextQuestion} disabled={isLastQuestion || !isAnswerSelected}>
            Next
          </button>
          {isLastQuestion && (
            <button onClick={handleSubmitQuiz} disabled={Object.keys(selectedAnswers).length < questions.length}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;
