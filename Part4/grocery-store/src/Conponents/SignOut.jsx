import React from 'react';
import useLocalStorage from "../UseHooks/useLocalStorage";
import {  useNavigate } from 'react-router-dom';
import '../Styles/SignOut.css';
function SignOut() {
  const { remove } = useLocalStorage();
  const navigate = useNavigate();
  return (
    <div>
      <button   className="sign-out-button"  onClick={() => { remove();navigate('/home'); }}>
        Sign Out
      </button>
    </div>
  );
}

export default SignOut;