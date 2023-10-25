import { 
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable 
} from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import { set } from 'mongoose';


const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formdata, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
    console.log(formdata)
  const handleImageSubmit = (e) => {
      if (files.length > 0 && files.length + formdata.imageUrls.length < 7) {
          setUploading(true);
          setImageUploadError(false);
          const promises = [];

          for (let i = 0; i < files.length; i++) {
            promises.push(uploadImage(files[i]));
          }
          Promise.all(promises).then((urls) => {
            setFormData({
              ...formdata, 
              imageUrls: formdata.imageUrls.concat(urls), // This will get the download URL of the file that was just uploaded
          });
          setImageUploadError(false);
          setUploading(false);
      })
      .catch((err) => {
        setImageUploadError("Image Upload Failed (2mb max per image)");
        setUploading(false);
      });
    }else{
      setImageUploadError("You can only upload 6 images at a Listing");
      setUploading(false);
    }
  };
  

  const uploadImage = async(file) => {
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
            console.log('Upload is ' + progress + '% done)');
          },
          (error)=>{
            reject(error);
          },
          ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            });
          }
        )
    });
  };

  const handleRemoveImage = (index) => {
      setFormData({
        ...formdata,
        imageUrls: formdata.imageUrls.filter((_, i) => i !== index),
      });
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
    <form className='flex flex-col sm:flex-row gap-3'>
        <div className="flex flex-col gap-4 flex-1">
            <input 
              type="text" 
              placeholder='Name' 
              className='border p-3 rounded-lg' 
              id='name' 
              maxLength="62" 
              minLength="10" 
              required
              />

            <textarea 
              type="text" 
              placeholder='Description' 
              className='border p-3 rounded-lg' 
              id='description' 
              required
              />

            <input 
              type="text" 
              placeholder='Address' 
              className='border p-3 rounded-lg' 
              id='address' 
              maxLength="62" 
              minLength="10" 
              required
              />
        
        <div className='flex gap-8 flex-wrap'>
            <div className='flex gap-2'>
              <input type="checkbox" id="sale" className='w-5' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="rent" className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="parking" className='w-5' />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="furnished" className='w-5' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="offer" className='w-5' />
              <span>Offer</span>
            </div>
        </div>
        <div className='flex flex-wrap gap-6'>
        <div className='flex items-center gap-2'>
            <input 
              type="number" 
              id="bedroom" 
              min="1" 
              max="10" 
              required 
              className='p-3 border border-gray-300 rounded-lg' 
              />
            <span>Beds</span>
        </div>
        <div className='flex items-center gap-2'>
            <input 
              type="number" 
              id="bathrooms" 
              min="1" 
              max="10" 
              required 
              className='p-3 border border-gray-300 rounded-lg'
              />
            <span>Baths</span>
        </div>
        <div className='flex items-center gap-2'>
            <input 
              type="number" 
              id="regularPrice" 
              min="1" max="10" 
              required 
              className='p-3 border border-gray-300 rounded-lg' 
              />

            <div className='flex flex-col items-center'>
              <span>Regular Price</span>
              <p className='text-xs'>($/Month)</p>
            </div>
            
        </div>
        <div className='flex items-center gap-2'>
            <input 
              type="number" 
              id="discountedPrice" 
              min="1" 
              max="10" 
              required 
              className='p-3 border border-gray-300 rounded-lg' 
              />

            <div className='flex flex-col items-center'>
              <span>Discounted Price</span>
              <p className='text-xs'>($/Month)</p>
            </div>
        </div>
        </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max-6) </span>
          </p>
          <div className='flex gap-4'>
            <input 
              onChange={(e)=>setFiles(e.target.files)}
              className='p-3 border border-grey-300 rounded-lg w-full' 
              type="file" 
              id="images" 
              accept='images/*' 
              multiple />
            <button
              type='button' 
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
              {uploading ? 'Uploading...' : 'Upload'}
              </button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {
            formdata.imageUrls.length > 0 && 
            formdata.imageUrls.map((url, index) => (
              <div 
                key={url}
                className='flex justify-between p-3 border items-center'>
              <img 
                className='w-20 h-20 object-contain rounded-lg' 
                src={url} 
                alt="Listing" 
                />
                <button
                  type='button' 
                  onClick={()=> handleRemoveImage(index)}
                  className=' text-red-700 p-3 rounded-lg uppercase hover:opacity-75'>
                  Delete
                </button>
                </div>
            ))
          };
          <button 
        className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >Create Listing
        </button>
        </div>
        
    </form>
    </main>
  );
};

export default CreateListing
