import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import SignUp from './Pages/SignUp'
import LogIn from './Pages/LogIn';
import Supplier from './Pages/Supplier';
import Owner from './Pages/Owner';
import OwnerOrder from './Pages/OwnerOrder';
import OwnerSeeAllOrders from './Pages/OwnerSeeAllOrders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/supplier" element={<Supplier />} />
        <Route path="/owner" >
            <Route index element={<Owner />}/>
          <  Route path="order" element={<OwnerOrder/>} />
          <  Route path="see-all-orders" element={<OwnerSeeAllOrders/>} />
      </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}  
export default App;
