import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { ChatMessage as ChatMessageType } from '../types.ts';
import { MOCK_MESSAGES, MOCK_CHAT_USERS } from '../constants.ts';
import ChatMessage from './ChatMessage.tsx';
import { Send, BrainCircuit, X } from './Icons.tsx';
import { summarizeChat } from '../services/geminiService.ts';

const Chat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessageType[]>(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    // Simulate new messages coming in
    useEffect(() => {
        const interval = setInterval(() => {
            const randomUser = MOCK_CHAT_USERS[Math.floor(Math.random() * MOCK_CHAT_USERS.length)];
            const randomMessage = [
                "This is so cool!", "Can't wait to see the final demo.", "What library are they using for the UI?",
                "This gives me an idea for my own project.", "The stream quality is great.", "🤯🤯🤯"
            ][Math.floor(Math.random() * 6)];
            
            const incomingMessage: ChatMessageType = {
                id: `msg${Date.now()}`,
                user: randomUser,
                message: randomMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, incomingMessage]);
        }, 8000); // Add a new message every 8 seconds

        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        
        // Clear previous summary as it's now outdated
        if (summary) setSummary(null);

        const messageToSend: ChatMessageType = {
            id: `msg${Date.now()}`,
            user: user,
            message: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, messageToSend]);
        setNewMessage('');
    };
    
    const handleSummarize = async () => {
        setIsSummarizing(true);
        setError(null);
        setSummary(null);
        try {
            const result = await summarizeChat(messages);
            setSummary(result);
        } catch (err) {
            setError('Failed to generate summary.');
            console.error(err);
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="bg-surface rounded-lg border border-surface-accent h-full flex flex-col">
            <div className="p-4 border-b border-surface-accent flex justify-between items-center">
                <h2 className="text-lg font-bold">Stream Chat</h2>
                <button 
                    onClick={handleSummarize} 
                    disabled={isSummarizing}
                    className="p-2 rounded-full hover:bg-surface-accent-hover transition-colors disabled:opacity-50 disabled:cursor-wait"
                    aria-label="Summarize Chat with AI"
                >
                    <BrainCircuit className={`w-5 h-5 ${isSummarizing ? 'animate-pulse' : ''}`} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                 {summary && (
                    <div className="p-3 m-2 bg-surface-accent rounded-lg border border-primary/30 animate-fade-in" style={{ animationDuration: '300ms' }}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-sm flex items-center gap-2"><BrainCircuit className="w-5 h-5"/> Chat Summary</h3>
                            <button onClick={() => setSummary(null)} className="p-1 rounded-full hover:bg-surface-hover">
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                        <p className="text-sm text-text-secondary whitespace-pre-wrap">{summary}</p>
                    </div>
                )}
                <div className="p-2">
                    {messages.map(msg => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-surface-accent">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Send a message..."
                        className="w-full bg-surface-accent border border-surface-accent rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button type="submit" className="bg-primary hover:bg-primary-hover rounded-lg p-2 flex-shrink-0">
                        <Send className="w-5 h-5 text-white" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;