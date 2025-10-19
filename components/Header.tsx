import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useFilter } from '../context/FilterContext.tsx';
import { UserRole } from '../types.ts';
import { Search, Bell, Filter, ChevronDown } from './Icons.tsx';
import FilterModal from './FilterModal.tsx';

// Glassmorphism design tokens
const glassBase = "liquid-glass-background transition-all duration-150 ease-out";
const glassInteraction = "hover:bg-white/[.12] active:translate-y-px active:shadow-md";
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70";

const SearchPill = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const { activeCategories, showOnlyLive, searchQuery, setSearchQuery } = useFilter();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const filterCount = activeCategories.length + (showOnlyLive ? 1 : 0);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(localSearch);
      e.currentTarget.blur();
    }
  };

  return (
    <div className={`group relative flex items-center h-11 w-full max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${glassBase} rounded-full focus-within:ring-2 focus-within:ring-primary/70`}>
       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white" />
       </div>
       <input
         type="text"
         placeholder="Search..."
         value={localSearch}
         onChange={(e) => setLocalSearch(e.target.value)}
         onKeyDown={handleKeyDown}
         className="w-full h-full bg-transparent pl-11 pr-12 text-sm text-white placeholder-white focus:outline-none"
         aria-label="Search"
       />
       <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
         <button 
           ref={filterButtonRef}
           onClick={() => setIsFilterModalOpen(prev => !prev)}
           className={`relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 ${focusRing}`} 
           aria-label="Open filters"
         >
           <Filter className="h-5 w-5 text-gray-300" />
           {filterCount > 0 && (
              <div role="status" aria-label={`${filterCount} filters active`} className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white border-2 border-background">
                {filterCount}
              </div>
           )}
         </button>
       </div>
       <FilterModal 
          isOpen={isFilterModalOpen} 
          onClose={() => setIsFilterModalOpen(false)}
          anchorRef={filterButtonRef}
        />
    </div>
  );
};

const NotificationBell = () => {
    return (
        <button className={`relative h-9 w-9 flex items-center justify-center rounded-full ${glassBase} ${glassInteraction} ${focusRing}`} aria-label="Notifications">
            <Bell className="h-5 w-5 text-gray-200" />
            <div role="status" aria-label="1 unread notification" className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-background"></div>
        </button>
    );
};

const ProfileChip = () => {
    const { user, setUserRole } = useAuth();
    return (
        <div className={`relative flex items-center gap-2 h-10 px-2 ${glassBase} rounded-full ${glassInteraction} cursor-pointer`} aria-haspopup="listbox">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full flex-shrink-0"/>
            <div className="hidden sm:block flex-1 text-left overflow-hidden">
                <div className="text-sm font-semibold text-white leading-tight truncate">{user.name}</div>
                <div className="text-xs text-gray-400 leading-tight truncate">@{user.role}</div>
            </div>
             {/* The select is visually hidden but functional for demo purposes, triggered by clicking the chip */}
            <select
                value={user.role}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Switch user role"
            >
                <option value={UserRole.Visitor}>Visitor</option>
                <option value={UserRole.Participant}>Participant</option>
                <option value={UserRole.Judge}>Judge</option>
                <option value={UserRole.Organizer}>Organizer</option>
            </select>
            <ChevronDown className="hidden sm:block h-5 w-5 text-gray-400 flex-shrink-0 pointer-events-none" />
        </div>
    );
};


const Header: React.FC<{ isSidebarCollapsed: boolean; }> = ({ isSidebarCollapsed }) => {
  return (
    <header className={`fixed top-0 right-0 z-20 h-16 grid grid-cols-2 md:grid-cols-3 items-center px-4 sm:px-6 transition-all duration-300 ease-in-out left-0 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'}`}>
        <div className="flex justify-start md:col-start-2 md:justify-center">
            <SearchPill />
        </div>
        <div className="flex justify-end items-center gap-2 sm:gap-4 col-start-2 md:col-start-3">
            <NotificationBell />
            <ProfileChip />
        </div>
    </header>
  );
};

export default Header;