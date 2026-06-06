import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
try {
const { name, email, password } = req.body;


if (!name || !email || !password) {
  return res.status(400).json({
    success: false,
    message: "All fields are required"
  });
}

const userExists = await User.findOne({ email });

if (userExists) {
  return res.status(400).json({
    success: false,
    message: "User already exists"
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  name,
  email,
  password: hashedPassword
});

return res.status(201).json({
  success: true,
  message: "User registered successfully",
  userId: user._id
});


} catch (error) {
console.error(error);


return res.status(500).json({
  success: false,
  message: "Server Error"
});
}
};

export const login = async (req, res) => {
try {
const { email, password } = req.body;


if (!email || !password) {
  return res.status(400).json({
    success: false,
    message: "Email and Password are required"
  });
}

const user = await User.findOne({ email });

if (!user) {
  return res.status(400).json({
    success: false,
    message: "Invalid Credentials"
  });
}

const isMatch = await bcrypt.compare(
  password,
  user.password
);
const token = jwt.sign(
  {
    userId: user._id
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"
  }
);

if (!isMatch) {
  return res.status(400).json({
    success: false,
    message: "Invalid Credentials"
  });
}

return res.status(200).json({
  success: true,
  message: "Login Successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});


} catch (error) {
console.error(error);

return res.status(500).json({
  success: false,
  message: "Server Error"
});


}
};
