import React from 'react';
import './App.css';
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Protected from './Components/Protected';
import RecoveryEmail from './Pages/RecoveryEmail';
import ResetPassword from './Pages/ResetPassword';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route element={<Protected />} >
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="recoveryEmail" element={<RecoveryEmail />} />
        <Route path="resetPassword/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
