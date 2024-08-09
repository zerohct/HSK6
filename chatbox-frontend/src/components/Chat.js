import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Container, Typography, Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        "http://localhost:5000/api/chat/history",
        {
          headers: { "x-auth-token": token },
        }
      );
      setMessages(response.data.messages.reverse());
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to fetch messages. Please try logging in again.");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.post(
        "http://localhost:5000/api/chat/message",
        { content: input },
        { headers: { "x-auth-token": token } }
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        response.data.userMessage,
        response.data.botMessage,
      ]);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const debouncedSendMessage = debounce(sendMessage, 300);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const formatMessage = (content) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("- ")) {
        return <li key={index}>{line.substring(2)}</li>;
      }
      return <p key={index}>{line}</p>;
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="chat-wrapper">
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
                  {msg.content.includes("\n- ") ? (
                    <ul>{formatMessage(msg.content)}</ul>
                  ) : (
                    formatMessage(msg.content)
                  )}
                </div>
                {!msg.isBot && <div className="avatar user">U</div>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={debouncedSendMessage} className="input-container">
            <input
              type="text"
              className="input-field"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
            />
            <button
              type="submit"
              className="send-button"
              disabled={isSending || !input.trim()}
            >
              {isSending ? <CircularProgress size={24} /> : <SendIcon />}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Chat;
