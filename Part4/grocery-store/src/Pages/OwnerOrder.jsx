import React, { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, TextField, Typography, Button } from "@mui/material";
import SignOut from "../Conponents/SignOut";
import ProductList from "../Conponents/ProductList";
import { Link } from "react-router-dom";
import "../Styles/OwnerOrder.css";

function OwnerOrder() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/suppliers")
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error("Failed to load suppliers:", err));
  }, []);

  useEffect(() => {
    if (selectedSupplier?.id) {
      axios
        .get(`http://localhost:5000/api/products/by-supplier/${selectedSupplier.id}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Failed to load products:", err));

      setSelectedProducts([]);
      setAmounts({});
    } else {
      setProducts([]);
    }
  }, [selectedSupplier]);

  const handleToggle = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAmountChange = (productId, value) => {
    const number = parseInt(value, 10) || "";
    setAmounts((prev) => ({ ...prev, [productId]: number }));
  };

  const total = selectedProducts.reduce((sum, id) => {
    const product = products.find((p) => p.id === id);
    const amount = amounts[id] || 0;
    return sum + product.price_per_item * amount;
  }, 0);

  const handleOrder = async () => {
    try {
      const orderItems = selectedProducts.map((id) => {
        const product = products.find((p) => p.id === id);
        return {
          productId: id,
          quantity: amounts[id],
          price: product.price_per_item,
        };
      });
  
      const response = await axios.post("http://localhost:5000/api/orders", {
        supplierId: selectedSupplier.id,
        status: "Created",
        totalPrice: total,
        orderItems: orderItems,
      });
  // alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
      
      setSelectedSupplier(null);
      setSelectedProducts([]);
      setAmounts({});
      setProducts([]);
      setSelectedSupplier(null);
    } catch (error) {
      console.error("Order failed:", error);
      alert(error.response?.data?.error || "Failed to place order.");
    }
  };

  return (
    <div >
        <div className="top-bar">
            <Link to="/owner" className="home-link">Home</Link>
            <SignOut />
          </div>
  
      <h1>Place an Order</h1>
      <div className="owner-order-container">
      <Autocomplete
        disablePortal
        options={suppliers}
        getOptionLabel={(option) => option.company_name}
        onChange={(e, value) => setSelectedSupplier(value)}
        value={selectedSupplier} 
        sx={{ width: 300, marginBottom: 2 }}
        renderInput={(params) => <TextField {...params} label="Company" />}
        />

      {selectedSupplier && (
        <>
          <ProductList
            products={products}
            selected={selectedProducts}
            amounts={amounts}
            onToggle={handleToggle}
            onAmountChange={handleAmountChange}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ₪{total.toFixed(2)}
          </Typography>

          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleOrder}>
            Place Order
          </Button>
        </>
      )}
       </div>
      </div>

  );
}

export default OwnerOrder;
