// frontend/src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Users, School, FileQuestion, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { getDashboardStats, getAnalytics } from '../../lib/api/admin';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, analyticsData] = await Promise.all([
          getDashboardStats(),
          getAnalytics('30'),
        ]);
        setStats(statsData.stats);
        setAnalytics(analyticsData.analytics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total || 0,
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Students',
      value: stats?.users?.students || 0,
      icon: Users,
      color: 'bg-green-500',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Teachers',
      value: stats?.users?.teachers || 0,
      icon: School,
      color: 'bg-purple-500',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Active Classes',
      value: stats?.classes || 0,
      icon: School,
      color: 'bg-yellow-500',
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Total Exams',
      value: stats?.exams || 0,
      icon: FileQuestion,
      color: 'bg-red-500',
      trend: '+20%',
      trendUp: true,
    },
    {
      title: 'Active Subscriptions',
      value: stats?.subscriptions || 0,
      icon: CreditCard,
      color: 'bg-indigo-500',
      trend: '-3%',
      trendUp: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trendUp ? (
                    <TrendingUp className="text-green-500" size={16} />
                  ) : (
                    <TrendingDown className="text-red-500" size={16} />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      card.trendUp ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {card.trend}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`${card.color} p-4 rounded-full`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Last 30 Days Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Users</span>
              <span className="font-semibold text-gray-900">{analytics?.newUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Classes</span>
              <span className="font-semibold text-gray-900">{analytics?.newClasses || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Exams</span>
              <span className="font-semibold text-gray-900">{analytics?.completedExams || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Users</span>
              <span className="font-semibold text-gray-900">{analytics?.activeUsers || 0}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Add New User
            </button>
            <button className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Create Class
            </button>
            <button className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Upload Questions
            </button>
            <button className="w-full py-3 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Server Status: <span className="font-semibold">Operational</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Database: <span className="font-semibold">Healthy</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700">API Response: <span className="font-semibold">Moderate</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
