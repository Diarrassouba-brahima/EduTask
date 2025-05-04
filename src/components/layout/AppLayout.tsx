import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, LogOut, User, BookOpen, Home, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getNotificationsForUser, markNotificationAsRead } from '../../services/data-service';
import { Notification } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get notifications for current user
  const notifications = user ? getNotificationsForUser(user.id) : [];
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.linkTo) {
      navigate(notification.linkTo);
    }
    setShowNotifications(false);
  };
  
  const navigateTo = (path: string) => {
    navigate(path);
    setShowMobileMenu(false);
  };
  
  const navItems = [
    {
      label: 'Dashboard',
      icon: <Home size={20} />,
      path: '/',
    },
    ...(user?.role === 'teacher' ? [
      {
        label: 'My Assignments',
        icon: <BookOpen size={20} />,
        path: '/assignments',
      }
    ] : [
      {
        label: 'Assignments',
        icon: <BookOpen size={20} />,
        path: '/assignments',
      }
    ]),
    {
      label: 'Profile',
      icon: <User size={20} />,
      path: '/profile',
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header/navigation bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and mobile menu button */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">EduTask</h1>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigateTo(item.path)}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* User and Notifications */}
            <div className="flex items-center">
              {/* Notifications */}
              <div className="ml-4 relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-rose-500 text-xs text-white flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`w-full text-left block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                                notification.read ? 'bg-white' : 'bg-indigo-50'
                              }`}
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Logout */}
              <div className="ml-4">
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Log out</span>
                  <LogOut size={20} />
                </button>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden ml-4">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Open mobile menu</span>
                  {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className="w-full flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;