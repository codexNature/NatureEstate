import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate user input here if needed.

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User Created!" });
  } catch (error) {
    // Handle errors here
    next(error);
  }
};