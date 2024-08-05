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
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      toast.error("Đăng ký thất bại! " + error.response.data.error);
    }
  };

  return (
    <Container style={{ fontFamily: 'UVN BAI SAU, sans-serif',textTransform:'uppercase' }} component="main" maxWidth="xs" className="register-container">
      <Paper elevation={6} className="register-paper">
        <Avatar className="register-avatar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography style={{ fontFamily: 'UVN BAI SAU, sans-serif',textTransform:'uppercase' }} component="h1" variant="h5" gutterBottom>
          Đăng Ký
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="register-form">
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
            style={{ fontFamily: 'UVN BAI SAU, sans-serif',textTransform:'uppercase' }}
          >
            Đăng Ký
          </Button>
          <Box className="register-signin">
            <Link to="/login">
              <Typography style={{ fontFamily: 'UVN BAI SAU, sans-serif',textTransform:'uppercase' }} variant="body2" align="center">
                Bạn đã có tài khoản? Đăng Nhập
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
