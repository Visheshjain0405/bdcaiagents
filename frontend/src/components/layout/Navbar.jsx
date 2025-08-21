// --- frontend/components/Navbar.jsx ---
import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUsers, FaPlayCircle, FaBuilding, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileOpen(false);
  };

  const menuItems =
    userRole === 'super_user'
      ? [
        { name: 'Dashboard', path: '/superadmindashboard', icon: FaUsers },
        { name: 'Organization', path: '/superadminorganization', icon: FaBuilding },
        { name: 'Agents', path: '/superadminagents', icon: FaPlayCircle },
      ]
      : userRole === 'orgadmin'
        ? [
          { name: 'Dashboard', path: '/organization-dashboard', icon: FaUsers },
          // { name: 'Users', path: '/organization-dashboard/users', icon: FaBuilding },
          { name: 'Agents', path: '/organization-dashboard/agents', icon: FaPlayCircle },
        ]
        : [];



  return (
    <nav className="bg-white shadow-lg p-4 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">BDC AI Agent</div>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="flex items-center p-2">
            {isMobileMenuOpen ? (
              <FaTimes className="text-gray-700 text-xl" />
            ) : (
              <FaBars className="text-gray-700 text-xl" />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-gray-600 hover:text-indigo-600 transition duration-300 ${isActive ? 'text-indigo-600 font-semibold' : ''
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-md hover:scale-105 transition duration-300"
            >
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                {user?.id ? user.id.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl">
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-gray-600 hover:text-indigo-600 transition duration-300 flex items-center ${isActive ? 'text-indigo-600 font-semibold' : ''
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon && <item.icon className="mr-2" />}
                {item.name}
              </NavLink>
            ))}
            <Link
              to="/profile"
              className="text-gray-600 hover:text-indigo-600 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-left text-gray-600 hover:text-indigo-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
