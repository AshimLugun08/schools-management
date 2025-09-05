'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schoolSchema, SchoolFormData } from '@/lib/validations/school';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddSchoolFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function AddSchoolForm({ onSuccess, onClose }: AddSchoolFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema)
  });

  const watchedImage = watch('image');

  // Handle image preview
  React.useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchedImage]);

  const onSubmit = async (data: SchoolFormData) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('state', data.state);
      formData.append('contact', data.contact);
      formData.append('email_id', data.email_id);
      formData.append('image', data.image[0]);

      const response = await fetch('/api/schools/add', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add school');
      }

      toast.success('School added successfully!');
      reset();
      setImagePreview(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding school:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add school');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* School Name */}
      <div className="space-y-2">
        <Label htmlFor="name">School Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter school name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email_id">Email Address *</Label>
        <Input
          id="email_id"
          type="email"
          {...register('email_id')}
          placeholder="Enter email address"
          className={errors.email_id ? 'border-red-500' : ''}
        />
        {errors.email_id && (
          <p className="text-sm text-red-600">{errors.email_id.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          {...register('address')}
          placeholder="Enter full address"
          rows={3}
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      {/* City and State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="Enter city"
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && (
            <p className="text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            {...register('state')}
            placeholder="Enter state"
            className={errors.state ? 'border-red-500' : ''}
          />
          {errors.state && (
            <p className="text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <Label htmlFor="contact">Contact Number *</Label>
        <Input
          id="contact"
          {...register('contact')}
          placeholder="Enter 10-digit contact number"
          className={errors.contact ? 'border-red-500' : ''}
        />
        {errors.contact && (
          <p className="text-sm text-red-600">{errors.contact.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">School Image *</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto h-48 w-full object-cover rounded-lg"
              />
              <p className="text-sm text-gray-600">Image selected successfully</p>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <Label
                  htmlFor="image"
                  className="cursor-pointer text-blue-600 hover:text-blue-500"
                >
                  Click to upload
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </div>
          )}
          <Input
            id="image"
            type="file"
            {...register('image')}
            accept="image/*"
            className="hidden"
          />
        </div>
        {errors.image && (
          <p className="text-sm text-red-600">{errors.image.message as string}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding School...
            </>
          ) : (
            'Add School'
          )}
        </Button>
      </div>
    </form>
  );
}