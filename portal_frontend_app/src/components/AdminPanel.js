import React, { useState, useEffect, useContext } from 'react';
import QuestionManagement from './QuestionManagement';
import UserReports from './UserReports'; 
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [showQuestionManagement, setShowQuestionManagement] = useState(() => {
    const storedView = localStorage.getItem('adminPanelView');
    return storedView === 'userReports' ? false : true; 
  });

  const { user, role, logout } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem('adminPanelView', showQuestionManagement ? 'questionManagement' : 'userReports');
  }, [showQuestionManagement]);

  return (
    <div className='admin-panel-container'>
      

      <div className='admin-panel-header'>
      <h2>Admin Panel</h2>
      
      <div className='admin-btn-wrap'>
       <button onClick={() => setShowQuestionManagement(true)}>Manage Questions</button>
       <button onClick={() => setShowQuestionManagement(false)}>View User Reports</button>
     </div>
      </div>

      {showQuestionManagement ? (
        <QuestionManagement />
      ) : (
        <UserReports />
      )}
    </div>
  );
};

export default AdminPanel;
