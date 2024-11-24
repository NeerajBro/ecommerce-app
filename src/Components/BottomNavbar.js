import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BottomNavbar.css';
import { FaHome, FaUser, FaShoppingCart, FaBars, FaRobot } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

const BottomNavbar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="bottom-navbar">
            <div className="nav-item" onClick={() => handleNavigation('/home')}>
                <FaHome className="nav-icon" />
                <span>Home</span>
            </div>
            <div className="nav-item" onClick={() => handleNavigation('/account')}>
                <FaUser className="nav-icon" />
                <span>Account</span>
            </div>
            <div className="nav-item" onClick={() => handleNavigation('/cart')}>
                <FaShoppingCart className="nav-icon" />
                <span>Cart</span>
            </div>
            <div className="nav-item rufus-item">
                <FaRobot className="nav-icon rufus-icon" />
                <span>Rufus AI</span>
            </div>
            <div className="nav-item">
                <BsThreeDots className="nav-icon" />
                <span>More</span>
            </div>
            <div className="nav-item">
                <FaBars className="nav-icon" />
                <span>Menu</span>
            </div>
        </div>
    );
};

export default BottomNavbar;
