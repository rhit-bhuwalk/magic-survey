import { redirect } from 'next/navigation';
import { createChat } from '@/lib/chat-store';

export default async function NewChatPage() {
  try {
    const id = await createChat(); // create a new chat
    console.log(`Created new chat with ID: ${id}`);
    redirect(`/chat/${id}`); // redirect to chat page
  } catch (error) {
    console.error('Error creating new chat:', error);
    // Redirect to home page if chat creation fails
    redirect('/');
  }
} 