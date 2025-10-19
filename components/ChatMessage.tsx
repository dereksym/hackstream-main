import React from 'react';
import { ChatMessage as ChatMessageType, UserRole } from '../types.ts';

interface ChatMessageProps {
    message: ChatMessageType;
}

const roleColors: { [key in UserRole]: string } = {
    [UserRole.Organizer]: 'text-red-400',
    [UserRole.Judge]: 'text-green-400',
    [UserRole.Participant]: 'text-blue-400',
    [UserRole.Visitor]: 'text-purple-400',
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const { user, message: text } = message;
    const nameColor = roleColors[user.role] || 'text-purple-400';

    return (
        <div className="flex items-start space-x-3 py-2 px-4 hover:bg-surface-hover rounded-md">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mt-1" />
            <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                    <span className={`font-bold text-sm ${nameColor}`}>{user.name}</span>
                </div>
                <p className="text-sm text-text-primary leading-snug">{text}</p>
            </div>
        </div>
    );
};

export default ChatMessage;