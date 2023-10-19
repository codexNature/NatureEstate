import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/Signin';
import SignUp from './Pages/SignUp';
import About from './Pages/About';
import Profile from './pages/Profile';
import Header from './Components/Header';


export default function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
    </BrowserRouter>
  )
}
