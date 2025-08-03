import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ token, setToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => setIsOpen(!isOpen);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login'); // Optional: navigate after logout
  };

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4  flex justify-between items-center">
        {/* Logo Image */}
        <Link to="/">
          <img
            src="../src/assets/logo.png"
            alt="BlogHub Logo"
            className="w-20 h-20 object-contain "
          />
        </Link>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={handleToggle} className="text-white focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`flex-col md:flex-row md:flex gap-5 space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0 items-start md:items-center w-full md:w-auto ${isOpen ? 'flex' : 'hidden md:flex'}`}
        >
          <Link to="/" className="hover:text-white/90 transition duration-200">
            Home
          </Link>
          <Link to="/profile" className="hover:text-white/90 transition duration-200">
            Profile
          </Link>

          {token ? (
            <button
              onClick={handleLogout}
              className="hover:text-red-100 transition duration-200 cursor-pointer "style={{color:"red"}}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-white/90 transition duration-200">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
