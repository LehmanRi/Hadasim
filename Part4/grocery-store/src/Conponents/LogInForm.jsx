import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../UseHooks/useLocalStorage';
import '../Styles/LogIn.css'; 

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { set } = useLocalStorage(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        name: username,
        password: password,
      });

      const user = res.data;

    
      set({ id: user.id, name: user.name, type : user.type });

     
      if (user.type === 'supplier') {
        navigate('/supplier');
      } else if (user.type === 'owner') {
        navigate('/owner');
      }
    } catch (err) {
        const msg = err.response?.data?.error || 'Login failed. Please try again.';
        console.log(msg);
        setErrorMessage(msg);
      }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          required
        />
      </div>
      <button type="submit">Log In</button>
    {errorMessage && (
        <p style={{ color: 'red', marginTop: '10px' }}>
        {errorMessage}
        </p>
    )}
    </form>
    
  );
}

export default LoginForm;
