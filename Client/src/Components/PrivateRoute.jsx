import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector(state => state.user);
  return currentUser ? <Outlet /> : <Navigate to= '/signin'/> // This will redirect the user to the signin page if they are not authenticated.
    
    //<img className=' rounded-full h-15 w-15 object-cover' src={currentUser.avatar} alt="Profile" />
    
  
}
