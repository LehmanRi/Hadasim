import React, { useEffect, useState } from "react";
import axios from "axios";
import SignOut from "../Conponents/SignOut";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import "../Styles/OwnerSeeAllOrders.css";
function OwnerSeeAllOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios.get("http://localhost:5000/api/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to load orders:", err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleComplete = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        newStatus: "Completed"
      });
      fetchOrders(); 
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to complete order.");
    }
  };

  return (
    <div>
      <div className="top-bar">
        <Link to="/owner" className="home-link">Home</Link>
        <SignOut className="sign-out-button" />
      </div>
      <h1> All Orders</h1>
      
      <div className="order-card">
      {orders.map((order) => (
        <div key={order.id} >
          <h3>Order #{order.id}</h3>
          <p>Company: {order.company_name}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₪{order.total_price}</p>
          <p>Items:</p>

          <ul>
            {order.items?.map(item => (
              <li key={item.id}>
                {item.product_name}  Quantity: {item.quantity} – Price: ₪{item.price}
              </li>
            ))}
          </ul>

          {order.status === "In Process" && (
            <Button variant="contained" onClick={() => handleComplete(order.id)}>
              Mark as Completed
            </Button>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}

export default OwnerSeeAllOrders;
