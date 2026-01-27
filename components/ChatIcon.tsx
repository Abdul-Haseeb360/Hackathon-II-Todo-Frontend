/**
 * Floating chat icon component for the AI chatbot
 */
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface ChatIconProps {
  onClick: () => void;
}

const ChatIcon: React.FC<ChatIconProps> = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  return isVisible ? (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center"
      aria-label="Open chat"
    >
      <Bot className="h-6 w-6 text-white" />
    </Button>
  ) : null;
};

export default ChatIcon;