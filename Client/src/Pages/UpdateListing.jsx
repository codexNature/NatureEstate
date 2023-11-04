import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase"; // This will be used to upload the file to Firebase Storage
import { useSelector } from "react-redux"; // This will be used to get the user from the Redux store
import { useNavigate, useParams } from "react-router-dom"; // This will be used to navigate to a different route

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate(); // We initialize the navigate hook
  const params = useParams(); // We initialize the useParams hook
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false); // This will be used to show any errors that occur during the file upload
  const [loading, setLoading] = useState(false); // This will be used to show a success message when the user updates their profile
  const { currentUser } = useSelector((state) => state.user); // This will be used to show a success message when the user updates their profile
  useEffect(() => {

    const fetchListing = async () => {
          const listingId = params.listingId;
          const res = await fetch(`/Backend/listing/get/${listingId}`);
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
          setFormData(data);
          
  }

    fetchListing();
}, [params.listingId]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(uploadImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls), // This will get the download URL of the file that was just uploaded
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload Failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError(
        "Please upload at least one image and no more than 6"
      );
      setUploading(false);
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app); // This will get the Firebase Storage reference
      const fileName = new Date().getTime() + file.name; // This will create a unique file name for the file
      const storageRef = ref(storage, fileName); // This will create a reference to the file in Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file); // This will upload the file to Firebase Storage
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + Math.round(progress) + "% done)");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index),
    });
  };

  const handleChange = (event) => {
    if (event.target.id === "sale" || event.target.id === "rent") {
      setFormData({
        ...formData,
        type: event.target.id,
      });
    } // This will update the formData state when the user types in the form, based on the input's id the value will be updated.

    if (
      event.target.id === "parking" ||
      event.target.id === "furnished" ||
      event.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [event.target.id]: event.target.checked,
      });
    } // This will update the formData state when the user types in the form, based on the input's id the value will be updated.

    if (
      event.target.id === "bedrooms" ||
      event.target.id === "bathrooms" ||
      event.target.id === "regularPrice" ||
      event.target.id === "discountedPrice"
    ) {
      setFormData({
        ...formData,
        [event.target.id]: event.target.value,
      });
    } // This will update the formData state when the user types in the form, based on the input's id the value will be updated.

    if (
      event.target.id === "name" ||
      event.target.id === "description" ||
      event.target.id === "address"
    ) {
      setFormData({
        ...formData,
        [event.target.id]: event.target.value,
      });
    } // This will update the formData state when the user types in the form, based on the input's id the value will be updated.
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // This will prevent the default form behavior of reloading the page
    try {
      if (formData.imageURLs.length < 1)
        return setError("Please upload at least one image"); // This will check if the user has uploaded at least one image
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError(
          "Discounted price cannot be greater than regular price"
        );
      setLoading(true);
      setError(false);
      const res = await fetch(`/Backend/listing/update/${params.listingId}`, {
        // This will send a POST request to the backend. create is the route we created in listing.route.js
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json(); // This will convert the response to JSON
      setLoading(false);
      if (data.success === false) {
        setError(data.message); // This is from the userSlice.js file. This will update the error state with the error message
      }
      navigate(`/listing/${data._id}`); // This will redirect the user to the listing page
    } catch (error) {
      setError(error.message); // This is from the userSlice.js file. This will update the error state with the error message
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-8 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="40"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                <p className="text-xs">($/Month)</p>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min="0"
                  max="100000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <span>Discounted Price</span>
                  <p className="text-xs">($/Month)</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max-6){" "}
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-grey-300 rounded-lg w-full"
              type="file"
              id="images"
              accept="images/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  className="w-20 h-20 object-contain rounded-lg"
                  src={url}
                  alt="Listing"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className=" text-red-700 p-3 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
