import SignUpForm from "../Conponents/SignUpForm.jsx";
import { Link } from "react-router-dom";
import "../Styles/SignUp.css";

function SignUp() {
  return (
    <div>
      <Link className="signup-link" to="/home" >Home</Link>
      <h1>Company Sign Up</h1>
      <SignUpForm />
    </div>
  );
}
export default SignUp;