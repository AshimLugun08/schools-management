'use client';

import React from 'react';
import Image from 'next/image';
import { School } from '@/types/school';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SchoolCardProps {
  school: School;
}

export function SchoolCard({ school }: SchoolCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={school.image}
          alt={school.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {school.name}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">
            {school.address}, {school.city}, {school.state}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600">{school.contact}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600 truncate">{school.email_id}</p>
        </div>
      </CardContent>
    </Card>
  );
}