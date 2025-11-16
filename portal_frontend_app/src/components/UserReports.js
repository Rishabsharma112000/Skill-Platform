import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; 
import { AuthContext } from '../context/AuthContext';
import API_ROUTES from '../config/api';

const UserReports = () => {
  const { token } = useContext(AuthContext);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const usersResponse = await axios.get(API_ROUTES.USERS.GET_ALL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const users = usersResponse.data.data;

        const reportsPromises = users.map(async (user) => {
          try {
            const performanceResponse = await axios.get(API_ROUTES.REPORTS.GET_USER_PERFORMANCE(user.id), {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            return { ...user, performance: performanceResponse.data };
          } catch (perfError) {
            console.error(`Failed to fetch performance for user ${user.id}:`, perfError);
            return { ...user, performance: { skillGaps: {} } };
          }
        });

        const reports = await Promise.all(reportsPromises);
        setUserReports(reports);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch user reports');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserReports();
    }
  }, [token]);

  if (loading) {
    return <div className="container">Loading user reports...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h3>User Performance Reports</h3>
      {userReports.length > 0 ? (
        <table className="reports-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Quizzes Taken (Skills)</th>
              <th>Overall Average Score</th>
              <th>Skill Performance (Average Score per Skill)</th>
            </tr>
          </thead>
          <tbody>
            {userReports.map((report) => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.performance ? report.performance.length : 0}</td>
                <td>
                  {report.performance && report.performance.length > 0
                    ? (report.performance.reduce((sum, skill) => sum + parseFloat(skill.average_percentage), 0) / report.performance.length).toFixed(2)
                    : 'N/A'}
                </td>
                <td>
                  {report.performance && report.performance.length > 0 ? (
                    <ul className="skill-gaps-list">
                      {report.performance.map((skill) => (
                        <li key={skill.skill_name}>{skill.skill_name}: <span className="skill-score">{parseFloat(skill.average_percentage).toFixed(2)}%</span></li>
                      ))}
                    </ul>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No user reports available.</p>
      )}

    </div>
  );
};

export default UserReports;
