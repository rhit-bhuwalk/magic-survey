import { loadChat, chatExists, createChat } from '@/lib/chat-store';
import Chat from '@/components/chat';
import { notFound } from 'next/navigation';

export default async function ChatPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  
  // Check if chat exists first
  const exists = await chatExists(id);
  if (!exists) {
    console.log(`Chat ${id} does not exist, creating new chat file`);
    try {
      // Create an empty chat file for this ID
      await createChat(id);
      console.log(`Successfully created chat file for ${id}`);
      return <Chat id={id} initialMessages={[]} />;
    } catch (error) {
      console.error(`Error creating chat ${id}:`, error);
      notFound();
    }
  }
  
  try {
    const messages = await loadChat(id);
    return <Chat id={id} initialMessages={messages} />;
  } catch (error) {
    console.error('Error loading chat:', error);
    notFound();
  }
} 