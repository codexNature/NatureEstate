import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "Hi world!!!",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  //user is gotten from verifyUser.js in req.user = user;              //params is : in user.route.js in ('/delete/:id
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User has been deleted!!!" });
  } catch (error) {
    next(error);
  }
};

export const getUserLisitings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only get your own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try { //This is to try and get the user
    const user = await User.findById(req.params.id); //This is to get the user from the database using the id from the params in the url

    if (!user) return next(errorHandler(404, "User not found!")); //This is to check if user exists

    const { password, pass, ...rest } = user._doc; //This allows the user to be returned without the password

    res.status(200).json(rest); // This returns the user without the password
  } catch (error) {
    next(error); //This is to catch any errors
  }
};
