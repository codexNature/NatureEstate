import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  // listing is the prop passed in from the parent component in search.jsx in the map function
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing.id}`}>
        <img
          src={listing.imageURLs[0] || "https://landwey.ng/wp-content/uploads/2019/10/house-and-key-on-wooden-table-on-sunlight-background-building-concept-concept-of-selling-real-estate-1138190269-563869f4765c46a3a194e83d80ca61eb.jpg" } 
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300 ease-in-out"
        />
        <div className=" p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-2">
            <MdLocationOn className="h-5 w-5 text-green-700" />
            <p className="text-sm text-grey-600 truncate w-full">
              {listing.address}{" "}
            </p>
          </div>
          <div className="">
            <p className="text-sm text-gray -600 line-clamp-2">
              {listing.description}{" "}
            </p>
            <p className="text-slate-500 mt-2 font-semibold">
              $
              {listing.offer
                ? listing.discountedPrice.toLocaleString("en-us")
                : listing.regularPrice.toLocaleString("en-us")}
              {listing.type === "rent" && "/month"}
            </p>
            <div className="flex gap-3 text-slate-700">
              <div className="font-bold text-xs">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </div>
              <div className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
