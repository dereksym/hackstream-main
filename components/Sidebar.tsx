import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Heart, Award, Edit3, Flame, Play, SidebarCollapse, BrainCircuit } from './Icons.tsx';
import { USERS, HACKATHON_END_DATE, MOCK_LEADERBOARD_DATA } from '../constants.ts';
import { User, UserRole } from '../types.ts';
import { useCountdown } from '../hooks/useCountdown.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface SidebarProps {
    isCollapsed: boolean;
    setCollapsed: (isCollapsed: boolean) => void;
}

const topHackers = MOCK_LEADERBOARD_DATA.slice(0, 3).map(hacker => ({
    id: hacker.idNumber,
    name: hacker.name,
    avatar: hacker.avatar,
    projectId: hacker.projectId,
}));

const NavItem: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode; isCollapsed: boolean }> = ({ to, icon, children, isCollapsed }) => {
  const baseClasses = "flex items-center space-x-4 rounded-md transition-colors duration-200 w-full";
  const inactiveClasses = "text-text-secondary hover:bg-surface-hover hover:text-white";
  const activeClasses = "bg-surface-hover text-white font-semibold";

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isCollapsed ? 'p-3' : 'px-3 py-2.5'}`}
    >
      {icon}
      <span className={`text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>{children}</span>
    </NavLink>
  );
};

const HackerCard: React.FC<{ hacker: typeof topHackers[0] }> = ({ hacker }) => (
    <Link to={`/watch/${hacker.projectId}`} className="flex items-center p-2 rounded-lg hover:bg-surface-hover transition-colors group">
        <img src={hacker.avatar} alt={hacker.name} className="w-10 h-10 rounded-md object-cover mr-3 flex-shrink-0" />
        <div className="flex-grow overflow-hidden">
            <p className="font-semibold text-sm text-white truncate">{hacker.name}</p>
        </div>
        <Play className="w-8 h-8 text-white bg-black/30 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </Link>
);

const SidebarCountdown = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const { timeLeft, isFinished } = useCountdown(HACKATHON_END_DATE);
    const padZero = (num: number) => num.toString().padStart(2, '0');

    if (isCollapsed) {
        return (
            <div className="my-6 p-2 bg-black rounded-lg border border-white/30">
                <div className="font-bold text-sm leading-tight text-white/90">
                    {padZero(timeLeft.days)}D
                </div>
                <div className="font-bold text-sm leading-tight text-white">
                    {padZero(timeLeft.hours)}h
                </div>
            </div>
        )
    }

    return (
        <div className="my-6 p-3 bg-surface rounded-lg text-center border border-surface-accent">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Hackathon Ends In</h3>
            {isFinished ? (
                <span className="text-lg font-bold text-red-500">Time's Up!</span>
            ) : (
                <div className="flex justify-center items-baseline space-x-2 text-text-primary">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold tracking-tighter">{padZero(timeLeft.days)}</span>
                        <span className="text-xs ml-0.5">d</span>
                    </div>
                     <div className="flex items-baseline">
                        <span className="text-2xl font-bold tracking-tighter">{padZero(timeLeft.hours)}</span>
                        <span className="text-xs ml-0.5">h</span>
                    </div>
                     <div className="flex items-baseline">
                        <span className="text-2xl font-bold tracking-tighter">{padZero(timeLeft.minutes)}</span>
                        <span className="text-xs ml-0.5">m</span>
                    </div>
                     <div className="flex items-baseline">
                        <span className="text-2xl font-bold tracking-tighter">{padZero(timeLeft.seconds)}</span>
                        <span className="text-xs ml-0.5">s</span>
                    </div>
                </div>
            )}
        </div>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setCollapsed }) => {
  const { user } = useAuth();
  
  return (
      <aside className={`hidden md:flex fixed top-0 left-0 h-full bg-black text-white p-4 flex-col border-r border-white/[.1] z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`text-2xl font-black text-red-600 tracking-wider mt-1 transition-all whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0' : 'w-auto'}`}>
                HACKSTREAM
            </div>
            <div className={`text-3xl font-black text-red-600 mt-1 transition-all whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-auto' : 'w-0'}`}>
                H
            </div>
        </div>

        <SidebarCountdown isCollapsed={isCollapsed} />

        <nav className="flex flex-col space-y-2">
            <NavItem to="/" icon={<Home className="w-5 h-5 flex-shrink-0" />} isCollapsed={isCollapsed}>Home</NavItem>
            <NavItem to="/following" icon={<Heart className="w-5 h-5 flex-shrink-0" />} isCollapsed={isCollapsed}>Following</NavItem>
            <NavItem to="/leaderboard" icon={<Award className="w-5 h-5 flex-shrink-0" />} isCollapsed={isCollapsed}>Leaderboard</NavItem>
            
            {user.role === UserRole.Participant && (
                <NavItem to="/submit" icon={<Edit3 className="w-5 h-5 flex-shrink-0" />} isCollapsed={isCollapsed}>Studio</NavItem>
            )}

            {(user.role === UserRole.Judge || user.role === UserRole.Organizer) && (
                <NavItem to="/judge" icon={<BrainCircuit className="w-5 h-5 flex-shrink-0" />} isCollapsed={isCollapsed}>Judging</NavItem>
            )}
        </nav>

        <div className="mt-auto">
            <div className={`pt-6 border-t border-white/[.1] transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100'}`}>
                <h2 className="text-base font-bold mb-3 flex items-center space-x-2 text-text-secondary uppercase tracking-wider">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span>Top Hackers</span>
                </h2>
                <div className="flex flex-col space-y-1">
                    {topHackers.map(hacker => <HackerCard key={hacker.id} hacker={hacker} />)}
                </div>
            </div>
             <div className="pt-4 border-t border-white/[.1]">
                <button 
                    onClick={() => setCollapsed(!isCollapsed)}
                    className="flex items-center w-full p-3 rounded-md text-text-secondary hover:bg-surface-hover hover:text-white"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <SidebarCollapse className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </div>
      </aside>
  );
};

export default Sidebar;