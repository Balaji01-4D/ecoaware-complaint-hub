
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { LogOut, Home, Plus, FileText, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`
      sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300
      ${isDarkMode 
        ? 'bg-gray-900/80 border-gray-800' 
        : 'bg-white/80 border-gray-200'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}
            `}>
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span>EcoAware</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={Home} label="Home" />
            {user && (
              <>
                <NavLink to="/complaints/create" icon={Plus} label="Report" />
                <NavLink to="/complaints/my" icon={FileText} label="My Reports" />
                {user.role === 'admin' && (
                  <NavLink to="/admin/complaints" icon={Shield} label="Admin" />
                )}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${isDarkMode 
                      ? 'text-red-400 hover:bg-red-900/20' 
                      : 'text-red-600 hover:bg-red-50'
                    }
                  `}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth/login"
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isDarkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                  `}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: any; label: string }> = ({ to, icon: Icon, label }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Link
      to={to}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
        transition-colors duration-200
        ${isDarkMode 
          ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
