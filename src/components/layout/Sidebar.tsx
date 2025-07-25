
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiFileText, 
  FiMessageSquare, 
  FiBarChart,
  FiSettings,
  FiX
} from 'react-icons/fi';
import { useResponsive } from '../../hooks/useResponsive';

interface SidebarProps {
  userRole: 'user' | 'doctor' | 'admin';
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();
  const { isMobile } = useResponsive();

  const getMenuItems = () => {
    const baseItems = [
      { path: `/${userRole}-dashboard`, icon: FiHome, label: 'Dashboard' },
      { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    ];

    switch (userRole) {
      case 'user':
        return [
          ...baseItems,
          { path: '/dashboard/appointments', icon: FiCalendar, label: 'My Appointments' },
          // Move Find Doctors directly below My Appointments
          { path: '/dashboard/find-doctors', icon: FiUsers, label: 'Find Doctors' },
          { path: '/dashboard/prescriptions', icon: FiFileText, label: 'Prescriptions' },
          { path: '/dashboard/medical-history', icon: FiFileText, label: 'Medical History' },
          { path: '/dashboard/support', icon: FiMessageSquare, label: 'Support' },
          { path: '/dashboard/payments', icon: FiFileText, label: 'Payments' },
        ];
      case 'doctor':
        return [
          ...baseItems,
          { path: '/doctor-dashboard/appointments', icon: FiCalendar, label: 'Appointments' },
          { path: '/doctor-dashboard/patients', icon: FiUsers, label: 'Patients' },
          { path: '/doctor-dashboard/prescriptions', icon: FiFileText, label: 'Prescriptions' },
          { path: '/doctor-dashboard/complaints', icon: FiMessageSquare, label: 'Complaints' },
        ];
      case 'admin':
        return [
          ...baseItems,
          { path: '/admin-dashboard/users', icon: FiUsers, label: 'Manage Users' },
          { path: '/admin-dashboard/analytics', icon: FiBarChart, label: 'Analytics' },
          { path: '/admin-dashboard/complaints', icon: FiMessageSquare, label: 'Tickets' },
          { path: '/admin-dashboard/reports', icon: FiFileText, label: 'Reports' },
          { path: '/admin-dashboard/settings', icon: FiSettings, label: 'Settings' },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const closeSidebar = () => {
    // Implement sidebar close logic if needed
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar with glassmorphism, shadow, and vibrant accent */}
      <div className={`
        fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out
        ${isMobile ? 'w-64' : 'w-64 lg:w-72 xl:w-80'}
        translate-x-0
        lg:relative lg:translate-x-0
        bg-sidebar/90 backdrop-blur-xl border-r border-base-300 shadow-2xl
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-base-300 bg-base-200/90 backdrop-blur-md">
            <h2 className="text-xl font-bold capitalize tracking-wide text-gray-900 dark:text-white drop-shadow">
              {userRole} Dashboard
            </h2>
            {isMobile && (
              <button
                onClick={closeSidebar}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="menu menu-vertical gap-3">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeSidebar}
                      className={`
                        flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-base transition-all duration-200 shadow-sm
                        ${isActive
                          ? 'bg-gradient-to-r from-primary via-secondary to-accent text-strong-sidebar shadow-lg scale-[1.04]'
                          : 'bg-base-100/80 text-strong-sidebar hover:bg-primary/10 hover:text-primary hover:scale-[1.03]'
                        }
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      `}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-primary dark:text-blue-400'}`} />
                      <span className="text-base lg:text-lg tracking-wide font-bold text-gray-900 dark:text-white">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-base-300 bg-base-200/90 backdrop-blur-md">
            <div className="text-xs text-gray-600 dark:text-gray-300 text-center tracking-wide">
              <span className="font-bold text-primary">MedApp</span> <span className="font-medium">v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
