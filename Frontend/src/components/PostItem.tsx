// src/components/PostItem.tsx
import React, { useState } from 'react';
import { CommunityPost, CommunityComment, CommunityAnswer } from '../types/community.types';
import CreateCommentForm from './CreateCommentForm';
import CreateAnswerForm from './CreateAnswerForm';

interface PostItemProps {
  post: CommunityPost;
  onUpdatePost: (updatedPost: CommunityPost) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onUpdatePost }) => {
  // Use fallback to ensure we always have an array
  const [comments, setComments] = useState<CommunityComment[]>(post.comments || []);
  const [answers, setAnswers] = useState<CommunityAnswer[]>(post.answers || []);

  const handleCommentAdded = (newComment: CommunityComment) => {
    const updatedPost = { ...post, comments: [...comments, newComment] };
    setComments(updatedPost.comments);
    onUpdatePost(updatedPost);
  };

  const handleAnswerAdded = (newAnswer: CommunityAnswer) => {
    const updatedPost = { ...post, answers: [...answers, newAnswer] };
    setAnswers(updatedPost.answers);
    onUpdatePost(updatedPost);
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">
          {post.isQuestion ? 'Question' : 'Post'} by {post.username}
        </h3>
        <span className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="mb-4">{post.content}</p>

      {post.isQuestion ? (
        <div>
          <h4 className="font-bold mt-3">Answers:</h4>
          {Array.isArray(answers) && answers.length > 0 ? (
            answers.map((answer) => (
              <div key={answer.id} className="border-t pt-2 mt-2">
                <p>
                  <strong>{answer.username}</strong>: {answer.content}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(answer.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No answers yet.</p>
          )}
          <CreateAnswerForm postId={post.id} onAnswerAdded={handleAnswerAdded} />
        </div>
      ) : (
        <div>
          <h4 className="font-bold mt-3">Comments:</h4>
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-t pt-2 mt-2">
                <p>
                  <strong>{comment.username}</strong>: {comment.content}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No comments yet.</p>
          )}
          <CreateCommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
        </div>
      )}
    </div>
  );
};

export default PostItem;
