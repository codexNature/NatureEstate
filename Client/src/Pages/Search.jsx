import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../Components/ListingItem";

export default function Search() {
  const navigate = useNavigate(); // This will be used to navigate to the search page.
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    types: "all",
    furnished: false,
    parking: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  }); // This will be used to store the data that will be used to filter the listings. The default values are set to the values that will be used to get all the listings.

  const [loading, setLoading] = useState(true); // This will be used to check if the listings are loading.
  const [listings, setListings] = useState([]); // This will be used to store the listings. The default value is an empty array.
  const [showMore, setShowMore] = useState(false); // This will be used to check if the show more button is clicked.

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // This will get the search term from the url ans save it in the url variable.
    const searchTermFromUrl = urlParams.get("searchTerm"); // This will get the search term from the url to input it in the search bar.
    const typesFromUrl = urlParams.get("types"); // This will get the type from the url to set the type in the sidebar.
    const furnishedFromUrl = urlParams.get("furnished"); // This will get the furnished from the url to set the furnished in the sidebar.
    const parkingFromUrl = urlParams.get("parking"); // This will get the parking from the url to set the parking in the sidebar.
    const offerFromUrl = urlParams.get("offer"); // This will get the offer from the url to set the offer in the sidebar.
    const sortFromUrl = urlParams.get("sort"); // This will get the sort from the url to set the sort in the sidebar.
    const orderFromUrl = urlParams.get("order"); // This will get the order from the url to set the order in the sidebar.

    if (
      searchTermFromUrl ||
      typesFromUrl ||
      furnishedFromUrl ||
      parkingFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typesFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      }); // This will set the search term, type, parking, furnished, offer, sort and order to the search term, type, parking, furnished, offer, sort and order that is in the url. If the search term, type, parking, furnished, offer, sort or order is not in the url, the search term, type, parking, furnished, offer, sort or order will be set to the default value.
    }

    const fetchListings = async () => {
      setLoading(true); // This will set the loading to true.
      setShowMore(false); // This will set the show more to false.
      const searchQuery = urlParams.toString(); // This will convert the search term to a string.
      const res = await fetch(`/Backend/listing/get?${searchQuery}`); // This will fetch the listings from the backend.
      const data = await res.json(); // This will convert the response to json.
      if (data.length > 8) {
        setShowMore(true); // This will set the show more to true if the length of the data is greater than 8.
      } else{
        setShowMore(false); // This will set the show more to false if the length of the data is less than 8.
      }
      setListings(data); // This will set the listings to the data that we got from the backend.
      setLoading(false); // This will set the loading to false.
    };

    fetchListings(); // This will run the fetchListings function.
  }, [location.search]); // This will run when the url changes.

  const handleChange = (e) => {
    if (
      e.target.id === "all" || // the id here is the id of the checkbox
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, types: e.target.id });
    } // This will check if the type is all, rent or sale and set the type to the type that the user selected.

    if (e.target.id === "searchTerm") {
      // the id here is the id of the input
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    } // This will set the search term to the search term that the user entered.

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      }); // This will check if the parking, furnished or offer is true and set the parking, furnished or offer to true if it is true or false if it is false. The reason why we are checking if the parking, furnished or offer is true or false is because the value of the checkbox is a string and not a boolean.
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at"; // This will get the sort value from the value of the select tag. The value of the select tag is the sort value and the order value separated by an underscore. If the value of the select tag is empty, the sort value will be set to created_at.
      const order = e.target.value.split("_")[1] || "desc"; // This will get the order value from the value of the select tag. The value of the select tag is the sort value and the order value separated by an underscore. If the value of the select tag is empty, the order value will be set to desc.
      setSidebarData({ ...sidebarData, sort, order }); // This will set the sort and order to the sort and order that the user selected.
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // This will prevent the default behaviour of the form which is to refresh the page when the form is submitted.
    const urlParams = new URLSearchParams(); // This will get the search term from the url ans save it in the url variable.
    urlParams.set("searchTerm", sidebarData.searchTerm); // This will set the search term in the url to the search term that the user entered.
    urlParams.set("types", sidebarData.types); // This will set the type in the url to the type that the user selected.
    urlParams.set("furnished", sidebarData.furnished); // This will set the furnished in the url to the furnished that the user selected.
    urlParams.set("parking", sidebarData.parking); // This will set the parking in the url to the parking that the user selected.
    urlParams.set("offer", sidebarData.offer); // This will set the offer in the url to the offer that the user selected.
    urlParams.set("sort", sidebarData.sort); // This will set the sort in the url to the sort that the user selected.
    urlParams.set("order", sidebarData.order); // This will set the order in the url to the order that the user selected.
    const searchQuery = urlParams.toString(); // This will convert the search term to a string.
    navigate(`/search?${searchQuery}`); // This will navigate to the search page with the search term in the url.
  };

    const onShowMoreClick = async () => {
    const numberOfListings = listings.length; // This will get the number of listings.
    const startIndex = numberOfListings; // This will get the start index.
    const urlParams = new URLSearchParams(location.search); // This will get the search term from the url ans save it in the url variable.
    urlParams.set("startIndex", startIndex); // This will set the start index in the url to the start index.
    const searchQuery = urlParams.toString(); // This will convert the search term to a string.
    const res = await fetch(`/Backend/listing/get?${searchQuery}`); // This will fetch the listings from the backend.
    const data = await res.json(); // This will convert the response to json.
    if (data.length < 9) {
      setShowMore(false); // This will set the show more to false if the length of the data is less than 9.
    }
    setListings([...listings, ...data]); // TThis will keep the old listings and add the new listings to the listings.
  }; 

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2 ">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className=" font-semibold">Types:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sidebarData.types === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sidebarData.types === "rent"} // This will check if the type is rent.
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sidebarData.types === "sale"} // This will check if the type is sale.
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sidebarData.offer} // This will check if the offer is true.
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sidebarData.parking} // This will check if the parking is true.
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sidebarData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"cfreated_at_desc"}
              id="sort_order"
              className="border-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No Listing found!</p> // This will check if the listings are not loading and if the length of the listings is 0 and if it is, it will display a message saying that no listings were found.
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p> // This will check if the listings are loading and if it is, it will display a message saying that the listings are loading.
          )}

          {
            !loading &&
              listings &&
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              )) // This will check if the listings are not loading and if the listings exist and if it does, it will map through the listings and display the listings.
          }
          {showMore && (
            <button
              onClick={() => {
                onShowMoreClick();
              }}
              className="text-green-700 hover:underline p-7 w-full text-center"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
