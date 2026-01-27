import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatIconProps {
  onClick: () => void;
}

export default function ChatIcon({ onClick }: ChatIconProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-primary hover:bg-primary/90 z-50"
      aria-label="Open chat"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}