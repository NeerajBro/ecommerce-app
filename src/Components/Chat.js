import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chat.css'; // Create a CSS file for styling
import { AiOutlineClose } from 'react-icons/ai';
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import axios from 'axios';

const Chat = ({ onClose, currentChat, socket }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    return (
        <div className="chat-modal">
            <div className="chat-header">
                <h2>Support</h2>
                <AiOutlineClose onClick={onClose} className="close-icon" />
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.fromSelf ? 'user' : 'other'}`}>
                        <div className="message-content">
                            {msg.message}
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
                <button onClick={() => handleSendMsg(input)}>Send</button>
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
            `}</style>
        </div>
    );
};

export default Chat; 