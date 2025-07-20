import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ProfileLink, ClickLog } from '../../types';
import { BarChart3, TrendingUp, Eye, Calendar, Activity } from 'lucide-react';

interface AnalyticsProps {
  links: ProfileLink[];
  clickLogs: ClickLog[];
}

const Analytics: React.FC<AnalyticsProps> = ({ links, clickLogs }) => {
  // Calculate total clicks
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  // Get most clicked platform
  const platformClicks = links.reduce((acc, link) => {
    acc[link.platform] = (acc[link.platform] || 0) + link.clicks;
    return acc;
  }, {} as Record<string, number>);

  const mostClickedPlatform = Object.entries(platformClicks)
    .sort(([, a], [, b]) => b - a)[0];

  // Prepare data for charts
  const platformData = Object.entries(platformClicks).map(([platform, clicks]) => ({
    platform,
    clicks
  }));

  // Recent clicks data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyClicks = last7Days.map(date => {
    const dayClicks = clickLogs.filter(log => 
      log.timestamp.split('T')[0] === date
    ).length;
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      clicks: dayClicks
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your link performance and engagement</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-purple-100 dark:border-purple-900/30 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalClicks.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">↗ +12% from last week</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-purple-100 dark:border-purple-900/30 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Links</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{links.length}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Across {new Set(links.map(l => l.platform)).size} platforms</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-purple-100 dark:border-purple-900/30 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Top Platform</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {mostClickedPlatform?.[0] || 'None'}
              </p>
              {mostClickedPlatform && (
                <p className="text-sm text-violet-600 dark:text-violet-400 mt-1">
                  {mostClickedPlatform[1]} clicks
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Clicks Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-purple-100 dark:border-purple-900/30 shadow-card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Clicks by Platform</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="platform" 
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#1f2937',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <Bar 
                dataKey="clicks" 
                fill="url(#purpleGradient)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Clicks Trend */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-purple-100 dark:border-purple-900/30 shadow-card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            <span>Clicks Trend (Last 7 Days)</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyClicks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#1f2937',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#7c3aed' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-purple-100 dark:border-purple-900/30 shadow-card">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span>Recent Activity</span>
        </h3>
        
        {clickLogs.length > 0 ? (
          <div className="space-y-3">
            {clickLogs.slice(-5).reverse().map((log, index) => {
              const link = links.find(l => l.id === log.linkId);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center text-sm">
                      👆
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {link?.title || 'Unknown Link'} clicked
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {link?.platform}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;