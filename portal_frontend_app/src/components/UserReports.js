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
        const response = await axios.get(API_ROUTES.REPORTS.GET_ALL_USER_PERFORMANCE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserReports(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch user reports");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserReports();
  }, [token]);

  if (loading) return <div className="container">Loading user reports...</div>;
  if (error) return <div className="container" style={{ color: "red" }}>Error: {error}</div>;

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
              <th>Skill Performance</th>
            </tr>
          </thead>

          <tbody>
            {userReports.map((user) => {
              const perf = user.skillPerformance || [];

              const avgScore =
                perf.length > 0
                  ? (
                      perf.reduce((sum, s) => sum + parseFloat(s.averagePercentage), 0) /
                      perf.length
                    ).toFixed(2)
                  : "N/A";

              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{perf.length}</td>

                  <td>{avgScore}%</td>

                  <td>
                    {perf.length > 0 ? (
                      <ul className="skill-gaps-list">
                        {perf.map((skill, index) => (
                          <li key={index}>
                            {skill.skillName}:{" "}
                            <span className="skill-score">
                              {parseFloat(skill.averagePercentage).toFixed(2)}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No user reports available.</p>
      )}
    </div>
  );
};

export default UserReports;
