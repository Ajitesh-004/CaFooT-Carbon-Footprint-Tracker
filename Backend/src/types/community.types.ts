export interface CommunityPostInput {
    userId: number;
    content: string;
    isQuestion: boolean;
  }
  
  export interface CommunityCommentInput {
    userId: number;
    postId: number;
    content: string;
  }
  
  export interface CommunityAnswerInput {
    userId: number;
    postId: number;
    content: string;
  }
  