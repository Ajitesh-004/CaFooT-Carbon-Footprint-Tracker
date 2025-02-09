import React from 'react';
import { useRecoilValue } from 'recoil';
import { User } from 'lucide-react';
import { userAtom } from '../atoms/userAtom';

export const Header: React.FC = () => {
    const user = useRecoilValue(userAtom);

  return (
    <header className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <User className="w-8 h-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-xl font-bold">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};