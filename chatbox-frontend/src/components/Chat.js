import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/chat/history",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setMessages(response.data.messages.reverse());
    } catch (error) {
      toast.error("Failed to fetch messages: " + error.response.data.error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat/message",
        { content: input },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setMessages([
        ...messages,
        response.data.userMessage,
        response.data.botMessage,
      ]);
      setInput("");
    } catch (error) {
      toast.error("Failed to send message: " + error.response.data.error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <Container className="chat-container" maxWidth="md">
      <div className="chat-paper">
        <div className="chat-header">
          <Typography variant="h4" className="chat-title">
            Chat Bot
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </Button>
        </div>
        <div className="chat-list" ref={listRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-container ${msg.isBot ? "bot" : "user"}`}
            >
              {msg.isBot && <div className="avatar bot">B</div>}
              <div className={`message-bubble ${msg.isBot ? "bot" : "user"}`}>
                {msg.content}
              </div>
              {!msg.isBot && <div className="avatar user">U</div>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="input-container">
          <input
            type="text"
            className="input-field"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="send-button">
            <SendIcon />
          </button>
        </form>
      </div>
    </Container>
  );
}

export default Chat;
