import React, { useState } from 'react';
import { useBugs } from '../hooks/useBugs';
import BugList from '../components/bugs/BugList';
import BugForm from '../components/bugs/BugForm';
import BugFilters from '../components/bugs/BugFilters';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const BugsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBug, setEditingBug] = useState(null);
  const [filters, setFilters] = useState({});

  const {
    bugs,
    loading,
    error,
    createBug,
    updateBug,
    deleteBug,
    fetchBugs,
  } = useBugs(filters);

  const handleCreateBug = async (bugData) => {
    try {
      await createBug(bugData);
      setShowCreateModal(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleUpdateBug = async (bugData) => {
    try {
      await updateBug(editingBug._id, bugData);
      setEditingBug(null);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteBug = async (bugId) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await deleteBug(bugId);
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleStatusUpdate = async (bugId, status) => {
    try {
      await updateBug(bugId, { status });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Mock projects data - replace with actual projects from your API
  const mockProjects = [
    { _id: '1', name: 'Web Application' },
    { _id: '2', name: 'Mobile App' },
    { _id: '3', name: 'API Service' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bug Tracker</h1>
              <p className="text-gray-600 mt-2">Manage and track software bugs</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              Report New Bug
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <BugFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Bugs List */}
        <BugList
          bugs={bugs}
          loading={loading}
          onEdit={setEditingBug}
          onDelete={handleDeleteBug}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Create Bug Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Report New Bug"
        >
          <BugForm
            onSubmit={handleCreateBug}
            onCancel={() => setShowCreateModal(false)}
            loading={loading}
            projects={mockProjects}
          />
        </Modal>

        {/* Edit Bug Modal */}
        <Modal
          isOpen={!!editingBug}
          onClose={() => setEditingBug(null)}
          title="Edit Bug"
        >
          <BugForm
            bug={editingBug}
            onSubmit={handleUpdateBug}
            onCancel={() => setEditingBug(null)}
            loading={loading}
            projects={mockProjects}
          />
        </Modal>
      </div>
    </div>
  );
};

export default BugsPage;