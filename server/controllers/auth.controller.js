import { ENV } from "../config/env.js";
import { hashPassword, verifyPassword } from "../helpers/passwordHelper.js";
import { normalizePhone } from "../helpers/phoneNormalizer.js";
import { generateToken } from "../helpers/tokenGenerator.js";
import { validateEmail } from "../helpers/validateEmail.js";
import User from "../models/user.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "validation(error): invalid payload",
      });
    }

    if (name.length < 3) {
      return res.status(400).json({
        success: false,
        message: "validation(error): name must be at least 3 characters",
      });
    }

    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "validation(error): invalid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "validation(error): password must be at least 8 characters",
      });
    }

    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "validation(error): invalid phone number",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: "validation(error): invalid phone number",
      });
    }

    const newUser = new User({
      name,
      email,
      phone: normalizedPhone,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "user created",
      user: {
        id: newUser._id,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("register error: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Oops Something broke" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "validation(error): invalid payload",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }

    if (!(await verifyPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }

    const token = generateToken(user._id, user.email, user.name);

    res.cookie("token", token, {
      httpOnly: true,
      secure: ENV.nodeEnv === "production",
      sameSite: ENV.nodeEnv === "production" ? "strict" : "lax",
      expires: new Date(Date.now() + 900000),
    });

    return res.status(200).json({
      success: true,
      message: "user logged in",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("login error: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Oops Something broke" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
