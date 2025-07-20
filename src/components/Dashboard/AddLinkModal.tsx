import React, { useState } from 'react';
import { X, Plus, Link as LinkIcon } from 'lucide-react';
import { PLATFORMS } from '../../utils/platforms';
import { ProfileLink } from '../../types';
import { generateId } from '../../utils/storage';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (link: Omit<ProfileLink, 'id' | 'userId' | 'clicks' | 'createdAt' | 'updatedAt'>) => void;
  userId: string;
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onAdd, userId }) => {
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    title: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.platform || !formData.url || !formData.title) {
      return;
    }

    onAdd({
      platform: formData.platform,
      url: formData.url,
      title: formData.title,
      description: formData.description
    });

    setFormData({ platform: '', url: '', title: '', description: '' });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl max-w-md w-full p-8 border border-purple-100 dark:border-purple-900/30 shadow-card">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Link</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              value={formData.platform}
              onChange={handleChange}
            >
              <option value="">Select a platform</option>
              {PLATFORMS.map((platform) => (
                <option key={platform.name} value={platform.name}>
                  {platform.icon} {platform.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              placeholder="e.g., My GitHub Profile"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              placeholder="https://github.com/yourusername"
              value={formData.url}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none"
              placeholder="Brief description of this link"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-purple font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;