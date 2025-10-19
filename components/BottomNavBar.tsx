import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Award, Edit3, BrainCircuit } from './Icons.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types.ts';

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
    const baseClasses = "flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200";
    const inactiveClasses = "text-text-secondary hover:text-white";
    const activeClasses = "text-primary";

    return (
        <NavLink to={to} end className={({isActive}) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {icon}
            <span className="text-xs mt-1">{label}</span>
        </NavLink>
    )
}

const BottomNavBar = () => {
    const { user } = useAuth();
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-white/[.1] z-30 flex items-center justify-around backdrop-blur-sm bg-opacity-80">
            <NavItem to="/" icon={<Home className="w-6 h-6"/>} label="Home" />
            <NavItem to="/following" icon={<Heart className="w-6 h-6"/>} label="Following" />
            <NavItem to="/leaderboard" icon={<Award className="w-6 h-6"/>} label="Leaderboard" />
            
            {user.role === UserRole.Participant && (
                <NavItem to="/submit" icon={<Edit3 className="w-6 h-6"/>} label="Studio" />
            )}
            
            {(user.role === UserRole.Judge || user.role === UserRole.Organizer) && (
                <NavItem to="/judge" icon={<BrainCircuit className="w-6 h-6"/>} label="Judging" />
            )}
        </nav>
    );
};

export default BottomNavBar;