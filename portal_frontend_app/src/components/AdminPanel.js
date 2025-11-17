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
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    localStorage.setItem('adminPanelView', showSection);
  }, [showSection]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (showSection === 'skillGapReport' && !users.length) {
        try {
          setLoadingUsers(true);
          setUsersError(null);
          const response = await axios.get(API_ROUTES.USERS.GET_ALL, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(response.data.users);
        } catch (err) {
          setUsersError(err.response?.data?.message || err.message || 'Failed to fetch users');
        } finally {
          setLoadingUsers(false);
        }
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token, showSection, users.length]);

  const handleSelectUser = (e) => {
    const userId = e.target.value;
    const userName = e.target.options[e.target.selectedIndex].text.split(' (')[0];
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

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
