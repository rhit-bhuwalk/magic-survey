"use client"

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Chat from '@/components/chat';
import { generateId } from 'ai';

export default function CreateSurvey() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [chatId, setChatId] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    // Generate a new chat ID for this session
    const newChatId = generateId();
    setChatId(newChatId);
    
    // Update the URL to include the chat ID for persistence
    const goal = searchParams.get('goal');
    const newUrl = goal 
      ? `/chat/${newChatId}?goal=${encodeURIComponent(goal)}`
      : `/chat/${newChatId}`;
    
    router.replace(newUrl);
  }, [router, searchParams]);

  // Show loading while we set up the chat
  if (!chatId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-25 to-blue-25 font-serif flex items-center justify-center" style={{background: 'linear-gradient(135deg, #fef7f7 0%, #f0f9ff 100%)'}}>
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white font-bold text-sm">✨</span>
          </div>
          <p className="text-gray-600">Setting up your chat...</p>
        </div>
      </div>
    );
  }

  const goal = searchParams.get('goal');
  return <Chat id={chatId} goal={goal || undefined} />;
} 