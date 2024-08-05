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

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
      });
      toast.success("Registered successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed: " + error.response.data.error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="register-container">
      <Paper elevation={6} className="register-paper">
        <Avatar className="register-avatar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="register-form">
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="register-submit"
          >
            Sign Up
          </Button>
          <Box className="register-signin">
            <Link to="/login">
              <Typography variant="body2" align="center">
                Already have an account? Sign In
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
