'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { AddSchoolForm } from '@/components/schools/AddSchoolForm';
import { SchoolGrid } from '@/components/schools/SchoolGrid';
import { Plus, School, Users, MapPin } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({ totalSchools: 0, activeSchools: 0, citiesCovered: 0 });

  const fetchStats = async () => {
    const res = await fetch('/api/schools/get');
    const data = await res.json();
    if (data.success) {
      console.log(data)
      setStats(data.stats);
    }
  };
  

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const handleSchoolAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-white shadow-lg border border-gray-200',
        }}
      />

      {/* Header */}
     <div className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="py-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <School className="h-8 w-8 text-green-600" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          School Management System
        </h1>
      </div>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 self-start sm:self-auto"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add School
      </Button>
    </div>
  </div>
</div>



      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <School className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Schools</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSchools}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Schools</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSchools}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Cities Covered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.citiesCovered}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Schools</h2>
            <div className="text-sm text-gray-500">Latest additions shown first</div>
          </div>
         <SchoolGrid
  refreshTrigger={refreshTrigger}
  onStatsUpdate={(stats) => setStats(stats)}
/>

        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New School" className="max-w-3xl">
        <AddSchoolForm onSuccess={handleSchoolAdded} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
