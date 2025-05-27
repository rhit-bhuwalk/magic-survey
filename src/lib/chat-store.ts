import { Message, generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

// Create a new chat and return its ID
export async function createChat(id?: string): Promise<string> {
  const chatId = id || generateId(); // use provided ID or generate a unique chat ID
  const chatFile = getChatFile(chatId);
  
  try {
    await writeFile(chatFile, '[]'); // create an empty chat file
    console.log(`Created chat file: ${chatFile}`);
    return chatId;
  } catch (error) {
    console.error('Error creating chat file:', error);
    throw error;
  }
}

// Load chat messages by ID
export async function loadChat(id: string): Promise<Message[]> {
  const chatFile = getChatFile(id);
  try {
    const content = await readFile(chatFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading chat ${id} from ${chatFile}:`, error);
    // If file doesn't exist, return empty array
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.log(`Chat file ${chatFile} does not exist, returning empty messages`);
      return [];
    }
    throw error; // Re-throw other errors
  }
}

// Save chat messages
export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  try {
    const content = JSON.stringify(messages, null, 2);
    await writeFile(getChatFile(id), content);
  } catch (error) {
    console.error('Error saving chat:', error);
  }
}

// Helper function to get the chat file path
function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}

// Check if a chat exists
export async function chatExists(id: string): Promise<boolean> {
  const chatFile = getChatFile(id);
  try {
    await readFile(chatFile, 'utf8');
    console.log(`Chat ${id} exists at ${chatFile}`);
    return true;
  } catch (error) {
    console.log(`Chat ${id} does not exist at ${chatFile}:`, error instanceof Error ? error.message : String(error));
    return false;
  }
} 