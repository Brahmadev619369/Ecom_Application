import axios from 'axios';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { StoreContext } from "../Context";
import "./chatbot.css"
function Chatbot() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    
    const token = localStorage.getItem("AuthToken");

    const sendmsg = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setIsTyping(true);
        setInput("");

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/chatbot`, {
                message: input
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTimeout(() => {
                setMessages(prev => [...prev, { text: data.message, sender: "bot" }]);
                setIsTyping(false);
            }, 1000);

        } catch (error) {
            setMessages(prev => [...prev, { text: "Error fetching response.", sender: "bot" }]);
            setIsTyping(false);
        }
    };

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className='chatbot-container'>
            <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "✖" : "💬"}
            </button>

            {isOpen && (
                <div className="chatbox">
                    <div className="chat-header">💬 YourCart AI Assistant</div>
                    <p>Currently in Development Mode</p>
                    <div className="message-box">
                        {messages.map((msg, index) => (
                            <div className={`message ${msg.sender}`} key={index}>
                                {msg.text}
                            </div>
                        ))}

                        {isTyping && <div className="typing">YourCart is typing...</div>}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            autoFocus
                        />
                        <button onClick={sendmsg}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chatbot;
