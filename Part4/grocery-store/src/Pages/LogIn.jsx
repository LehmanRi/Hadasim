import LoginForm from "../Conponents/LogInForm";
import { Link } from "react-router-dom";
import '../Styles/LogIn.css'; 

function LogIn() {
  return (
    <div className="login">
       <Link to="/home" >Home</Link>
      <h1>Log In</h1>
     <LoginForm />
    </div>
  );
}
export default LogIn;