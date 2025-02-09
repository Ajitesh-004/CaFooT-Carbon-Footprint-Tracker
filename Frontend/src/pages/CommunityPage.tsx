// src/pages/CommunityPage.tsx
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { communityAtom } from '../atoms/communityAtom';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import CommunityFeed from '../components/CommunityFeed';

const CommunityPage: React.FC = () => {
  const setPosts = useSetRecoilState(communityAtom);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5069/api/community/posts');
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [setPosts]);

  // Function to handle newly created posts
  const handlePostCreated = (newPost: any) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">CaFooT Community</h1>
      <CreatePost onPostCreated={handlePostCreated} />
      <CommunityFeed />
    </div>
  );
};

export default CommunityPage;
