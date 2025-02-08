export interface CommunityPost {
  id: number;
  userId: number;
  username: string;  // ✅ Updated to include username
  content: string;
  isQuestion: boolean;
  createdAt: string;
  comments: CommunityComment[];
  answers: CommunityAnswer[];
}

export interface CommunityComment {
  id: number;
  userId: number;
  username: string;  // ✅ Updated to include username
  postId: number;
  content: string;
  createdAt: string;
}

export interface CommunityAnswer {
  id: number;
  userId: number;
  username: string;  // ✅ Updated to include username
  postId: number;
  content: string;
  createdAt: string;
}
