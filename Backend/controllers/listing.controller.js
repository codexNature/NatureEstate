import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";


export const createListing = async (req, res, next) => {

  try {
    const listing = await Listing.create(req.body); //Listing is the model created in listing.model.js. This is used to create a new listing in the DB.
    return res.status(201).json(listing); //201 is used to show that the listing has been created.

  } catch (error) {
    next(error);
  }

};


export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if(req.user.id !== listing.userRef){
    return next(errorHandler(401, "You can only Delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing has been deleted!!!" });
  } catch (error) {
    next(error);
  }

};


export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found")); 
    }

    if(req.user.id !== listing.userRef){
      return next(errorHandler(401, "You can only Update your own listings!"));
    }

    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true} //This is used to return the updated listing
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
    
};