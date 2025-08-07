

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Send, Languages, Loader2, MessageSquare } from 'lucide-react';
import { conversations as allConversations, users, orders } from '@/lib/data';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { translateTextAction } from '@/app/actions';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Conversation, Message } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSocket } from '@/hooks/use-socket';


const MessageTranslation = ({ text }: { text: string }) => {
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (language: string) => {
    setIsTranslating(true);
    const result = await translateTextAction({ text, targetLanguage: language });
    setTranslation(result);
    setIsTranslating(false);
  }

  return (
    <div className="mt-2 text-sm">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-foreground">
                    <Languages className="mr-1 h-3 w-3" />
                    Translate
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleTranslate('English')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTranslate('Spanish')}>Spanish</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTranslate('French')}>French</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTranslate('German')}>German</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTranslate('Japanese')}>Japanese</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        {isTranslating && (
            <p className="mt-1 text-muted-foreground text-xs flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Translating...
            </p>
        )}
        {translation && (
            <div className="mt-1 text-muted-foreground text-xs italic border-l-2 pl-2">
                {translation}
            </div>
        )}
    </div>
  )
}


export default function MessagesPage() {
  const [user, loading] = useAuthState(auth);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('id');
  const { socket, isConnected } = useSocket();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>(allConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!user) return;
    // Find all users this user has an order with (as client or freelancer)
    const userOrders = orders.filter(order => order.client.id === user.uid || order.gig.freelancer.id === user.uid);
    const allowedUserIds = new Set<string>();
    userOrders.forEach(order => {
      allowedUserIds.add(order.client.id);
      allowedUserIds.add(order.gig.freelancer.id);
    });
    // Only allow conversations where both participants are in allowedUserIds
    setFilteredConversations(
      allConversations.filter(conv =>
        conv.participants.every(p => allowedUserIds.has(p.id))
      )
    );
  }, [user]);
  
  // Socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Join a room for each conversation
    allConversations.forEach(conv => socket.emit('joinConversation', conv.id));

    const handleReceiveMessage = (message: Message, convId: string) => {
      setConversations(prevConvs => {
        return prevConvs.map(c => {
          if (c.id === convId) {
            // Check if message already exists to prevent duplicates
            if (c.messages.some(m => m.id === message.id)) {
                return c;
            }
            const newMessages = [...c.messages, message];
            return {
              ...c,
              messages: newMessages,
              lastMessage: { text: message.text, timestamp: 'Just now' },
            };
          }
          return c;
        });
      });

      // Also update selected conversation if it matches
      if (selectedConversation?.id === convId) {
          setSelectedConversation(prev => {
            if (!prev) return null;
            // Check if message already exists
            if (prev.messages.some(m => m.id === message.id)) {
                return prev;
            }
            return {...prev, messages: [...prev.messages, message]};
          });
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, selectedConversation?.id]);

  useEffect(() => {
    // scroll to bottom when a new message appears
     if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [selectedConversation?.messages]);
  

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return notFound();
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !socket) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.uid,
      text: newMessage,
      timestamp: new Date(),
    };
    
    socket.emit('sendMessage', message, selectedConversation.id);
    setNewMessage('');
  };

  return (
    <Card className="h-[calc(100vh-8rem)]">
        <CardContent className="p-0 h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                <div className="col-span-1 border-r flex flex-col">
                    <div className="p-4 border-b">
                        <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search conversations" className="pl-10" />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        {filteredConversations.map((conv) => {
                        const otherParticipant = conv.participants.find(p => p.id !== user.uid); // simplified for demo
                        return (
                            <button
                            key={conv.id}
                            className={cn(
                                'flex flex-col items-start gap-2 rounded-lg p-3 text-left text-sm transition-all hover:bg-accent w-full',
                                selectedConversation?.id === conv.id && 'bg-accent'
                            )}
                             onClick={() => setSelectedConversation(conv)}
                            >
                            <div className="flex w-full items-center gap-2">
                                <Avatar>
                                    <AvatarImage src={otherParticipant?.avatarUrl} />
                                    <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{otherParticipant?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate max-w-40">
                                        {conv.lastMessage.text}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                                    {conv.unreadCount}
                                </div>
                                )}
                            </div>
                            </button>
                        );
                        })}
                    </ScrollArea>
                </div>
                <div className="col-span-2 flex flex-col h-full">
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b flex items-center gap-4">
                             <Avatar>
                                <AvatarImage src={selectedConversation.participants.find(p => p.id !== user.uid)?.avatarUrl} />
                                <AvatarFallback>{selectedConversation.participants.find(p => p.id !== user.uid)?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                                <h2 className="text-xl font-bold">{selectedConversation.participants.find(p => p.id !== user.uid)?.name}</h2>
                                <div className={cn("text-xs flex items-center gap-1.5", isConnected ? 'text-green-500' : 'text-yellow-500')}>
                                    <span className={cn("h-2 w-2 rounded-full", isConnected ? 'bg-green-500' : 'bg-yellow-500')}></span>
                                    {isConnected ? 'Online' : 'Connecting...'}
                                </div>
                            </div>
                        </div>
                        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                            <div className="space-y-4">
                            {selectedConversation.messages.map((message) => (
                                <div
                                key={message.id}
                                className={cn(
                                    'flex items-end gap-2',
                                    message.senderId === user.uid ? 'justify-end' : 'justify-start'
                                )}
                                >
                                {message.senderId !== user.uid && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selectedConversation.participants.find(p => p.id === message.senderId)?.avatarUrl} />
                                         <AvatarFallback>{selectedConversation.participants.find(p => p.id === message.senderId)?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                    'max-w-xs rounded-lg p-3 text-sm',
                                    message.senderId === user.uid
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                    )}
                                >
                                    <p>{message.text}</p>
                                    <p className={cn("text-xs mt-1", message.senderId === user.uid ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                                    </p>
                                    {message.senderId !== user.uid && (
                                        <MessageTranslation text={message.text} />
                                    )}
                                </div>
                                </div>
                            ))}
                            </div>
                        </ScrollArea>
                        <Separator />
                        <div className="p-4">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <Input
                                autoComplete="off"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={!isConnected}
                            />
                            <Button type="submit" size="icon" disabled={!newMessage.trim() || !isConnected}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center">
                            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-lg font-semibold">No Conversation Selected</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Select a conversation from the list to start chatting.</p>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
