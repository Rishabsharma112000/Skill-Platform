import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_ROUTES from '../config/api';

const PastPerformance = () => {
  const { token } = useContext(AuthContext);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastAttempts = async () => {
      try {
        const response = await axios.get(API_ROUTES.REPORTS.GET_MY_PERFORMANCE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAttempts(response.data); 
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch past attempts');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPastAttempts();
    }
  }, [token]);

  if (loading) {
    return <div>Loading past performance...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Past Performance</h3>
      {attempts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Average Score</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.skill_name}>
                <td>{attempt.skill_name}</td>
                <td>{parseFloat(attempt.average_percentage).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No past quiz attempts found.</p>
      )}
    </div>
  );
};

export default PastPerformance;
