import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signinSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
//import GoogleLogin from 'react-google-login';


export default function OAuth() {
  const dispatch = useDispatch();//this is to initialize the dispatch function.
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
        const provider = new GoogleAuthProvider()
      const auth = getAuth(app); //this is from firebase.js

      const result = await signInWithPopup(auth, provider);

      
      const res = await fetch('/Backend/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: result.user.displayName, 
          email: result.user.email, 
          photo: result.user.photoURL}),
      },);
        const data = await res.json()
        dispatch  (signinSuccess(data)); // This will set loading to false and error to null. replaced above code.
        navigate('/')
    } catch (error) {
      console.log('could not authenticate with google', error);
      
    }
  }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with Google</button>
  )
}



// const clientId = 'YOUR_CLIENT_ID';

// function OAuth() {
//   const onSuccess = (response) => {
//     console.log('Login Success:', response.profileObj);
//   };

//   const onFailure = (error) => {
//     console.log('Login Failure:', error);
//   };

//   return (
//     <GoogleLogin
//       clientId={clientId}
//       buttonText="Login with Google"
//       onSuccess={onSuccess}
//       onFailure={onFailure}
//       cookiePolicy={'single_host_origin'}
//     />
//   );
// }

// export default OAuth;
