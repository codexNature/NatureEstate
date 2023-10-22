import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef, useEffect } from 'react';
import  { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';


export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser} = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0); // This will be used to show the progress of the file upload
  const [fileUploafError, setFileUploafError] = useState(false); // This will be used to show any errors that occur during the file upload
  const [formData, setFormData] = useState({}); //
 


  useEffect(()=> {
    if(file)  {
      handleFileUpload(file);// This will call the handleFileUpload function when the file state changes
    }
  
  }, [file]);

  const handleFileUpload = (file) =>  {
      const storage = getStorage(app);// This will get the Firebase Storage reference
      const fileName = new Date().getTime() + file.name;// This will create a unique file name for the file
      const storageRef = ref(storage, fileName);// This will create a reference to the file in Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file);// This will upload the file to Firebase Storage

      uploadTask.on('state_changed', // This will show us the progress of the upload and allow us to handle errors
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error)=> {
          setFileUploafError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
            setFormData({...formData, avatar: downloadURL})
      }) // This will get the download URL of the file that was just uploaded
    })

};
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
      <input 
        onChange={(e)=> setFile(e.target.files[0])} // This will capture the file that the user selects]))
        type="file" 
        ref={fileRef} 
        hidden accept='image/*' 
        />  
        <img 
          onClick={()=>fileRef.current.click()} 
          className='self-center mt-2 rounded-full h-24 w-24 object-cover cursor-pointer' 
          src={formData.avatar || currentUser.avatar} // This will show the user's current profile picture
          alt="Profile" 
          />
          <p className='text-sm self-center'>
            {fileUploafError ?
              <span className='text-red-700' >
              Error Uploading Image.(Image must be less than 2MB) </span> :
              filePercent > 0 && filePercent < 100 ? (
                <span className='text-slate-700'>
                {`Image uploading ${filePercent}%`} </span>
              ) :
              filePercent === 100 ? (
                <span className='text-green-700' >Image successfully uploaded!</span>): "" // This will show the progress of the file upload
            }
          </p>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' />
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' />
        <input type="text" placeholder='password' className='border p-3 rounded-lg' id='' />
        <button className='bg-slate-700 text-white hover:opacity-95 disabled:opacity-80 rounded-lg p-3 uppercase'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
};




//Line 12 is used to add a file input to the page. This input will be hidden from the user. We will use this input to allow the user to upload a new profile picture