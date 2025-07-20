import React, { useState } from 'react';
import { ProfileLink } from '../../types';
import { ExternalLink, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { getPlatformByName } from '../../utils/platforms';

interface LinkCardProps {
  link: ProfileLink;
  username: string;
  onEdit: (link: ProfileLink) => void;
  onDelete: (linkId: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, username, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const platform = getPlatformByName(link.platform);
  const linkUrl = `${window.location.origin}/${username}/${link.platform.toLowerCase()}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisit = () => {
    window.open(link.url, '_blank');
  };

  return (
    <div className="group bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 shadow-card border border-gray-200 dark:border-gray-700 hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.025] animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-purple-100 dark:from-accent-900/30 dark:to-purple-900/20 rounded-xl flex items-center justify-center text-lg shadow-md">
            {platform?.icon || '🔗'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-lg group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
              {link.title}
            </h3>
            <p className="text-sm text-accent-600 dark:text-accent-400 font-medium">
              {link.platform}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm ${copied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-accent-600 hover:text-white dark:hover:bg-accent-400 dark:hover:text-gray-900'}`}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleVisit}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-200 shadow-sm"
          >
            Visit
          </button>
          <button
            onClick={() => onEdit(link)}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-600 hover:text-white dark:hover:bg-yellow-400 dark:hover:text-gray-900 transition-all duration-200 shadow-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(link.id)}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-gray-900 transition-all duration-200 shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
        {link.url}
      </div>
      
      {link.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          {link.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">{link.clicks}</span>
          <span className="text-gray-500 dark:text-gray-400">clicks</span>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          /{username}/{link.platform.toLowerCase()}
        </div>
      </div>

      {copied && (
        <div className="mt-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default LinkCard;