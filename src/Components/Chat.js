import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chat.css'; // Create a CSS file for styling
import { AiOutlineClose, AiOutlineSend } from 'react-icons/ai';
import { sendMessageRoute, recieveMessageRoute, host } from "../utils/APIRoutes";
import axios from 'axios';
import { io } from "socket.io-client";

const Chat = ({ onClose, currentChat }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [revealedMessageIds, setRevealedMessageIds] = useState(new Set());

    const socket = useRef();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (currentUser) {
          socket.current.emit("add-user", currentUser._id);
        }
      }, [currentUser]);

    useEffect(() => {
        async function fetchMessages() {
          const data = await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          );
          const response = await axios.post(recieveMessageRoute, {
            from: data._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        }
        fetchMessages();
      }, [currentChat]);

      useEffect(() => {
        async function setChatCurrentUser(){
        //setting logged in user as current user
        setCurrentUser(
            await JSON.parse(
              localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            )
          );
          
          socket.current = io(host,{
            path: "/socket.io", // optional if default
            transports: ["websocket"],
          });

          socket.current.on("msg-recieve", (msg) => {
            setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
        setChatCurrentUser();
        
      }, []);

      useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage]);

   
    const handleSendMsg = async (msg) => {
        const data = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: data._id,
          msg,
        });
        await axios.post(sendMessageRoute, {
          from: data._id,
          to: currentChat._id,
          message: msg,
        });
    
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
        setInput('');
      };

    // Update getFakeMessage to handle both user and bot messages
    const getFakeMessage = (originalMessage, isUser) => {
        const userResponses = {
            default: "Hi, I need help with something",
            order: "Can you check my order status?",
            product: "I'm looking for electronics",
            shipping: "When will my package arrive?",
            payment: "How can I pay for my order?",
            help: "Can you help me with my purchase?"
        };

        const botResponses = {
            default: "I can help you find the perfect product!",
            order: "Your order will be delivered within 2-3 business days.",
            product: "We have a great selection of products at competitive prices.",
            shipping: "We offer free shipping on orders over $50.",
            payment: "We accept all major credit cards and digital payment methods.",
            help: "Of course! What can I assist you with today?"
        };

        const responses = isUser ? userResponses : botResponses;
        const msg = originalMessage.toLowerCase();

        if (msg.includes('order')) return responses.order;
        if (msg.includes('product')) return responses.product;
        if (msg.includes('shipping')) return responses.shipping;
        if (msg.includes('payment')) return responses.payment;
        if (msg.includes('help')) return responses.help;
        return responses.default;
    };

    // Add function to handle double click
    const handleDoubleClick = (index) => {
        setRevealedMessageIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <div className="chat-modal">
            <div className="chat-header">
                <h2>Support</h2>
                <AiOutlineClose onClick={onClose} className="close-icon" />
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat-message ${msg.fromSelf ? 'user' : 'other'}`}
                        onDoubleClick={() => handleDoubleClick(index)}
                        // For mobile support
                        onTouchEnd={(e) => {
                            if (e.detail === 2) { // Check if double tap
                                handleDoubleClick(index);
                            }
                        }}
                    >
                        <div className="message-content">
                            {revealedMessageIds.has(index)
                                ? msg.message 
                                : getFakeMessage(msg.message, msg.fromSelf)}
                            {msg.status === 'delivered' && <span className="status">✔✔</span>}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type a message..."
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMsg(e.target.value);
                        }
                    }}
                />
                <button onClick={() => handleSendMsg(input)} className="send-button">
                    <AiOutlineSend size={20} />
                </button>
            </div>

            <style jsx>{`
                .chat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.8rem 1.2rem;
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #e9ecef;
                }

                .chat-header h2 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .close-icon {
                    cursor: pointer;
                    font-size: 1.2rem;
                    color: #6c757d;
                    transition: color 0.2s ease;
                }

                .close-icon:hover {
                    color: #343a40;
                }

                .chat-messages {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                    overflow-y: auto;
                    height: calc(100% - 100px);
                }

                .chat-message {
                    display: flex;
                    margin-bottom: 0.5rem;
                }

                .chat-message.user {
                    justify-content: flex-end;
                }

                .chat-message.other {
                    justify-content: flex-start;
                }

                .message-content {
                    max-width: 60%;
                    padding: 0.8rem 1rem;
                    border-radius: 1.2rem;
                    font-size: 0.95rem;
                    line-height: 1.4;
                    position: relative;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    user-select: none; /* Prevent text selection while pressing */
                    transition: transform 0.1s ease;
                    cursor: pointer;
                }

                .user .message-content {
                    background-color: #e6f2f6;
                    color: #2c3e50;
                    border-bottom-right-radius: 0.3rem;
                }

                .other .message-content {
                    background-color: rgb(238, 238, 238);
                    color: #2c3e50;
                    border-bottom-left-radius: 0.3rem;
                }

                .status {
                    font-size: 0.8rem;
                    margin-left: 0.5rem;
                    color: #666;
                }

                @media screen and (max-width: 768px) {
                    .message-content {
                        max-width: 75%;
                    }
                }

                .send-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.6rem;
                    border: none;
                    background-color: #232f3e;
                    cursor: pointer;
                    color: white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .send-button:hover {
                    background-color: #1a2530;
                    transform: scale(1.05);
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
                }

                .send-button:active {
                    transform: scale(0.95);
                }

                .chat-input {
                    display: flex;
                    gap: 0.8rem;
                    padding: 1rem;
                    background-color: #fff;
                    border-top: 1px solid #e9ecef;
                    align-items: center;
                }

                .chat-input input {
                    flex: 1;
                    padding: 0.8rem 1rem;
                    border: 1px solid #e9ecef;
                    border-radius: 24px;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s ease;
                }

                .chat-input input:focus {
                    border-color: #232f3e;
                }

                .message-content:active {
                    transform: scale(0.98);
                }

                /* Add a subtle hint that messages are interactive */
                .message-content:hover {
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
};

export default Chat; 