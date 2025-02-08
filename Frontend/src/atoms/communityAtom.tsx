import { atom } from 'recoil';
import { CommunityPost } from '../types/community.types';

export const communityAtom = atom<CommunityPost[]>({
  key: 'communityAtom',
  default: [],
});
