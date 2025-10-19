import React, { createContext, useState, useContext, PropsWithChildren } from 'react';

interface FilterContextType {
  activeCategories: string[];
  setActiveCategories: (categories: string[]) => void;
  showOnlyLive: boolean;
  setShowOnlyLive: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearAllFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: PropsWithChildren) => {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [showOnlyLive, setShowOnlyLive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const clearAllFilters = () => {
    setActiveCategories([]);
    setShowOnlyLive(false);
    setSearchQuery('');
  };

  return (
    <FilterContext.Provider value={{ 
      activeCategories, 
      setActiveCategories, 
      showOnlyLive, 
      setShowOnlyLive,
      searchQuery,
      setSearchQuery,
      clearAllFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
