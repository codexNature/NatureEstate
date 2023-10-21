import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signinStart, signinFailure, signinSuccess } from '../redux/user/userSlice';
import OAuth from '../Components/OAuth';




export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value, // Use e.target.value to capture the input value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //setLoading(true)
      dispatch(signinStart());  // This will set loading to true. replaced above code.


      // This is sending a request to the backend server (signin route)
      // Make sure you specify the correct URL
      const res = await fetch('/Backend/auth/signin', //This is called from auth.route.js
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

      const data = await res.json(); // This will convert the response from the backend to JSON
      console.log(data);
      if (data.success === false) {
        //setLoading(false);
        //setError(data.message);
        dispatch(signinFailure(data.message)); // This will set loading to false and error to the error message from the backend. replaced above code.
        return;
      }
      //setLoading(false);
      //setError(null);
      dispatch(signinSuccess(data)); // This will set loading to false and error to null. replaced above code.
      navigate('/')

    } catch (error) {
      //setLoading(false);
      //setError(error.message);
      dispatch  (signinFailure(error.message)); // This will set loading to false and error to the error message from the backend. replaced above code.
    }

  };



  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit}
        className='flex flex-col gap-4'>
        

        <input
          type="email"
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button 
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg 
        uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={"/signup"}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
};