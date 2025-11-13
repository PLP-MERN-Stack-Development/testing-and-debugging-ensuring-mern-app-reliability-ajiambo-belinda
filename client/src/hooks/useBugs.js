import { useState, useEffect } from 'react';
import { bugService } from '../services/bugService';

export const useBugs = (initialFilters = {}) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchBugs = async (filtersObj = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bugService.getBugs(filtersObj);
      setBugs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  const createBug = async (bugData) => {
    try {
      setLoading(true);
      const response = await bugService.createBug(bugData);
      await fetchBugs(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bug');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBug = async (id, bugData) => {
    try {
      setLoading(true);
      const response = await bugService.updateBug(id, bugData);
      await fetchBugs(); // Refresh the list
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bug');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBug = async (id) => {
    try {
      setLoading(true);
      await bugService.deleteBug(id);
      await fetchBugs(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete bug');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return {
    bugs,
    loading,
    error,
    filters,
    setFilters,
    fetchBugs,
    createBug,
    updateBug,
    deleteBug,
  };
};