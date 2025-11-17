import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_ROUTES from '../config/api';
import QuestionManagement from './QuestionManagement';
import UserReports from './UserReports'; 

const AdminPanel = () => {
  const { token } = useContext(AuthContext);
  const [showSection, setShowSection] = useState(() => {
    const storedView = localStorage.getItem('adminPanelView');
    return storedView || 'questionManagement'; 
  });

  useEffect(() => {
    localStorage.setItem('adminPanelView', showSection);
  }, [showSection]);

  const renderContent = () => {
    switch (showSection) {
      case 'questionManagement':
        return <QuestionManagement />;
      case 'userReports':
        return <UserReports />;
      default:
        return <QuestionManagement />;
    }
  };

  return (
    <div className='admin-panel-container'>
      <div className='admin-panel-header'>
        <h2>Admin Panel</h2>
        <div className='admin-btn-wrap'>
          <button onClick={() => setShowSection('questionManagement')}>Manage Questions</button>
          <button onClick={() => setShowSection('userReports')}>View User Reports</button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminPanel;
