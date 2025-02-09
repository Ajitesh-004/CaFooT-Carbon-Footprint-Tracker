// src/components/CreateCommentForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { userAtom } from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';

interface CreateCommentFormProps {
  postId: number;
  onCommentAdded: (newComment: any) => void;
}

const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const user = useRecoilValue(userAtom);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await axios.post('https://cafoot-backend.onrender.com/api/community/comment', {
        userId: user?.id,
        postId,
        content,
      });
      onCommentAdded(response.data);
      setContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        type="text"
        className="w-full border rounded p-2"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
        Submit Comment
      </button>
    </form>
  );
};

export default CreateCommentForm;
