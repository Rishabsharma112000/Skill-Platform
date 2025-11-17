import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_ROUTES from '../config/api';
import QuestionManagement from './QuestionManagement';
import UserReports from './UserReports'; 
import AdminSkillGapReport from './AdminSkillGapReport';

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
      case 'skillGapReport':
        if (loadingUsers) return <div className="container mx-auto p-4">Loading users...</div>;
        if (usersError) return <div className="container mx-auto p-4 text-red-500">Error: {usersError}</div>;

        return (
          <div className="container mx-auto p-4">
            <h3 className="text-xl font-semibold mb-4">Select a User for Skill Gap Report</h3>
            <select onChange={handleSelectUser} value={selectedUserId || ''} className="p-2 border rounded shadow">
              <option value="" disabled>Select User</option>
              {users.map((userItem) => (
                <option key={userItem.id} value={userItem.id}>
                  {userItem.name} ({userItem.email})
                </option>
              ))}
            </select>

            {selectedUserId && <AdminSkillGapReport userId={selectedUserId} userName={selectedUserName} />}
          </div>
        );
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
          <button onClick={() => setShowSection('skillGapReport')}>View Skill Gap Reports</button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminPanel;
