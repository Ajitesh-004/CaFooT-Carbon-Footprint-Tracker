// src/components/CommunityFeed.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { communityAtom } from '../atoms/communityAtom';
import PostItem from './PostItem';
import { CommunityPost } from '../types/community.types';

const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useRecoilState(communityAtom);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://cafoot-backend.onrender.com/api/community/posts');
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [setPosts]);

  useEffect(() => {
    // Filter posts by search query (searching in content and username)
    const filtered = posts.filter(
      (post) =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleUpdatePost = (updatedPost: CommunityPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Community Feed</h2>
      
      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search posts or questions..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {filteredPosts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        filteredPosts.map((post) => (
          <PostItem key={post.id} post={post} onUpdatePost={handleUpdatePost} />
        ))
      )}
    </div>
  );
};

export default CommunityFeed;
