import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {

  try {
    const listing = await Listing.create(req.body); //Listing is the model created in listing.model.js. This is used to create a new listing in the DB.
    return res.status(201).json(listing); //201 is used to show that the listing has been created.

  } catch (error) {
    next(error);
  }

};

