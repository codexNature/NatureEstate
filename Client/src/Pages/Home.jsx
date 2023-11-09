import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../Components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/Backend/listing/get?offer=true&limit=4`); // fetch all listings, using search query
        const data = await res.json(); // convert response to json
        setOfferListings(data); // set state to data
        fetchRentListings(); // fetch rent listings after offer listings
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/Backend/listing/get?type=rent&limit=4`); // fetch all listings, using search query
        const data = await res.json(); // convert response to json
        setRentListings(data); // set state to data
        fetchSaleListings(); // fetch sale listings after rent listings
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/Backend/listing/get?type=sale&limit=4`); // fetch all listings, using search query
        const data = await res.json(); // convert response to json
        setSaleListings(data); // set state to data
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">dream home</span>
          <br />
          with ease.
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Trust us at Nature Estate to find your next home, we have the best
          deals in town.
          <br />
          We have a wide range of properties to choose from, from houses to
          apartments.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Start here...
        </Link>
      </div>

      {/* swiper */}

      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageURLs[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer sale ans rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                to="/search?offer=true&type=false"
                className="text-blue-800 font-bold hover:underline"
              >
                View more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map(
                (listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ) // map through listings and display them
              )}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                to="/search?type=rent"
                className="text-blue-800 font-bold hover:underline"
              >
                View more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map(
                (listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ) // map through listings and display them
              )}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                to="/search?type=sale"
                className="text-blue-800 font-bold hover:underline"
              >
                View more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map(
                (listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ) // map through listings and display them
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
