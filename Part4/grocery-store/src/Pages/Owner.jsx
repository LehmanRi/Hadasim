import SignOut from "../Conponents/SignOut";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../UseHooks/useLocalStorage";
import "../Styles/Owner.css"; 

function Owner() {
  const { value } = useLocalStorage();
  const navigate = useNavigate();

  return (
    <div className="owner-container">
      <SignOut/>
      <h1>Welcome {value.name}</h1>
      <div className="owner-options">
        <div className="option-card" onClick={() => navigate('/owner/see-all-orders')}>
        <img src="/Pictures/see-orders.png" alt="See All Orders" />
          <p>See All Orders</p>
        </div>
        <div className="option-card" onClick={() => navigate('/owner/order')}>
        <img src="/Pictures/order.png" alt="Order" />
          <p>Order</p>
        </div>
      </div>
    </div>
  );
}

export default Owner;
