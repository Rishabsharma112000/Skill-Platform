import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_ROUTES from '../config/api.js'; 

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const resetFormFields = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError(null);
  };

  const handleToggleForm = (isLoginForm) => {
    setIsLogin(isLoginForm);
    resetFormFields();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const url = isLogin ? API_ROUTES.AUTH.LOGIN : API_ROUTES.AUTH.REGISTER;
      const body = isLogin
        ? { email, password }
        : { name: username, email, password }; 

        console.log("This is the url" , url);
      const response = await axios.post(url, body);

      login(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    }
  };

  return (
    <div className='login-wrap'>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p className="lr-toggle-text">
        {isLogin ? (
          <>
            New user? <span className="lr-toggle-link" onClick={() => handleToggleForm(false)}>Register</span>
          </>
        ) : (
          <>
            Already registered? <span className="lr-toggle-link" onClick={() => handleToggleForm(true)}>Login</span>
          </>
        )}
      </p>
    </div>
  );
};

export default LoginRegister;
