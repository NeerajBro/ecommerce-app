import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNavbar from './BottomNavbar';
import Chat from './Chat';
import '../styles/Categories.css';
import DeviceOrientationComponent from './DeviceOrientationComponent';
import { io } from "socket.io-client";
import { validatePinRoute, host } from "../utils/APIRoutes";
import axios from 'axios';
import ChatContainer from './ChatContainer';

const Categories = () => {
    const navigate = useNavigate();
    const [clickedNumbers, setClickedNumbers] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [currentChat, setCurrentChat] = useState(undefined);

    const categories = [
        {
            id: 1,
            name: "Electronics",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 2,
            name: "Fashion",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 3,
            name: "Home & Kitchen",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 4,
            name: "Books",
            image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 5,
            name: "Sports",
            image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 6,
            name: "Beauty",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 7,
            name: "Toys & Games",
            image: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 8,
            name: "Automotive",
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 9,
            name: "Garden & Outdoor",
            image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 10,
            name: "Pet Supplies",
            image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 11,
            name: "Health",
            image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 12,
            name: "Grocery",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 13,
            name: "Baby",
            image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 14,
            name: "Tools",
            image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        },
        {
            id: 15,
            name: "Furniture",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        }
    ];

    const handleCategoryClick = async (categoryName) => {
        let number = parseInt(categoryName);
        if(number === 11){
            number = 0;
        }
        if (!isNaN(number)) {
            const newNumbers = [...clickedNumbers, number];
            setClickedNumbers(newNumbers);
            if (newNumbers.length === 4) {
                try {
                    const response = await axios.post(validatePinRoute, {
                        pin: parseInt(newNumbers.join(''))
                    });
                    
                    if (response.data.status) {
                        setClickedNumbers([]); // Reset after successful validation
                        setShowChat(true); // Show chat modal

                        
                        //setting current chat to the user who's pin is entered
                        setCurrentChat(response.data.user);
                    } else {
                        alert('Invalid PIN. Please try again.');
                        setClickedNumbers([]); // Reset on invalid PIN
                    }
                } catch (error) {
                    console.error('Error validating PIN:', error);
                    alert('Error validating PIN. Please try again.');
                    setClickedNumbers([]); // Reset on error
                }
            }
        }
    };

    return (
        <div className="categories-page">
            <Navbar />
            {/* <DeviceOrientationComponent /> */}
            <div className="categories-container">
                <div className="categories-grid">
                    {categories.map((category,i) => (
                        <div 
                            key={category.id} 
                            className="category-card"
                            onClick={() => handleCategoryClick(i+1)}
                        >
                            <p className="category-title-text">{category.name}</p>
                            <div className="category-image-container">
                                <img src={category.image} alt={category.name} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {
            // showChat && <Chat onClose={() => setShowChat(false)} />
            showChat && <Chat currentChat={currentChat} onClose={() => setShowChat(false)} />
            }
            <Footer />
            <BottomNavbar />
        </div>
    );
};

export default Categories;
