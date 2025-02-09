// src/components/CreateAnswerForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';

interface CreateAnswerFormProps {
  postId: number;
  onAnswerAdded: (newAnswer: any) => void;
}

const CreateAnswerForm: React.FC<CreateAnswerFormProps> = ({ postId, onAnswerAdded }) => {
  const [content, setContent] = useState('');
  const user = useRecoilValue(userAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await axios.post('https://cafoot-backend.onrender.com/api/community/answer', {
        userId: user?.id,
        postId,
        content,
      });
      onAnswerAdded(response.data);
      setContent('');
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your answer..."
        className="w-full border rounded p-2"
        rows={2}
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Submit Answer
      </button>
    </form>
  );
};

export default CreateAnswerForm;
