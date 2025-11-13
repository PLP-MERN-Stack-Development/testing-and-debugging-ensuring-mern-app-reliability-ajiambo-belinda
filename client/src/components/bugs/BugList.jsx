import React from 'react';
import BugCard from './BugCard';

const BugList = ({ 
  bugs, 
  loading, 
  onEdit, 
  onDelete, 
  onStatusUpdate,
  emptyMessage = "No bugs found" 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (bugs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{emptyMessage}</h3>
        <p className="text-gray-500">Get started by creating a new bug report.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bugs.map(bug => (
        <BugCard
          key={bug._id}
          bug={bug}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};

export default BugList;