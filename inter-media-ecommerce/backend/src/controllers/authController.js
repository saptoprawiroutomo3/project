const User = require('../models/User');
const { generateToken, generateOTP } = require('../utils/helpers');
const { sendOTPEmail } = require('../utils/email');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role = 'customer' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      name,
      email,
      password,
      phone,
      role,
      otp: {
        code: otp,
        expiresAt: otpExpires
      }
    });

    await user.save();

    // Send OTP email (simulated)
    console.log(`OTP for ${email}: ${otp}`);
    // await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email with OTP.',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (!user.otp.code || user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    console.log('🔍 Login attempt started:', { email: req.body.email });
    const { email, password } = req.body;

    console.log('🔍 Searching for user in database...');
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('✅ User found:', { id: user._id, email: user.email, role: user.role });

    if (!user.isActive) {
      console.log('❌ User account deactivated:', email);
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    console.log('🔍 Comparing password...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('✅ Password match successful');

    if (!user.isVerified) {
      console.log('❌ User not verified:', email);
      return res.status(401).json({ 
        message: 'Please verify your email first',
        requiresVerification: true,
        userId: user._id
      });
    }

    console.log('🔍 Generating JWT token...');
    const token = generateToken(user._id);
    console.log('✅ Login successful for:', email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('💥 Login error:', error.message);
    console.error('💥 Full error:', error);
    res.status(500).json({ message: error.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = {
      code: otp,
      expiresAt: otpExpires
    };
    await user.save();

    // Send OTP email (simulated)
    console.log(`New OTP for ${user.email}: ${otp}`);
    // await sendOTPEmail(user.email, otp, user.name);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = {
      code: otp,
      expiresAt: otpExpires
    };
    await user.save();

    // Send OTP email (simulated)
    console.log(`Password reset OTP for ${email}: ${otp}`);
    // await sendOTPEmail(email, otp, user.name);

    res.json({ 
      message: 'Password reset OTP sent',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp.code || user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  verifyOTP,
  login,
  resendOTP,
  forgotPassword,
  resetPassword,
  getProfile
};
