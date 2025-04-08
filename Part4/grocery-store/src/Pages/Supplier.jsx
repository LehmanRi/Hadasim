import React, { useEffect, useState } from "react";
import useLocalStorage from "../UseHooks/useLocalStorage";
import OrdersSupplier from "../Conponents/OrdersSupplier";
import SignOut from "../Conponents/SignOut";
function Supplier() {
  const {value }= useLocalStorage();
   return (
    <div className="supplier-page">
      <div className="top-bar">
  <SignOut className="sign-out-button" />
    </div>
      <h1>Welcome {value.name}</h1>
      <OrdersSupplier/>
    </div>
  );
}

export default Supplier;
