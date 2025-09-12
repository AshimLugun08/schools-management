'use client';

import React, { useState, useEffect } from 'react';
import { School, ApiResponse } from '@/types/school';
import { SchoolCard } from './SchoolCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SchoolGridProps {
  refreshTrigger?: number;
  onStatsUpdate?: (stats: { totalSchools: number; activeSchools: number; citiesCovered: number }) => void;
  searchQuery?: string; // Added searchQuery
}

export function SchoolGrid({ refreshTrigger, onStatsUpdate, searchQuery }: SchoolGridProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/schools/get');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch schools');

      setSchools(data.data || []);

      if (onStatsUpdate && data.stats) {
        onStatsUpdate(data.stats);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [refreshTrigger]);

  const filteredSchools = searchQuery
    ? schools.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : schools;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading schools...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (filteredSchools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
        <p className="text-gray-600">Try adding a school or adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredSchools.map((school) => (
        <SchoolCard key={school.id} school={school} />
      ))}
    </div>
  );
}