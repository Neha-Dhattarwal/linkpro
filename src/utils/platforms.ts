import { Platform } from '../types';

export const PLATFORMS: Platform[] = [
  {
    name: 'GitHub',
    icon: '🐙',
    color: '#333',
    baseUrl: 'https://github.com/'
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0077B5',
    baseUrl: 'https://linkedin.com/in/'
  },
  {
    name: 'LeetCode',
    icon: '🧠',
    color: '#FFA116',
    baseUrl: 'https://leetcode.com/u/'
  },
  {
    name: 'Twitter',
    icon: '🐦',
    color: '#1DA1F2',
    baseUrl: 'https://twitter.com/'
  },
  {
    name: 'Instagram',
    icon: '📸',
    color: '#E4405F',
    baseUrl: 'https://instagram.com/'
  },
  {
    name: 'Portfolio',
    icon: '🌐',
    color: '#6366F1',
    baseUrl: ''
  },
  {
    name: 'YouTube',
    icon: '📺',
    color: '#FF0000',
    baseUrl: 'https://youtube.com/@'
  },
  {
    name: 'Medium',
    icon: '✍️',
    color: '#00AB6C',
    baseUrl: 'https://medium.com/@'
  }
];

export const getPlatformByName = (name: string): Platform | undefined => {
  return PLATFORMS.find(p => p.name.toLowerCase() === name.toLowerCase());
};