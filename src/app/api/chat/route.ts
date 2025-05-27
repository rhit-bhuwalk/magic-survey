import { anthropic } from '@ai-sdk/anthropic';
import { streamText, appendResponseMessages } from 'ai';
import { systemPrompt } from './systemPrompt';
import { tavilyTools } from '@/lib/tools/tavily';
import { surveyGenerationTools } from '@/lib/tools/survey-generation';
import { saveChat } from '@/lib/chat-store';

export async function POST(request: Request) {
  try {
    const { messages, id } = await request.json();

    // Filter out empty messages that are used to trigger initial conversation
    const filteredMessages = messages.filter((message: { content: string }) => 
      message.content.trim() !== ''
    );

    // Use filtered messages for processing
    const messagesToProcess = filteredMessages;
    
    console.log(`Processing ${messagesToProcess.length} messages for chat ${id}`);

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: systemPrompt,
      messages: messagesToProcess,
      tools: {
        ...tavilyTools({ apiKey: process.env.TAVILY_API_KEY! }),
        ...surveyGenerationTools(),
      },
      maxSteps: 5,
      onError({ error }) {
        console.error('StreamText error:', error);
      },
      async onFinish({ response }) {
        // Save the chat messages after the AI response is complete
        if (id) {
          try {
            const finalMessages = appendResponseMessages({
              messages: messagesToProcess,
              responseMessages: response.messages,
            });
            console.log(`Saving ${finalMessages.length} messages to chat ${id}`);
            await saveChat({
              id,
              messages: finalMessages,
            });
            console.log(`Successfully saved chat ${id}`);
          } catch (error) {
            console.error(`Error saving chat ${id}:`, error);
          }
        }
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error('Detailed error:', error);
        
        if (error == null) {
          return 'Unknown error occurred';
        }

        if (typeof error === 'string') {
          return error;
        }

        if (error instanceof Error) {
          return error.message;
        }

        return JSON.stringify(error);
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request', details: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 