import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chat.css'; // Create a CSS file for styling
import { AiOutlineClose } from 'react-icons/ai';
import io from 'socket.io-client'; // Import socket.io-client

const Chat = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socket = useRef(null); // Use useRef to store the socket instance

    useEffect(() => {
        // Create socket connection on component load
        socket.current = io('http://localhost:3001'); // Replace with your server URL

        // Listen for incoming messages
        socket.current.on('chat message', (message) => {
            console.log("Server received chat message",message,messages);
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // Cleanup on component unmount
        return () => {
            socket.current.disconnect();
        };
    }, []);

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = { text: input, sender: 'user', status: 'sent' };
            setMessages([...messages, userMessage]);
            // setInput('');

            try {
                socket.current.emit('chat message', input.trim());
                setInput('');
                // Send request to server
                // const response = await fetch('http://localhost:3001/send', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(userMessage),
                // });

                // if (response.ok) {
                //     // Update message status to 'delivered'
                //     setMessages(prevMessages => prevMessages.map(msg =>
                //         msg === userMessage ? { ...msg, status: 'delivered' } : msg
                //     ));
                // }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div className="chat-modal">
            <div className="chat-header">
                <h2>Support</h2>
                <AiOutlineClose onClick={onClose} className="close-icon" />
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.text} {msg.status === 'delivered' && '✔✔'}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type a message..."
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                    }}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat; 