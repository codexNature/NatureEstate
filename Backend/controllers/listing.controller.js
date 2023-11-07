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

  if (req.user.id !== listing.userRef) {
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

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only Update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } //This is used to return the updated listing
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9; //This is used to limit the number of listings returned
    const startIndex = parseInt(req.query.startIndex) || 0; //This is used to skip the first n number of listings 0

    let offer = req.query.offer; //This is used to filter the listings based on the offer
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] }; //This is used to return all listings, both with and without offers
    }

    let furnished = req.query.furnished; //This is used to filter the listings based on the furnished
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] }; //This is used to return all listings, both with and without furnished
    }

    let parking = req.query.parking; //This is used to filter the listings based on the parking
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] }; //This is used to return all listings, both with and without parking
    }

    let type = req.query.type; //This is used to filter the listings based on the type
    if (type === undefined || type === "false") {
      type = { $in: ["sale", "rent"] }; //This is used to return all listings, both rent and sale
    }

    const searchTerm = req.query.searchTerm || ""; //This is used to filter the listings based on the searchTerm

    const sort = req.query.sort || "createdAt"; //This is used to sort the listings based on the sort parameter

    const order = req.query.order || "desc"; //This is the default order of the listings

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, //This is used to search the listings based on the searchTerm
      //regex lets you search for a string within a string. $options: 'i' is used to make the search case insensitive
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order }) //This is used to sort the listings based on the sort parameter
      .limit(limit) //This is used to limit the number of listings returned
      .skip(startIndex); //This is used to skip the first n number of listings

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
