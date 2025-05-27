import { loadChat, chatExists } from '@/lib/chat-store';
import Chat from '@/components/chat';
import { notFound } from 'next/navigation';

export default async function ChatPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  
  // Check if chat exists first
  const exists = await chatExists(id);
  if (!exists) {
    console.log(`Chat ${id} does not exist, starting with empty messages`);
    // No need to create a file - it will be created when first message is saved
    return <Chat id={id} initialMessages={[]} />;
  }
  
  try {
    const messages = await loadChat(id);
    return <Chat id={id} initialMessages={messages} />;
  } catch (error) {
    console.error('Error loading chat:', error);
    notFound();
  }
} 