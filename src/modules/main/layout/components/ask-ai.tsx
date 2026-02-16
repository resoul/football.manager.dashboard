import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Send, Bot, User, Mic, X, FileText, Plus, Fullscreen, Group } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/dialog';
import { ScrollArea } from '@/components/scroll-area';
import { Avatar, AvatarFallback } from '@/components/avatar';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ZeroChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AskAI({ open, onOpenChange }: ZeroChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I can help you draft that email. Here's a professional version:",
        "Based on your request, I suggest this approach:",
        "I understand you need to follow up. Here's what I recommend:",
        "Let me help you craft a clear and concise message:",
        "I can assist with that. Here's a professional response:"
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className={`flex flex-col p-0 overflow-hidden [&_[data-slot='dialog-close']]:hidden ${
        isFullscreen 
          ? 'w-full h-full max-w-none max-h-none' 
          : 'max-w-[400px] w-full h-full max-h-[500px] fixed bottom-3 right-3 top-auto left-auto translate-x-0 translate-y-0 p-0'
      }`}>
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-2 py-1 bg-background border-b">
          <Button className="mt-1.5" variant="ghost" size="sm" mode="icon" onClick={() => onOpenChange(false)}>
            <X />
          </Button> 

          <div className="flex items-center gap-2">
            {!isFullscreen && (
              <Button variant="ghost" size="sm" mode="icon" onClick={() => setIsFullscreen(true)}>
                <Fullscreen />
              </Button>
            )}
            {isFullscreen && (
              <Button variant="ghost" size="sm" mode="icon" onClick={() => setIsFullscreen(false)}>
                <Group />
              </Button>
            )}

            <div className="size-6 rounded-full border flex items-center justify-center">
              <span className="text-xs font-normal text-muted-foreground">0</span>
            </div>
            <Button variant="ghost" size="sm" mode="icon">
              <FileText />
            </Button>
            <Button variant="ghost" size="sm" mode="icon">
              <Plus />
            </Button>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                 
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {!message.isUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg py-2 px-3 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.isUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted-foreground text-muted">
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-foreground rounded-lg py-2 px-3">
                  <div className="flex space-x-1">
                    <div className="size-1 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="size-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="size-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" mode="icon">
                <Mic />
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                mode="icon"
                variant="primary"
              >
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}