import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; 
import { AuthContext } from '../context/AuthContext';
import API_ROUTES from '../config/api';

const QuestionManagement = () => {
  const { token } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const questionsResponse = await axios.get(API_ROUTES.QUESTIONS.GET_ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions(questionsResponse.data);

      const skillsResponse = await axios.get(API_ROUTES.SKILLS.GET_ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkills(skillsResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await axios.post(API_ROUTES.QUESTIONS.CREATE, {
        questionText,
        options: options.map((opt, idx) => ({ text: opt, isCorrect: idx === correctOptionIndex })),
        skillId: selectedSkill,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectOptionIndex(0);
      setSelectedSkill('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add question');
    }
  };

  const handleEditQuestion = (question) => {
    setIsEditing(true);
    setCurrentQuestion(question);
    setQuestionText(question.text);
    setOptions(question.options.map(opt => opt.text));
    setCorrectOptionIndex(question.options.findIndex(opt => opt.isCorrect));
    setSelectedSkill(question.skill_id);
  };

  const handleUpdateQuestion = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await axios.put(API_ROUTES.QUESTIONS.UPDATE_BY_ID(currentQuestion.id), {
        questionText,
        options: options.map((opt, idx) => ({ text: opt, isCorrect: idx === correctOptionIndex })),
        skillId: selectedSkill,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditing(false);
      setCurrentQuestion(null);
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectOptionIndex(0);
      setSelectedSkill('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    setError(null);
    try {
      const response = await axios.delete(API_ROUTES.QUESTIONS.DELETE_BY_ID(questionId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete question');
    }
  };

  if (loading) {
    return <div className="container">Loading questions and skills...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h3>{isEditing ? 'Edit Question' : 'Add New Question'}</h3>
      <form onSubmit={isEditing ? handleUpdateQuestion : handleAddQuestion}>
        <div className="form-group">
          <label htmlFor="questionText">Question Text:</label>
          <textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            rows="4"
          />
        </div>
        <div className="form-group">
          <label htmlFor="skill">Skill Category:</label>
          <select
            id="skill"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            required
          >
            <option value="">Select a skill</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>
        <h4>Options:</h4>
        {options.map((option, index) => (
          <div key={index} className="form-group-inline">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            <label>
              <input
                type="radio"
                name="correctOption"
                checked={correctOptionIndex === index}
                onChange={() => setCorrectOptionIndex(index)}
              /> Correct
            </label>
          </div>
        ))}
        <div className="form-actions">
          <button type="submit">{isEditing ? 'Update Question' : 'Add Question'}</button>
          {isEditing && <button type="button" onClick={() => setIsEditing(false)}>Cancel Edit</button>}
        </div>
      </form>

      <h3>Existing Questions</h3>
      {questions.length > 0 ? (
        <ul className="question-list">
          {questions.map((question) => (
            <li key={question.id} className="question-item">
              <div className="question-details">
                <p><strong>Question:</strong> {question.text}</p>
                <p><strong>Skill:</strong> {question.skill_name}</p>
                <div className="options-display">
                  {question.options.map((option) => (
                    <span 
                      key={option.id} 
                      className={`option-display ${option.isCorrect ? 'correct-option' : ''}`}
                    >
                      {option.text}
                    </span>
                  ))}
                </div>
              </div>
              <div className="question-actions">
                <button onClick={() => handleEditQuestion(question)}>Edit</button>
                <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions found.</p>
      )}
    </div>
  );
};

export default QuestionManagement;
