import React, { useEffect } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import useLocalStorage from "../UseHooks/useLocalStorage";
import '../Styles/Home.css'; 
function Home() {
    const {value }= useLocalStorage();
    const navigate = useNavigate();
    useEffect(() => {
       
        if (value) {
            if (value.type === 'supplier') {
                navigate('/supplier');
            } else if (value.type === 'owner') {
                navigate('/owner'); 
            }
        }
      }, []);




  return (
    <div className="home-container">
        <nav>
            < Link to='/sign-up'>
            Sign Up
            </Link>
            <Link to='/log-in' className="home-button">
            Log In
            </Link>
        </nav>
      <div className="home-content">
        <h1>Welcome to the SUPERMARKET</h1>
      </div>
      
    </div>
  );
}

export default Home;
