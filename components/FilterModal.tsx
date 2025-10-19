import React, { useState, useEffect, useRef } from 'react';
import { useFilter } from '../context/FilterContext.tsx';
import { CATEGORIES } from '../constants.ts';
import { X } from './Icons.tsx';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, anchorRef }) => {
  const { activeCategories, setActiveCategories, showOnlyLive, setShowOnlyLive, clearAllFilters } = useFilter();
  const [selected, setSelected] = useState<string[]>(activeCategories);
  const [isLiveChecked, setIsLiveChecked] = useState<boolean>(showOnlyLive);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(activeCategories);
    setIsLiveChecked(showOnlyLive);
  }, [activeCategories, showOnlyLive, isOpen]);
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !anchorRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  const handleToggleCategory = (category: string) => {
    setSelected(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleApply = () => {
    setActiveCategories(selected);
    setShowOnlyLive(isLiveChecked);
    onClose();
  };

  const handleClear = () => {
    clearAllFilters();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="absolute top-full mt-2 right-0 w-96 max-w-sm liquid-glass-background rounded-2xl z-50 animate-fade-in text-text-primary"
      style={{ animationDuration: '200ms' }}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/20">
        <h3 className="text-lg font-bold">Filter by</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 border-b border-white/20">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-semibold text-text-primary">Live Now</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isLiveChecked} 
              onChange={() => setIsLiveChecked(prev => !prev)} 
            />
            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-[#5fed83] transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
        </label>
      </div>
      <div className="p-4 max-h-72 overflow-y-auto">
         <h4 className="text-md font-bold mb-2 text-text-primary">Category</h4>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(category => (
            <label key={category} className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(category)}
                onChange={() => handleToggleCategory(category)}
                className="h-4 w-4 bg-transparent border-white/30 rounded text-primary focus:ring-primary focus:ring-offset-0 accent-primary"
              />
              <span className="text-sm select-none text-text-primary">{category}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end items-center p-4 border-t border-white/20 space-x-3">
        <button onClick={handleClear} className="text-sm font-semibold text-text-secondary hover:text-white">
          Clear All
        </button>
        <button onClick={handleApply} className="bg-primary hover:bg-primary-hover font-bold text-white py-2 px-6 rounded-lg text-sm">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterModal;