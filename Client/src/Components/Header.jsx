import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user); // state=user created and saved in userSlice.js
  const [searchTerm, setSearchTerm] = useState(""); // This is the search term that will be used to search for properties.
  const navigate = useNavigate(); // This will be used to navigate to the search page.

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search); // This will get the search term from the url ans save it in the url variable.
    urlParams.set("searchTerm", searchTerm); // This will set the search term in the url to the search term that the user entered.
    const searchQuery = urlParams.toString(); // This will convert the search term to a string.
    navigate(`/search?${searchQuery}`); // This will navigate to the search page with the search term in the url.
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // This will get the search term from the url ans save it in the url variable.
    const searchTermFromUrl = urlParams.get("searchTerm"); // This will get the search term from the url to input it in the search bar.
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // This will set the search term in the url to the search term that the user entered.
    }

  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Nature</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="text-slate-700 hover:text-slate-500">
            <FaSearch className="bg-transparent" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="Profile"
              /> // This will show the user avatar if the user is logged in, the avatar is stored in the redux store.
            ) : (
              <li className="text-slate-700 hover:underline">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
