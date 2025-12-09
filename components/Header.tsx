import React from 'react';

interface HeaderProps {
    showControls: boolean;
    onToggleSearch: () => void;
    isSearchOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ showControls, onToggleSearch, isSearchOpen }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 p-6 flex items-center justify-end pointer-events-none">
        
        {/* Right Side Controls */}
        <div className={`flex items-center gap-6 transition-all duration-1000 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            
            {/* Date Display */}
            <div className="hidden md:block text-white/40 text-sm font-mono tracking-wider">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'})}
            </div>

            {/* Search Toggle Button */}
            <button 
                onClick={onToggleSearch}
                className={`pointer-events-auto p-3 rounded-full transition-all duration-300 ${isSearchOpen ? 'bg-white text-purple-900 rotate-90' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
                {isSearchOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
            </button>
        </div>
    </header>
  );
};

export default Header;