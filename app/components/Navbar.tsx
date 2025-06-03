'use client'
import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, ArrowRight, Github, MessageCircle, BarChart3, Target, Database, User, LogOut, LogIn } from 'lucide-react';
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

 useEffect(() => {
  console.log("Session:", session);
}, [session]);


  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3
    },
    {
      name: 'Campaigns',
      href: '/campaigns',
      icon: Target,
    },
    {
      name: "Manage Data",
      href: "/manage-data",
      icon: Database
    },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    setIsUserDropdownOpen(false);
  };

  const handleSignIn = () => {
    signIn("google");
  };

  // Animation variants for the dropdown
  const wrapperVariants = {
    open: {
      scaleY: 1,
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.2,
        ease: "easeOut"
      },
    },
    closed: {
      scaleY: 0,
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        duration: 0.15,
        ease: "easeIn"
      },
    },
  };

  const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      },
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      },
    },
  };

  const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -5 },
  };

  type DropdownOptionProps = {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
    className?: string;
  };

  const DropdownOption: React.FC<DropdownOptionProps> = ({ icon: Icon, text, onClick, className = "" }) => {
    return (
      <motion.button
        variants={itemVariants}
        onClick={onClick}
        className={`flex items-center space-x-3 w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${className}`}
      >
        <motion.span variants={actionIconVariants} className="flex-shrink-0">
          <Icon className="h-4 w-4" />
        </motion.span>
        <span>{text}</span>
      </motion.button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">crm.io</span>
            </a>
          </div>

          {/* Navigation Items - Only show if logged in */}
          {session && (
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.name} className="relative">
                    <a
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group relative"
                    >
                      <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>{item.name}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
            ) : session ? (
              <motion.div
                className="relative"
                animate={isUserDropdownOpen ? "open" : "closed"}
              >
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 cursor-pointer bg-white text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-sm flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium max-w-32 truncate">
                    {session?.user?.name || session?.user?.email}
                  </span>
                  <motion.span variants={iconVariants}>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  </motion.span>
                </button>

                {/* Animated User Dropdown */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={wrapperVariants}
                      style={{ originY: "top" }}
                      className="absolute right-0 mt-2 w-64 bg-white shadow-xl border border-gray-200 z-50 overflow-hidden"
                    >
                      {/* User Info Header */}
                      <motion.div
                        variants={itemVariants}
                        className="px-4 py-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border-b border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-sm flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{session?.user?.name}</p>
                            <p className="text-xs text-gray-600 truncate">{session?.user?.email}</p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Dropdown Options */}
                      <div className="py-1">
                        <DropdownOption
                          icon={LogOut}
                          text="Sign Out"
                          onClick={handleSignOut}
                          className="text-red-600 hover:text-red-700 cursor-pointer hover:bg-red-50"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* User is not logged in */
              <Button
                onClick={handleSignIn}
                className="flex items-center space-x-2 cursor-pointer bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In with Google</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for user dropdown */}
      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;