import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const Navigate = useNavigate();
    const auth = localStorage.getItem('auth');

    function logout() {
        localStorage.clear();
        Navigate('/register')
    }
    if (!auth) {
        return (
            <div className='NavDiv'>
                <ul>
                    <li><NavLink className={({ isActive }) => isActive ? "active" : "inactive"} to="login"> Login </NavLink></li>
                    <li><NavLink className={({ isActive }) => isActive ? "active" : "inactive"} to="register"> Register </NavLink></li>
                </ul>
            </div>
        )
    } else {
        return (
            <div className='NavDiv'>
                <ul>
                    <li><a className="inactive" onClick={logout} href="register"> Logout </a></li>
                </ul>
            </div>
        )
    }
}

export default Navbar;