import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';





//Sign up function
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate user input here if needed.

    const hashedPassword = await bcrypt.hash(password, 10); //this is used to hash the password with bcrypt.

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
  };
};



//Sign in function, send function to auth.route
export const signin = async (req, res, next) => {
  const {email, password } = req.body;
  try {       //User is the exported model created in the user.model file
    const validUser = await User.findOne({ email}); //findOne here is used look through the DB if the email exist.
                                //errorHandler is imported from utils error.js file.
    if (!validUser) return next(errorHandler(404, 'User does not exist')); //this line is if the email does not exist/valid to handle errors.
    //below is using bcrypt to check the hashed password.
    const validPassword = bcrypt.compareSync(password, validUser.password);
    //below if password is incorrect.
    if (!validPassword) return next(errorHandler(401, 'Email or Password does not match!'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)//this is used to authenticate the user using a token via cookie hidden in the browser.

    // pass is the password but cannot use it since it is used as a const earlier and "rest" is the other userinformation ie username, email etc
    const { password: pass, ...rest } = validUser._doc   //we destructure the password so it is not sent to user/frontend
    res
      .cookie( 'access_token', token, { httpOnly: true})
      .status(200)
      .json(rest);  //saving token as cookie


  } catch (error) {
    next(error); //middleware created in the index.js file (Handles error)
  };
};





export const google = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
          const { password, ...rest } = user._doc; 
          res
            .cookie( 'access_token', token, { httpOnly: true})
            .status(200)
            .json(rest);
      } else {
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) ; //this is used to generate a random password for the user. Since google does not provide a password, and we need a password to create a user in the DB. the toString(36) is to generate Alphanumeric characters, from A-Z and 0-9. the slice(-8) is to  take the last 8 characters after the decimal point. Add the two together to get a 16 character password. which is then hashed below.
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        const newUser = new User({
          username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), //this will join first and second(from google) name together and lowercase it. then add a random 4 character string to the end of the username.
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password, ...rest } = newUser._doc;
        res
          .cookie( 'access_token', token, { httpOnly: true})
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    };
};


export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token').json({ message: 'Signout Successful!' });
  } catch (error) {
    next(error);
  };
};