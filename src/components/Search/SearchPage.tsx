import React, { useState, useEffect } from 'react';
import { Search, User, ExternalLink } from 'lucide-react';
import { ProfileLink, User as UserType } from '../../types';
import { getLinks, getAllUsers, saveLinks, saveClickLog, generateId } from '../../utils/storage';
import { getPlatformByName } from '../../utils/platforms';

interface SearchResult {
  user: UserType;
  links: ProfileLink[];
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Real search function using actual user data
  const searchUsers = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];

    setLoading(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      // Get all registered users
      const allUsers = getAllUsers();
      const allLinks = getLinks();

      // Filter users based on search query (name or username)
      const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Create search results with user's links
      const searchResults: SearchResult[] = filteredUsers.map(user => ({
        user,
        links: allLinks.filter(link => link.userId === user.id)
      }));

      setLoading(false);
      return searchResults;
    } catch (error) {
      console.error('Search error:', error);
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query).then(setResults);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const handleLinkClick = (username: string, platform: string, url: string) => {
    // Find the link and increment click count
    const allLinks = getLinks();
    const linkToUpdate = allLinks.find(link => {
      // Find the user who owns this link
      const allUsers = getAllUsers();
      const linkOwner = allUsers.find(user => user.id === link.userId);
      return linkOwner?.username === username && link.platform.toLowerCase() === platform.toLowerCase();
    });

    if (linkToUpdate) {
      // Update click count
      const updatedLinks = allLinks.map(link => 
        link.id === linkToUpdate.id 
          ? { ...link, clicks: link.clicks + 1, updatedAt: new Date().toISOString() }
          : link
      );
      saveLinks(updatedLinks);

      // Log the click
      const clickLog = {
        id: generateId(),
        linkId: linkToUpdate.id,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };
      saveClickLog(clickLog);
    }

    // Open the link
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-violet-900/20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Users
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Find and explore user profiles and their social links
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or username..."
            className="w-full pl-12 pr-4 py-4 border border-purple-200 dark:border-purple-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg shadow-card transition-all duration-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Searching users...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h2>
              <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                {results.length} user{results.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            {results.map(({ user, links }) => (
              <div
                key={user.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-card border border-purple-100 dark:border-purple-900/30 p-8 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-purple">
                    <span className="text-white text-xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {user.name}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                      @{user.username}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {links.length > 0 ? (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Profile Links ({links.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {links.map((link) => {
                        const platform = getPlatformByName(link.platform);
                        return (
                          <button
                            key={link.id}
                            onClick={() => handleLinkClick(user.username, link.platform, link.url)}
                            className="group flex items-center space-x-4 p-4 border border-purple-200 dark:border-purple-700 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 text-left hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-card"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-xl shadow-purple">
                              {platform?.icon || '🔗'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {link.title}
                              </p>
                              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                {link.platform}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {link.clicks} clicks
                              </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800/30">
                    <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      No profile links added yet
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && query.trim() && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
              We couldn't find any users matching "<span className="font-semibold text-purple-600 dark:text-purple-400">{query}</span>". 
              Try searching with different keywords or check the spelling.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !query.trim() && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Start searching
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
              Enter a name or username to find users and explore their profile links. 
              Discover amazing creators and their online presence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;