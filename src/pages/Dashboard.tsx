import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileLink, ClickLog } from '../types';
import { getLinks, saveLinks, getClickLogs, generateId } from '../utils/storage';
import AddLinkModal from '../components/Dashboard/AddLinkModal';
import LinkCard from '../components/Dashboard/LinkCard';
import Analytics from '../components/Dashboard/Analytics';
import { Plus, BarChart3, Link as LinkIcon, Eye, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [clickLogs, setClickLogs] = useState<ClickLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'links' | 'analytics'>('links');

  useEffect(() => {
    if (user) {
      const refreshData = () => {
        const allLinks = getLinks();
        const userLinks = allLinks.filter(link => link.userId === user.id);
        setLinks(userLinks);
        
        const allClickLogs = getClickLogs();
        const userClickLogs = allClickLogs.filter(log => 
          userLinks.some(link => link.id === log.linkId)
        );
        setClickLogs(userClickLogs);
      };

      refreshData();
      const interval = setInterval(refreshData, 2000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        const allLinks = getLinks();
        const userLinks = allLinks.filter(link => link.userId === user.id);
        setLinks(userLinks);
        
        const allClickLogs = getClickLogs();
        const userClickLogs = allClickLogs.filter(log => 
          userLinks.some(link => link.id === log.linkId)
        );
        setClickLogs(userClickLogs);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const handleAddLink = (linkData: Omit<ProfileLink, 'id' | 'userId' | 'clicks' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newLink: ProfileLink = {
      ...linkData,
      id: generateId(),
      userId: user.id,
      clicks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const allLinks = getLinks();
    const updatedLinks = [...allLinks, newLink];
    saveLinks(updatedLinks);
    
    const userLinks = updatedLinks.filter(link => link.userId === user.id);
    setLinks(userLinks);
  };

  const handleEditLink = (link: ProfileLink) => {
    console.log('Edit link:', link);
  };

  const handleDeleteLink = (linkId: string) => {
    const allLinks = getLinks();
    const updatedLinks = allLinks.filter(link => link.id !== linkId);
    saveLinks(updatedLinks);
    
    const userLinks = updatedLinks.filter(link => link.userId === user?.id);
    setLinks(userLinks);
  };

  if (!user) return null;

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-violet-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your links and track your performance
          </p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-accent-100 to-purple-100 dark:from-accent-900/30 dark:to-purple-900/20 rounded-2xl p-6 shadow-card border border-gray-200 dark:border-gray-700 hover:shadow-card-hover transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Links</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">{links.length}</p>
              </div>
              <div className="w-10 h-10 bg-accent-200 dark:bg-accent-900/40 rounded-lg flex items-center justify-center shadow-md">
                <LinkIcon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/20 rounded-2xl p-6 shadow-card border border-gray-200 dark:border-gray-700 hover:shadow-card-hover transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{totalClicks.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-blue-200 dark:bg-blue-900/40 rounded-lg flex items-center justify-center shadow-md">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/20 rounded-2xl p-6 shadow-card border border-gray-200 dark:border-gray-700 hover:shadow-card-hover transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Platforms</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{new Set(links.map(l => l.platform)).size}</p>
              </div>
              <div className="w-10 h-10 bg-green-200 dark:bg-green-900/40 rounded-lg flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>
        {/* Tab Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${activeTab === 'links' ? 'bg-white dark:bg-gray-700 text-accent-600 dark:text-accent-400 shadow-md' : 'text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Links</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${activeTab === 'analytics' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === 'links' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Your Links
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Create and manage links to all your online profiles
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </button>
            </div>

            {links.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {links.map((link, index) => (
                  <div key={link.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <LinkCard
                      link={link}
                      username={user.username}
                      onEdit={handleEditLink}
                      onDelete={handleDeleteLink}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LinkIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No links yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  Start building your digital presence by adding your first profile link.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Add Your First Link
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <Analytics links={links} clickLogs={clickLogs} />
          </div>
        )}

        <AddLinkModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLink}
          userId={user.id}
        />
      </div>
    </div>
  );
};

export default Dashboard;