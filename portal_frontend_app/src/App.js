import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { AuthContext } from './context/AuthContext';
import LoginRegister from './components/LoginRegister';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { user, role, logout } = useContext(AuthContext);

  return (
    <div className="App">
    {!user ? "" : <nav>
        <ul>
          {!user ? (
            ""
          ) : (
            <>
              {role === 'user' && (
                <li>
                  <Link  className='nav-logo' to="/dashboard">User Dashboard</Link>
                </li>
              )}
              {role === 'admin' && (
                <li>
                  <Link  className='nav-logo' to="/admin">Admin Panel</Link>
                </li>
              )}
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>}

      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="user">
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
