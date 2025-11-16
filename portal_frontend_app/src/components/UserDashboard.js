import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import QuizTaker from './QuizTaker';
import PastPerformance from './PastPerformance';
import API_ROUTES from '../config/api';
import SkillGapReport from './SkillGapReport';

const UserDashboard = () => {
  const { token } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showPastPerformance, setShowPastPerformance] = useState(false);
  const [showSkillGapReport, setShowSkillGapReport] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(API_ROUTES.SKILLS.GET_WITH_QUESTIONS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSkills(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSkills();
    }
  }, [token]);

  const handleStartQuiz = (skillId) => {
    setSelectedSkillId(skillId);
    setQuizStarted(true);
    setShowPastPerformance(false);
    setShowSkillGapReport(false);
  };

  const handleQuizComplete = (score) => {
    console.log('Quiz completed with score:', score);
    setQuizStarted(false);
  };

  const handleShowPastPerformance = () => {
    setShowPastPerformance(true);
    setQuizStarted(false);
    setShowSkillGapReport(false); 
  };

  const handleShowSkills = () => {
    setShowPastPerformance(false);
    setQuizStarted(false);
    setShowSkillGapReport(false);
  };

  const handleShowSkillGapReport = () => {
    setShowSkillGapReport(true);
    setShowPastPerformance(false);
    setQuizStarted(false);
  };

  if (loading) {
    return <div className="container">Loading skills...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <>
    <div className='admin-panel-container'>
    <div className='admin-panel-header'>
    <h2>User Dashboard</h2>
      <div  className='admin-btn-wrap' style={{ marginBottom: '1rem' }}>
        <button 
          onClick={handleShowSkills} 
          style={{ marginRight: '0.5rem' }} 
          className={!showPastPerformance && !quizStarted ? 'active-button' : ''}
        >
          Take Quiz
        </button>
        <button 
          onClick={handleShowPastPerformance} 
          className={showPastPerformance ? 'active-button' : ''}
        >
          View Past Performance
        </button>
        <button 
          onClick={handleShowSkillGapReport}
          className={showSkillGapReport ? 'active-button' : ''}
        >
          View Skill Gap Report
        </button>
      </div>
      </div>
    <div className="container">
      

      {showSkillGapReport ? (
        <SkillGapReport /> 
      ) : showPastPerformance ? (
        <PastPerformance /> 
      ) : quizStarted ? (
        <QuizTaker skillId={selectedSkillId} onQuizComplete={handleQuizComplete} />
      ) : (
        <>
          <h3>Available Skills</h3>
          {skills.length > 0 ? (
            <ul className='skilsUL'>
              {skills.map((skill) => (
                <li key={skill.id}>
                  {skill.name}{' '}
                  <button onClick={() => handleStartQuiz(skill.id)}>Take Quiz</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No skills available.</p>
          )}
        </>
      )}
    </div>
    </div>
    </>
  );
};

export default UserDashboard;
