import axios from "axios";
import React, { useEffect, useState } from "react";
import useLocalStorage from "../UseHooks/useLocalStorage";
import "../Styles/OrdersSupplier.css";

function OrdersSupplier() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
  

    const {value }= useLocalStorage();
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/orders/by-supplier/${value.id}`);
          setOrders(response.data);
          console.log(response.data);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, []);
  
    const approveOrder = async (orderId) => {
      try {
        await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
          newStatus: "In Process",
        });
      
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: "In Process" } : order
          )
        );
      } catch (err) {
        console.error("Failed to approve order:", err);
      }
    };
  
    return (
      <div>
        <h1>Orders</h1>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-container">
            {orders.map((order) => (
              <div key={order.id} className="order-card-supplier">
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total Price:</strong> ₪{order.total_price.toFixed(2)}</p>
                <div>
                  <p><strong>Items:</strong></p>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        Product ID: {item.product_id}, Quantity: {item.quantity}, Price: ₪{item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                {order.status === "Created" && (
                  <button className="approve-button" onClick={() => approveOrder(order.id)}>
                    Approve Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
export default OrdersSupplier;