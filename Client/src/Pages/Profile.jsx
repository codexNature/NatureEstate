import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutSuccess,
  signOutStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";


export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0); // This will be used to show the progress of the file upload
  const [fileUploafError, setFileUploafError] = useState(false); // This will be used to show any errors that occur during the file upload
  const [formData, setFormData] = useState({}); // This will be used to store the form data
  const [updateSuccess, setUpdateSuccess] = useState(false); // This will be used to show a success message when the user updates their profile
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file); // This will call the handleFileUpload function when the file state changes
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app); // This will get the Firebase Storage reference
    const fileName = new Date().getTime() + file.name; // This will create a unique file name for the file
    const storageRef = ref(storage, fileName); // This will create a reference to the file in Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file); // This will upload the file to Firebase Storage

    uploadTask.on(
      "state_changed", // This will show us the progress of the upload and allow us to handle errors
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploafError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        }); // This will get the download URL of the file that was just uploaded
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }; // This will update the formData state when the user types in the form, based on the input's id the value will be updated.

  const handleSubmit = async (e) => {
    e.preventDefault(); // This will prevent the page from reloading when the form is submitted.
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/Backend/user/update/${currentUser._id}`, { // This will call the update user route in the backend. update user route is in the user.route.js file
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message)); // This is from the userSlice.js file. This will update the error state with the error message
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/Backend/user/delete/${currentUser._id}`, { // This will call the delete user route in the backend. delete user route is in the user.route.js file
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message)); // This is from the userSlice.js file. This will update the error state with the error message
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`/Backend/auth/signout`); // This will call the signout route in the backend. signout route is in the auth.route.js file
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message)); // This is from the userSlice.js file. This will update the error state with the error message
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])} // This will capture the file that the user selects]))
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="self-center mt-2 rounded-full h-24 w-24 object-cover cursor-pointer"
          src={formData.avatar || currentUser.avatar} // This will show the user's current profile picture
          alt="Profile"
        />
        <p className="text-sm self-center">
          {
            fileUploafError ? (
              <span className="text-red-700">
                Error Uploading Image.(Image must be less than 2MB){" "}
              </span>
            ) : filePercent > 0 && filePercent < 100 ? (
              <span className="text-slate-700">
                {`Image uploading ${filePercent}%`}{" "}
              </span>
            ) : filePercent === 100 ? (
              <span className="text-green-700">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            ) // This will show the progress of the file upload
          }
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white hover:opacity-95 disabled:opacity-80 rounded-lg p-3 uppercase"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>

      <p className="text-red=700 mt-5">{error ? error : ""}</p>
      <p className="text-green=700 mt-5">
        {updateSuccess ? "User profile, updated suucessfully!" : ""}
      </p>
    </div>
  );
}

//Line 12 is used to add a file input to the page. This input will be hidden from the user. We will use this input to allow the user to upload a new profile picture
