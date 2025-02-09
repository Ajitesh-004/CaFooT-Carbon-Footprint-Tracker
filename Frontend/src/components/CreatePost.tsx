import React, { useState } from 'react';
import axios from 'axios';
import { Send, HelpCircle, MessageSquare } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const user = useRecoilValue(userAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await axios.post('http://localhost:5069/api/community/post', {
        userId: user?.id,
        content,
        isQuestion,
      });
      onPostCreated(response.data);
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-3">
          {isQuestion ? (
            <HelpCircle className="w-5 h-5 text-orange-500" />
          ) : (
            <MessageSquare className="w-5 h-5 text-green-500" />
          )}
          <h2 className="text-lg font-medium text-gray-900">
            {isQuestion ? "Ask the Community" : "Share Your Experience"}
          </h2>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isQuestion ? "Ask a question..." : "Share your thoughts..."}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>
      <div className="flex justify-between">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isQuestion}
            onChange={(e) => setIsQuestion(e.target.checked)}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <span className="text-sm text-gray-600">This is a question</span>
        </label>
        <button type="submit" className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Send size={18} />
          <span>Post</span>
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
