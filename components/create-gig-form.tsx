'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Gig, GigFormData } from '@/types';
import axios from '@/lib/api';
import toast from 'react-hot-toast';

type CreateGigFormProps = {
  gig?: Gig; // Optional — if provided, we are editing
};

const CreateGigForm = ({ gig }: CreateGigFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GigFormData>({
    defaultValues: gig
      ? {
          title: gig.title,
          shortDesc: gig.shortDesc,
          description: gig.description,
          category: gig.category,
          deliveryTime: gig.deliveryTime,
          revisionNumber: gig.revisionNumber,
          price: gig.price,
          features: gig.features,
        }
      : {},
  });

  useEffect(() => {
    if (gig) {
      reset({
        title: gig.title,
        shortDesc: gig.shortDesc,
        description: gig.description,
        category: gig.category,
        deliveryTime: gig.deliveryTime,
        revisionNumber: gig.revisionNumber,
        price: gig.price,
        features: gig.features,
      });
    }
  }, [gig, reset]);

  const onSubmit = async (data: GigFormData) => {
    try {
      if (gig) {
        // Editing
        await axios.put(`/api/gigs/${gig.id}`, data);
        toast.success('Gig updated successfully!');
      } else {
        // Creating
        await axios.post('/api/gigs', data);
        toast.success('Gig created successfully!');
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save gig');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {gig ? 'Edit Gig' : 'Create New Gig'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            {...register('title', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter gig title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">Title is required</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Short Description
          </label>
          <input
            {...register('shortDesc', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Short description..."
          />
          {errors.shortDesc && (
            <p className="text-red-500 text-sm mt-1">
              Short description is required
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Description
          </label>
          <textarea
            {...register('description', { required: true })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Full description..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              Description is required
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Category
          </label>
          <input
            {...register('category', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Design, Writing, Development"
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">Category is required</p>
          )}
        </div>

        {/* Delivery Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Delivery Time (in days)
          </label>
          <input
            type="number"
            {...register('deliveryTime', { required: true, min: 1 })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.deliveryTime && (
            <p className="text-red-500 text-sm mt-1">
              Enter a valid delivery time
            </p>
          )}
        </div>

        {/* Revisions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Number of Revisions
          </label>
          <input
            type="number"
            {...register('revisionNumber', { required: true, min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.revisionNumber && (
            <p className="text-red-500 text-sm mt-1">
              Enter valid number of revisions
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Price ($)
          </label>
          <input
            type="number"
            {...register('price', { required: true, min: 1 })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">Enter a valid price</p>
          )}
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Features (comma separated)
          </label>
          <input
            {...register('features', {
              required: true,
              setValueAs: (v: string) =>
                v.split(',').map((s) => s.trim()),
            })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Responsive, SEO Friendly"
          />
          {errors.features && (
            <p className="text-red-500 text-sm mt-1">
              Enter at least one feature
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {isSubmitting
            ? gig
              ? 'Updating...'
              : 'Creating...'
            : gig
            ? 'Update Gig'
            : 'Create Gig'}
        </button>
      </form>
    </div>
  );
};

export default CreateGigForm;
