'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { AddSchoolForm } from '@/components/schools/AddSchoolForm';
import { SchoolGrid } from '@/components/schools/SchoolGrid';
import { Plus, School, Users, MapPin, LogOut, ChevronDown, Search, Filter } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import LoginModal from '@/components/loginmodal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({ totalSchools: 0, activeSchools: 0, citiesCovered: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/schools/get');
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); 
    setIsLoggedIn(!!token);
    if (email) setUserEmail(email);
  }, [refreshTrigger]);

  const handleSchoolAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsModalOpen(false);
  };

  const handleAddClick = () => {
    if (isLoggedIn) setIsModalOpen(true);
    else setIsLoginModalOpen(true);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setUserEmail('');
    setDropdownOpen(false);
  };

  // Click-away for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (dropdownOpen && target && !target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const firstLetter = userEmail.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        className: 'bg-white shadow-lg border border-gray-200 rounded-xl',
        style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500 }
      }} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-teal-600 p-2 rounded-lg">
                <School className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Manage educational institutions with ease</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 relative dropdown-container">
              {/* Add School desktop */}
              <Button
                onClick={handleAddClick}
                className="hidden sm:flex bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 items-center gap-2"
              >
                <Plus className="h-5 w-5" /> Add School
              </Button>

              {/* User Profile / Login */}
              {isLoggedIn ? (
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="flex items-center gap-2 bg-white pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow transition-all duration-150"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {firstLetter}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden md:block truncate max-w-[120px]">
                      {userEmail.split('@')[0]}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-200 flex flex-col z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
                      </div>
                      <button
                        onClick={handleAddClick}
                        className="px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm font-medium flex items-center gap-3 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add New School
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm font-medium flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Schools</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSchools}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">+12% from last month</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <School className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active Schools</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeSchools}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">+8% from last month</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Cities Covered</p>
                <p className="text-3xl font-bold text-gray-900">{stats.citiesCovered}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">+3 new cities</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* School Grid Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">School Directory</h2>
              <p className="text-sm text-gray-500 mt-1">Manage all registered educational institutions</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Filter Button */}
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>

              {/* Add School button for mobile */}
              <Button
                onClick={handleAddClick}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg sm:hidden flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add School
              </Button>
            </div>
          </div>

          <div className="p-6">
            <SchoolGrid
              refreshTrigger={refreshTrigger}
              onStatsUpdate={(stats) => setStats(stats)}
              searchQuery={searchQuery} // Ensure SchoolGrid accepts this
            />
          </div>
        </div>
      </main>

      {/* Add School Modal */}
     
     
    <Modal
  isOpen={isModalOpen}      // matches your Modal prop
  onClose={() => setIsModalOpen(false)}
  title="Add New School"
  className="max-w-3xl rounded-2xl"
>
  <AddSchoolForm 
    onSuccess={handleSchoolAdded} 
    onClose={() => setIsModalOpen(false)} 
  />
</Modal>

      {/* Login Modal */}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <School className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-900">School Management System</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} School Management System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
