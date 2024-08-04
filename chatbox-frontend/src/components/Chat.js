import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Paper, TextField, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chat/history', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setMessages(response.data.messages.reverse());
    } catch (error) {
      toast.error('Failed to fetch messages: ' + error.response.data.error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/chat/message', 
        { content: input },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setMessages([...messages, response.data.userMessage, response.data.botMessage]);
      setInput('');
    } catch (error) {
      toast.error('Failed to send message: ' + error.response.data.error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Chat
        </Typography>
        <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
              <Paper elevation={2} sx={{ padding: 2, maxWidth: '70%', backgroundColor: msg.isBot ? 'primary.main' : 'secondary.main' }}>
                <ListItemText primary={msg.content} />
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
        <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ mr: 1 }}
          />
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Chat;