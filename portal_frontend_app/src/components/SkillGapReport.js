import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_ROUTES from '../config/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SkillGapReport = () => {
  const { token, user } = useContext(AuthContext);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const threshold = 70;

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!token || !user?.id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(API_ROUTES.REPORTS.GET_MY_PERFORMANCE, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const arr = response.data.skillPerformance || [];

        setPerformanceData(
          arr.map(item => ({
            skillId: item.skill_id || null,
            skillName: item.skill_name,
            averageScore: parseFloat(item.average_percentage)
          }))
        );

      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [token, user]);

  if (loading) return <div className="container mx-auto p-4">Loading skill performance...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;

  const skillGaps = performanceData.filter(skill => skill.averageScore < threshold);
  const strongSkills = performanceData.filter(skill => skill.averageScore >= threshold);

  const chartData = {
    labels: performanceData.map(skill => skill.skillName),
    datasets: [
      {
        label: 'Average Score (%)',
        data: performanceData.map(skill => skill.averageScore),
  
        // ⭐ Dynamic color: green if >=70 else red
        backgroundColor: performanceData.map(skill =>
          skill.averageScore >= threshold
            ? 'rgba(34, 197, 94, 0.6)'   // green
            : 'rgba(239, 68, 68, 0.6)'   // red
        ),
  
        borderColor: performanceData.map(skill =>
          skill.averageScore >= threshold
            ? 'rgba(34, 197, 94, 1)'     // green
            : 'rgba(239, 68, 68, 1)'     // red
        ),
  
        borderWidth: 1,
      },
    ],
  };
  

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Skill Performance Chart' },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${context.parsed.y}%`,
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Skill Gap Report for {user?.name}</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Skill Gaps (Below {threshold}% Average Score)</h3>

        {skillGaps.length > 0 ? (
          <ul className="list-disc pl-5">
            {skillGaps.map(skill => (
              <li key={skill.skillId || skill.skillName} className="text-red-600">
                {skill.skillName}: {skill.averageScore}%
              </li>
            ))}
          </ul>
        ) : (
          <p>No skill gaps identified. Great job!</p>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Strong Skills (Above {threshold}% Average Score)</h3>

        {strongSkills.length > 0 ? (
          <ul className="list-disc pl-5">
            {strongSkills.map(skill => (
              <li key={skill.skillId || skill.skillName} className="text-green-600">
                {skill.skillName}: {skill.averageScore}%
              </li>
            ))}
          </ul>
        ) : (
          <p>No strong skills identified yet.</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Skill Performance Chart</h3>

        {performanceData.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p>No performance data to display.</p>
        )}
      </div>
    </div>
  );
};

export default SkillGapReport;
