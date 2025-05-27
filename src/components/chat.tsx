"use client"

import React from 'react';
import { useChat, Message } from '@ai-sdk/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ChatProps {
  id?: string;
  initialMessages?: Message[];
  goal?: string;
}

export default function Chat({ id, initialMessages = [], goal }: ChatProps) {
  const searchParams = useSearchParams();
  const hasInitialized = React.useRef(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [showSurveyButton, setShowSurveyButton] = React.useState(false);
  const [surveyButtonData, setSurveyButtonData] = React.useState<{
    message: string;
    requirements: string[];
  } | null>(null);

  // Get goal from props or URL params
  const effectiveGoal = goal || searchParams.get('goal');
  
  // Track if we've already processed initial messages to prevent duplicates
  const initialMessagesProcessed = React.useRef(false);

  const { messages, input, handleInputChange, handleSubmit, status, append } = useChat({
    api: '/api/chat',
    id, // Pass the chat ID for persistence
    initialMessages,
    sendExtraMessageFields: true, // Send id and createdAt for each message
  });

  // Handle initial messages and trigger AI responses
  React.useEffect(() => {
    if (hasInitialized.current || initialMessagesProcessed.current) return;
    
    // Add a small delay to prevent race conditions
    const timer = setTimeout(() => {
      // Check if the goal message already exists in initial messages
      const goalAlreadyExists = effectiveGoal && initialMessages.some(
        msg => msg.role === 'user' && msg.content === effectiveGoal
      );
      
      // If we have a goal parameter and it's not already in the messages, send it as the first message
      if (effectiveGoal && initialMessages.length === 0 && !goalAlreadyExists) {
        append({ role: 'user', content: effectiveGoal });
        hasInitialized.current = true;
        initialMessagesProcessed.current = true;
      } else if (initialMessages.length === 0) {
        // Send an empty message to trigger the AI's initial greeting for new chats
        append({ role: 'user', content: '' });
        hasInitialized.current = true;
        initialMessagesProcessed.current = true;
      } else {
        // For existing chats with messages, mark as initialized
        hasInitialized.current = true;
        initialMessagesProcessed.current = true;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [append, effectiveGoal, initialMessages]);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  // Monitor for survey generation tool calls
  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.toolInvocations) {
      for (const toolInvocation of lastMessage.toolInvocations) {
        if (toolInvocation.toolName === 'triggerSurveyGeneration' && 
            toolInvocation.state === 'result' && 
            toolInvocation.result) {
          const result = toolInvocation.result as {
            action: string;
            message: string;
            requirements: string[];
          };
          
          if (result.action === 'show_survey_generation_button') {
            setShowSurveyButton(true);
            setSurveyButtonData({
              message: result.message,
              requirements: result.requirements
            });
          }
        }
      }
    }
  }, [messages]);

  return (
    <>
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-pink-25 to-blue-25 font-serif" style={{background: 'linear-gradient(135deg, #fef7f7 0%, #f0f9ff 100%)'}}>
        {/* Header */}
        <header className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">✨</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Magic Surveys</h1>
            </Link>
            <div className="text-gray-500 font-medium text-sm">
              Survey Creator
            </div>
          </nav>
        </header>

        {/* Chat Interface */}
        <main className="h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl flex flex-col h-full">
            {/* Chat Header */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Let&apos;s Create Your Survey</h2>
              <p className="text-gray-600">Tell me about what you want to discover, and I&apos;ll help you design the perfect questions.</p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide scroll-smooth">
              {messages.filter(message => message.content.trim() !== '').map((message) => (
                <div key={message.id} className="space-y-2">
                  {/* Tool Calls - Show BEFORE the message content */}
                  {message.toolInvocations && message.toolInvocations.map((toolInvocation) => {
                    // Don't render the survey generation tool invocation as it's handled separately
                    if (toolInvocation.toolName === 'triggerSurveyGeneration') {
                      return null;
                    }
                    
                    return (
                    <div key={toolInvocation.toolCallId} className="flex justify-start">
                      <div className="max-w-[80%] bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs">🔍</span>
                          </div>
                          <span className="text-xs font-medium text-blue-600">
                            {toolInvocation.state === 'call' ? 'Searching the web...' : 'Search completed'}
                          </span>
                        </div>
                        
                        {toolInvocation.state === 'call' && (
                          <div className="space-y-2">
                            <div className="text-sm text-blue-700">
                              <strong>Query:</strong> {toolInvocation.args.query}
                            </div>
                            {toolInvocation.args.searchDepth && (
                              <div className="text-xs text-blue-600">
                                <strong>Search depth:</strong> {toolInvocation.args.searchDepth}
                              </div>
                            )}
                            {toolInvocation.args.maxResults && (
                              <div className="text-xs text-blue-600">
                                <strong>Max results:</strong> {toolInvocation.args.maxResults}
                              </div>
                            )}
                            <div className="flex items-center space-x-1 mt-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        )}

                        {toolInvocation.state === 'result' && (
                          <div className="space-y-2">
                            <div className="text-sm text-blue-700">
                              <strong>Searched for:</strong> {toolInvocation.args.query}
                            </div>
                            {toolInvocation.result && typeof toolInvocation.result === 'object' && 'results' in toolInvocation.result && (
                              <div className="text-xs text-blue-600">
                                <strong>Found {Array.isArray(toolInvocation.result.results) ? toolInvocation.result.results.length : 0} results</strong>
                                {Array.isArray(toolInvocation.result.results) && toolInvocation.result.results.length > 0 && (
                                  <div className="mt-1 space-y-1">
                                    {toolInvocation.result.results.slice(0, 3).map((result: { title?: string; url?: string }, index: number) => (
                                      <div key={index} className="text-xs text-blue-700 truncate">
                                        • {result.title || result.url}
                                      </div>
                                    ))}
                                    {toolInvocation.result.results.length > 3 && (
                                      <div className="text-xs text-blue-700">
                                        ... and {toolInvocation.result.results.length - 3} more
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex items-center text-xs text-green-600">
                              <span className="mr-1">✓</span>
                              Information gathered successfully
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })}

                  {/* Message Content */}
                  <div
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-800 border border-gray-200 shadow-sm'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center mb-2">
                          <div className="w-5 h-5 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs">✨</span>
                          </div>
                          <span className="text-xs font-medium text-gray-500">Magic Assistant</span>
                        </div>
                      )}
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(status === 'submitted' || status === 'streaming') && 
               !messages.some(msg => msg.toolInvocations?.some(tool => tool.state === 'call')) &&
               messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 text-gray-800 border border-gray-200 shadow-sm rounded-2xl px-4 py-3 max-w-[80%]">
                    <div className="flex items-center mb-2">
                      <div className="w-5 h-5 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs">✨</span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">Magic Assistant</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Fixed Input Form at Bottom or Survey Buttons */}
            <div className="mt-auto">
              {showSurveyButton && surveyButtonData ? (
                /* Survey Generation Buttons - Replace input form */
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-lg">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        window.location.href = '/survey-generation';
                      }}
                      className="flex-1 bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105 animate-pulse"
                    >
                      PROCEED TO SURVEY GENERATION
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowSurveyButton(false);
                        setSurveyButtonData(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
                    >
                      Continue Chatting
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular Input Form */
                <div className="bg-white rounded-full border-2 border-gray-200 shadow-lg p-2 focus-within:border-pink-300 transition-colors">
                  <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                    <textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Tell me about your survey goals..."
                      rows={1}
                      disabled={status === 'submitted' || status === 'streaming'}
                      className="flex-1 px-4 py-2 bg-transparent text-gray-700 placeholder-gray-400 resize-none outline-none text-sm focus:outline-none"
                      style={{
                        minHeight: '36px',
                        maxHeight: '120px',
                        overflow: 'hidden'
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={status === 'submitted' || status === 'streaming' || !input.trim()}
                      className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <span className="text-sm">→</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 