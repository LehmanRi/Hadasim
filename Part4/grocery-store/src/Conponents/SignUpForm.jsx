import React, { useState } from "react";
import axios from "axios";
import useLocalStorage from "../UseHooks/useLocalStorage";
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Button } from "@mui/material";
import "../Styles/SignUp.css";

function SignUpForm() {
  const navigate = useNavigate();
  const { set } = useLocalStorage();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    companyName: "",
    phoneNumber: "",
    representativeName: "",
    products: [{ name: "", price: "", minAmount: "" }],
  });

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
  
    if (index !== null && field) {
      const updatedProducts = [...formData.products];
      updatedProducts[index][field] = value;
      setFormData({ ...formData, products: updatedProducts });
    } else {

      setFormData({ ...formData, [name]: value });
    }
  };

  const addGoodField = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: "", price: "", minAmount: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
 
      const userResponse = await axios.post("http://localhost:5000/api/users", {
        name: formData.userName,
        password: formData.password,
        type: "supplier",
      });

      const supplierResponse = await axios.post("http://localhost:5000/api/suppliers", {
        id: userResponse.data.id,
        companyName: formData.companyName,
        phoneNumber: formData.phoneNumber,
        representativeName: formData.representativeName,
      });
  
  
      const formattedProducts = formData.products.map((product) => ({
        supplierId: userResponse.data.id,
        name: product.name,
        pricePerItem: parseFloat(product.price),
        minQuantity: parseInt(product.minAmount),
      }));
  
      await axios.post("http://localhost:5000/api/products", {
        products: formattedProducts,
      });
  
      console.log({
        user: userResponse.data.id,
      
      });
      set({
        id: userResponse.data.id,
        name: formData.userName,
        type: "supplier",
      });
      navigate('/supplier');
    } catch (error) {
      console.error("Sign-up error:", error);
      alert("Sign-up failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          User Name:
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </label>
  
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
  
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </label>
  
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            pattern="^\+?[0-9]{7,15}$"
            required
          />
        </label>
  
        <label>
          Representative Name:
          <input
            type="text"
            name="representativeName"
            value={formData.representativeName}
            onChange={handleChange}
            required
          />
        </label>
  
        <div className="products-section">
          <label>Products Offered:</label>
          <button type="button" onClick={addGoodField}>+ Add another good</button>
          {formData.products.map((product, index) => (
            <Grid container spacing={2} key={index} sx={{ marginTop: 1 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Name"
                  value={product.name}
                  onChange={(e) => handleChange(e, index, "name")}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  value={product.price}
                  inputProps={{ min: 0 }}
                  onChange={(e) => handleChange(e, index, "price")}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  label=" Amount"
                  inputProps={{ min: 0 }}
                  value={product.minAmount}
                  onChange={(e) => handleChange(e, index, "minAmount")}
                  required
                />
              </Grid>
            </Grid>
          ))}
        </div>
  
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
  
}

export default SignUpForm;
