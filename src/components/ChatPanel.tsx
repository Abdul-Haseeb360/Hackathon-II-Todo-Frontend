'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Import the chat API
import { chatAPI } from '../../lib/api';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM updates before scrolling
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 10); // Small delay to ensure DOM is updated
  };

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      // Add user message
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newUserMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        console.log('Calling chat API with message:', inputValue);
        // Call the real API
        const response = await chatAPI.sendMessage(inputValue, undefined);

        console.log('Received response from API:', response);

        console.log('Processed chat response successfully');

        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response.response,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('Error calling chat API:', error);

        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: `Sorry, I encountered an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 w-auto md:w-80 h-[60vh] md:h-[500px] z-50 flex flex-col">
      <Card className="h-full flex flex-col border rounded-lg shadow-xl overflow-hidden">
        <CardHeader className="p-3 pb-2 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">AI Todo Assistant</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 cursor-pointer">
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages container with auto scrolling */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/5 custom-scrollbar">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow-sm ${message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none border'
                      }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-3 py-2 rounded-2xl text-sm bg-muted text-muted-foreground rounded-bl-none border animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
              {/* Invisible anchor for auto-scroll */}
              <div ref={messagesEndRef} className="h-px" />
            </div>
          </div>
          {/* Input area fixed at the bottom */}
          <div className="p-4 border-t bg-background mt-auto">
            <div className="flex gap-2 items-end">
              <Textarea
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="resize-none text-sm min-h-[44px] max-h-32 py-3 flex-1 rounded-xl focus-visible:ring-1"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-[44px] w-[44px] rounded-xl flex-shrink-0 cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}