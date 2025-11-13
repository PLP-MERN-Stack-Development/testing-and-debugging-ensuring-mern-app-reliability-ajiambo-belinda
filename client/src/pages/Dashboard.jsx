import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useBugs } from '../hooks/useBugs';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuthContext();
  const { bugs, loading, error } = useBugs();

  // Calculate statistics
  const stats = {
    total: bugs.length,
    open: bugs.filter(bug => bug.status === 'open' || bug.status === 'reopened').length,
    closed: bugs.filter(bug => bug.status === 'closed' || bug.status === 'resolved').length,
    critical: bugs.filter(bug => bug.priority === 'critical').length,
    high: bugs.filter(bug => bug.priority === 'high').length,
    medium: bugs.filter(bug => bug.priority === 'medium').length,
    low: bugs.filter(bug => bug.priority === 'low').length,
  };

  // Get recent bugs
  const recentBugs = [...bugs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get bugs assigned to current user
  const myBugs = bugs.filter(bug => bug.assignedTo === user?.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64 text-red-600">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error loading dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'closed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Welcome back, {user?.name || user?.email}!
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          <Link 
            to="/bugs" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View All Bugs
          </Link>
          <Link 
            to="/bugs/create" 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Report New Bug
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🐛</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              <p className="text-gray-600">Total Bugs</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🔴</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.open}</h3>
              <p className="text-gray-600">Open Bugs</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="flex items-center gap-4">
            <div className="text-2xl">✅</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.closed}</h3>
              <p className="text-gray-600">Closed Bugs</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🚨</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.critical}</h3>
              <p className="text-gray-600">Critical Priority</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Assigned Bugs */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Assigned Bugs</h2>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              {myBugs.length}
            </span>
          </div>
          {myBugs.length > 0 ? (
            <div className="space-y-4">
              {myBugs.slice(0, 5).map(bug => (
                <div key={bug.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(bug.priority)}`}>
                      {bug.priority}
                    </span>
                    <Link 
                      to={`/bugs/${bug.id}`} 
                      className="text-gray-900 font-medium hover:text-blue-600 flex-1"
                    >
                      {bug.title}
                    </Link>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(bug.status)}`}>
                      {bug.status}
                    </span>
                    <span>
                      {new Date(bug.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No bugs assigned to you</p>
              <Link to="/bugs" className="text-blue-600 hover:text-blue-700 font-medium">
                Browse all bugs
              </Link>
            </div>
          )}
        </div>

        {/* Recent Bugs */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bugs</h2>
            <Link to="/bugs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          {recentBugs.length > 0 ? (
            <div className="space-y-4">
              {recentBugs.map(bug => (
                <div key={bug.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(bug.priority)}`}>
                      {bug.priority}
                    </span>
                    <Link 
                      to={`/bugs/${bug.id}`} 
                      className="text-gray-900 font-medium hover:text-blue-600 flex-1"
                    >
                      {bug.title}
                    </Link>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>By {bug.reporter?.name || 'Unknown'}</span>
                    <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No bugs reported yet</p>
              <Link to="/bugs/create" className="text-blue-600 hover:text-blue-700 font-medium">
                Report first bug
              </Link>
            </div>
          )}
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Priority Distribution</h2>
          <div className="space-y-4">
            {[
              { type: 'critical', count: stats.critical, color: 'bg-red-500' },
              { type: 'high', count: stats.high, color: 'bg-orange-500' },
              { type: 'medium', count: stats.medium, color: 'bg-yellow-500' },
              { type: 'low', count: stats.low, color: 'bg-green-500' },
            ].map((priority) => (
              <div key={priority.type} className="flex items-center gap-4">
                <span className="w-20 font-medium text-gray-700 capitalize">
                  {priority.type}
                </span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${priority.color} transition-all duration-300`}
                    style={{ 
                      width: stats.total > 0 ? `${(priority.count / stats.total) * 100}%` : '0%' 
                    }}
                  ></div>
                </div>
                <span className="w-12 text-right font-medium text-gray-900">
                  {priority.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;