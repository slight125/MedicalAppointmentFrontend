
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/themeSlice';
import { FiMenu, FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi';
import { useResponsive } from '../../hooks/useResponsive';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      default:
        return '/user-dashboard';
    }
  };

  const userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

  return (
    <div className="bg-base-100/90 backdrop-blur-md shadow-lg border-b border-base-300 px-4 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle for mobile can be implemented if needed */}
            
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:inline">
                MedApp
              </span>
              <span className="font-bold text-xl text-gray-900 dark:text-white sm:hidden">
                MA
              </span>
            </Link>
          </div>

          {/* Center navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/" className="px-4 py-2 rounded-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link to="/about" className="px-4 py-2 rounded-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium">
              About
            </Link>
            <Link to="/contact" className="px-4 py-2 rounded-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200 font-medium">
              Contact
            </Link>
            {isAuthenticated && (
              <Link 
                to={getDashboardLink()} 
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
              >
                <h2 className="text-xl font-bold capitalize tracking-wide text-gray-900 dark:text-white drop-shadow">
                  {userRole} Dashboard
                </h2>
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
              <button
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <FiUser className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstname} {user?.lastname}
                  </span>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link 
                      to={getDashboardLink()} 
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
