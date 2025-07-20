import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Link as LinkIcon, BarChart3, Search, Users, Zap, Shield, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            One link for
            <span className="block text-accent-600 dark:text-accent-400">everything</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Share all your content, social profiles, and contact info with a single, beautiful link.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Get started free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 text-gray-700 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">50K+</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Active users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">2M+</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Links created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple tools to create, manage, and track your links with detailed analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Links
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Create beautiful, branded links that redirect to your profiles with custom URLs.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Track clicks, analyze trends, and understand which platforms drive engagement.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Discovery
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Find and explore other creators' profiles with powerful search features.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who use LinkPro to manage their digital presence.
          </p>
          
          {!user && (
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Start for free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;