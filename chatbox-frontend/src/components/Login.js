import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast } from "react-toastify";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );
      localStorage.setItem("token", response.data.token);
      toast.success("Logged in successfully!");
      navigate("/chat");
    } catch (error) {
      toast.error("Login failed: " + error.response.data.error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="login-container">
      <Paper elevation={6} className="login-paper">
        <Avatar className="login-avatar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="login-form">
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="login-submit"
          >
            Sign In
          </Button>
          <Box className="login-signup">
            <Link to="/register">
              <Typography variant="body2" align="center">
                Don't have an account? Sign Up
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
