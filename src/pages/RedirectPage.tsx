import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ProfileLink } from '../types';
import { getLinks, saveClickLog, generateId } from '../utils/storage';
import { getPlatformByName } from '../utils/platforms';
import { ExternalLink, User } from 'lucide-react';

const RedirectPage: React.FC = () => {
  const { username, platform } = useParams<{ username: string; platform: string }>();
  const [link, setLink] = useState<ProfileLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!username || !platform) return;

    // Find the link
    const allLinks = getLinks();
    const foundLink = allLinks.find(l => 
      l.platform.toLowerCase() === platform.toLowerCase()
      // In a real app, we'd also match by username
    );

    if (foundLink) {
      setLink(foundLink);
      
      // Log the click
      const clickLog = {
        id: generateId(),
        linkId: foundLink.id,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };
      
      saveClickLog(clickLog);
      
      // Update click count
      const updatedLinks = allLinks.map(l => 
        l.id === foundLink.id ? { ...l, clicks: l.clicks + 1 } : l
      );
      
      // Save updated links with new click count
      saveLinks(updatedLinks);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = foundLink.url;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    
    setLoading(false);
  }, [username, platform]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!link) {
    return <Navigate to="/404" replace />;
  }

  const platformInfo = getPlatformByName(link.platform);

  return (
    <>
      <Helmet>
        <title>{link.title} - LinkPro</title>
        <meta name="description" content={link.description || `Visit ${username}'s ${link.platform} profile`} />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={link.title} />
        <meta property="og:description" content={link.description || `Visit ${username}'s ${link.platform} profile`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={link.title} />
        <meta name="twitter:description" content={link.description || `Visit ${username}'s ${link.platform} profile`} />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You're being redirected to their {link.platform} profile
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-3xl">{platformInfo?.icon || '🔗'}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {link.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {link.platform}
                </p>
              </div>
            </div>
            
            {link.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {link.description}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {countdown}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>

          <button
            onClick={() => window.location.href = link.url}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Visit Now</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Powered by LinkPro
          </p>
        </div>
      </div>
    </>
  );
};

export default RedirectPage;