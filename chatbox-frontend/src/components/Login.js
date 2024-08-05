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
      toast.success("Đăng nhập thành công!");
      navigate("/chat");
    } catch (error) {
      toast.error("Đăng nhập thất bại! " + error.response.data.error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="login-container">
      <Paper elevation={6} className="login-paper">
        <Avatar className="login-avatar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography style={{ fontFamily: 'UVN BAI SAU, sans-serif',textTransform:'uppercase' }} component="h1" variant="h5" gutterBottom>
         Đăng Nhập
        </Typography>
        <Box style={{ fontFamily: 'UVN BAI SAU, sans-serif',textTransform:'uppercase' }}  component="form" onSubmit={handleSubmit} className="login-form">
          <TextField
            
            margin="normal"
            required
            fullWidth
            id="username"
            label="Tài Khoản"
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
            label="Mật Khẩu"
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
            style={{ fontFamily: 'UVN BAI SAU, sans-serif' }}
          >
            ĐĂNG NHẬP
          </Button>
          <Box className="login-signup">
            <Link to="/register">
              <Typography style={{ fontFamily: 'UVN BAI SAU, sans-serif' }} variant="body2" align="center">
                Bạn không có tài khoản? Đăng Ký
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
      
    </Container>
  );
}

export default Login;
