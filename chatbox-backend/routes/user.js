const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Message = require('../models/Message');

// Lấy thông tin người dùng
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// Cập nhật mật khẩu
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Xóa tài khoản
router.delete('/delete-account', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user);
    await Message.deleteMany({ user: req.user });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;