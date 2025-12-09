import React from 'react';
import { TemperatureUnit } from '../utils/temperatureUtils';

interface HeaderProps {
    showControls: boolean;
    onToggleSearch: () => void;
    isSearchOpen: boolean;
    onCurrentLocation: () => void;
    onToggleDashboard: () => void;
    temperatureUnit: TemperatureUnit;
    onToggleTemperatureUnit: () => void;
    viewMode: 'map' | 'list';
    onToggleView: () => void;
}

const Header: React.FC<HeaderProps> = ({ showControls, onToggleSearch, isSearchOpen, onCurrentLocation, onToggleDashboard, temperatureUnit, onToggleTemperatureUnit, viewMode, onToggleView }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 p-6 flex items-center justify-end pointer-events-none">

        {/* Right Side Controls */}
        <div className={`flex items-center gap-3 transition-all duration-1000 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>

            {/* Date Display */}
            <div className="hidden md:block text-white/40 text-sm font-mono tracking-wider">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'})}
            </div>

            {/* View Toggle Button (Map/List) */}
            <button
                type="button"
                onClick={onToggleView}
                className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group"
                title={viewMode === 'map' ? 'Switch to List View' : 'Switch to Map View'}
            >
                {viewMode === 'map' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </button>

            {/* Temperature Unit Toggle */}
            <button
                type="button"
                onClick={onToggleTemperatureUnit}
                className="pointer-events-auto px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group font-mono font-bold"
                title={`Switch to °${temperatureUnit === 'C' ? 'F' : 'C'}`}
            >
                °{temperatureUnit}
            </button>

            {/* Dashboard Button */}
            <button
                type="button"
                onClick={onToggleDashboard}
                className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group"
                title="Weather Dashboard"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            </button>

            {/* Current Location Button */}
            <button
                type="button"
                onClick={onCurrentLocation}
                className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group"
                title="Use my location"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>

            {/* Search Toggle Button */}
            <button
                type="button"
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