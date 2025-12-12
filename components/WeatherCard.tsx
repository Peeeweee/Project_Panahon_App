
import React, { useMemo } from 'react';
import { WeatherResult } from '../types';
import { TemperatureUnit, convertTemperature } from '../utils/temperatureUtils';
import WeatherBackground from './WeatherBackground';

interface WeatherCardProps {
  data: WeatherResult;
  onClose: () => void;
  isExiting: boolean;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  temperatureUnit: TemperatureUnit;
  onShare?: () => void;
  initialPosition?: { x: number; y: number; width: number; height: number };
  countryPath?: string; // SVG path data for the country
  countryRect?: DOMRect; // Original position of the country on map
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, onClose, isExiting, onToggleFavorite, isFavorite, temperatureUnit, onShare, initialPosition, countryPath, countryRect }) => {

  // Calculate transform from country position to card position
  const initialTransform = useMemo(() => {
    if (!initialPosition) return { x: 0, y: 0, scale: 1 };

    // Card final position (center of viewport, slightly left)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardFinalX = viewportWidth / 2;
    const cardFinalY = viewportHeight / 2;

    // Calculate the difference from country position to card center
    const deltaX = initialPosition.x - cardFinalX;
    const deltaY = initialPosition.y - cardFinalY;

    // Calculate scale from country size to card size
    const scaleX = initialPosition.width / 800; // Assuming card width ~800px
    const scaleY = initialPosition.height / 400; // Assuming card height ~400px
    const scale = Math.min(scaleX, scaleY, 0.3); // Start small

    return { x: deltaX, y: deltaY, scale };
  }, [initialPosition]);

  // Convert temperature to selected unit
  const displayTemp = useMemo(() => {
    return convertTemperature(data.temperature, 'C', temperatureUnit);
  }, [data.temperature, temperatureUnit]);

  // Extract main temperature number safely
  const mainTemp = useMemo(() => {
    const match = displayTemp.match(/(-?\d+)/);
    return match ? match[0] : "--";
  }, [displayTemp]);

  // Determine weather type for background effects
  const weatherType = useMemo(() => {
    const c = data.condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'rain';
    if (c.includes('cloud') || c.includes('overcast') || c.includes('fog') || c.includes('mist')) return 'cloudy';
    if (c.includes('snow') || c.includes('ice') || c.includes('blizzard')) return 'snow';
    if (c.includes('storm') || c.includes('thunder')) return 'storm';
    return 'clear';
  }, [data.condition]);

  // Determine Icon based on condition keywords with ANIMATIONS
  const WeatherIcon = useMemo(() => {
    const c = data.condition.toLowerCase();

    // RAIN / DRIZZLE
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
      return (
        <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Cloud Base */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8A7 7 0 104 14.9" />
          {/* Rain Drops */}
          <line x1="8" y1="17" x2="8" y2="19" strokeLinecap="round" strokeWidth={1.5} style={{ animation: 'rain-drop 1s infinite linear', animationDelay: '0s' }} />
          <line x1="12" y1="17" x2="12" y2="19" strokeLinecap="round" strokeWidth={1.5} style={{ animation: 'rain-drop 1s infinite linear', animationDelay: '0.4s' }} />
          <line x1="16" y1="17" x2="16" y2="19" strokeLinecap="round" strokeWidth={1.5} style={{ animation: 'rain-drop 1s infinite linear', animationDelay: '0.8s' }} />
        </svg>
      );
    }
    // CLOUDY / OVERCAST
    else if (c.includes('cloud') || c.includes('overcast') || c.includes('fog') || c.includes('mist')) {
      return (
        <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ animation: 'cloud-float 6s ease-in-out infinite' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    }
    // SNOW / ICE
    else if (c.includes('snow') || c.includes('ice') || c.includes('blizzard')) {
      return (
        <svg className="w-6 h-6 md:w-8 md:h-8 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8A7 7 0 104 14.9" />
          {/* Snowflakes */}
          <circle cx="8" cy="18" r="1" fill="currentColor" style={{ animation: 'snow-fall 3s infinite linear', animationDelay: '0s', transformOrigin: 'center' }} />
          <circle cx="12" cy="18" r="1" fill="currentColor" style={{ animation: 'snow-fall 3s infinite linear', animationDelay: '1s', transformOrigin: 'center' }} />
          <circle cx="16" cy="18" r="1" fill="currentColor" style={{ animation: 'snow-fall 3s infinite linear', animationDelay: '2s', transformOrigin: 'center' }} />
        </svg>
      );
    }
    // THUNDER / STORM
    else if (c.includes('storm') || c.includes('thunder')) {
      return (
        <svg className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8A7 7 0 104 14.9" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 11l-4 6h6l-2 6" className="animate-pulse" />
        </svg>
      );
    }
    // CLEAR / SUNNY (Default)
    else {
      return (
        <svg className="w-6 h-6 md:w-8 md:h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Rotating Rays */}
          <g style={{ animation: 'sun-spin 12s linear infinite', transformOrigin: 'center' }}>
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          </g>
          {/* Pulsing Core */}
          <circle cx="12" cy="12" r="4" fill="currentColor" className="animate-pulse" style={{ animationDuration: '3s' }} />
        </svg>
      );
    }
  }, [data.condition]);

  return (
    <>
      <style>{`
        @keyframes rain-drop {
          0% { transform: translateY(0); opacity: 0; }
          30% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        @keyframes cloud-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes sun-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes snow-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(12px) rotate(180deg); opacity: 0; }
        }
        @keyframes slideToCard {
          0% {
            transform: translate(${initialTransform.x}px, ${initialTransform.y}px) scale(${initialTransform.scale});
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
        }
        @keyframes countrySlideIn {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          100% {
            transform: translate(${countryRect ? `calc(50% - ${countryRect.left + countryRect.width / 2}px), calc(50% - ${countryRect.top + countryRect.height / 2}px)` : '0, 0'}) scale(${countryRect ? Math.min(3, 300 / Math.max(countryRect.width, countryRect.height)) : 1});
            opacity: 0.85;
          }
        }
      `}</style>

      <div
          className={`
              transition-all duration-500 ease-in-out
              ${isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
              max-w-3xl w-full mx-4 md:mx-0
              rounded-[2rem]
              flex flex-col md:flex-row min-h-[380px]
              relative group
          `}
          style={{
            transform: isExiting
              ? 'translateY(1rem) scale(0.95)'
              : initialPosition
                ? `translate(${initialTransform.x}px, ${initialTransform.y}px) scale(${initialTransform.scale})`
                : 'translate(0, 0) scale(1)',
            animation: initialPosition ? 'slideToCard 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none'
          }}
      >
        {/*
            Main Container Border/Shadow Layer
            This provides the shape but has NO background fill or blur,
            allowing the SVG in Z-30 to be seen clearly through the left side.
        */}
        <div className="absolute inset-0 rounded-[2rem] border border-white/10 shadow-2xl pointer-events-none"></div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          {/* Share Button */}
          {onShare && (
            <button
              onClick={onShare}
              className="p-2 bg-black/20 hover:bg-blue-500/30 rounded-full transition-all text-white/50 hover:text-white backdrop-blur-md group"
              title="Share weather"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          )}

          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-all backdrop-blur-md ${
                isFavorite
                  ? 'bg-yellow-500/30 hover:bg-yellow-500/40 text-yellow-300'
                  : 'bg-black/20 hover:bg-white/10 text-white/50 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 bg-black/20 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white backdrop-blur-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* LEFT PANEL: Transparent for Country View
            - Mobile: h-64 (Fixed height to reserve space for animation)
            - Desktop: h-auto (Full height)
        */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative flex flex-col items-center justify-center p-6 overflow-hidden rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none shrink-0">

          {/* Weather Background Animation in Left Panel */}
          <div className="absolute inset-0 rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none overflow-hidden">
            <WeatherBackground weatherType={weatherType} isFullScreen={false} />
          </div>

          {/* Country SVG Animation - Embedded directly in left panel */}
          {countryPath && countryRect && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                opacity: isExiting ? 0 : 0.85,
                transition: 'opacity 800ms ease-out'
              }}
            >
              <defs>
                <linearGradient id="countryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(167, 139, 250, 0.8)" />
                  <stop offset="100%" stopColor="rgba(76, 29, 149, 1)" />
                </linearGradient>
                <filter id="countryShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.4" />
                </filter>
              </defs>
              <path
                d={countryPath}
                fill="url(#countryGradient)"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth={0.8}
                filter="url(#countryShadow)"
                style={{
                  transformOrigin: `${countryRect.left + countryRect.width / 2}px ${countryRect.top + countryRect.height / 2}px`,
                  vectorEffect: 'non-scaling-stroke',
                  animation: 'countrySlideIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                }}
              />
            </svg>
          )}

          {/* Country ISO Code at bottom */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
            <div className="text-white/40 font-bold text-sm tracking-widest uppercase">
              {data.isoCode || "WORLD"}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: The "Glass" Card with Content */}
        <div className="w-full md:w-1/2 bg-slate-900/50 backdrop-blur-2xl p-6 md:p-8 text-white flex flex-col justify-center relative rounded-b-[2rem] md:rounded-r-[2rem] md:rounded-bl-none border-t md:border-t-0 md:border-l border-white/5">

          {/* Glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"></div>

          <div className="relative flex flex-col items-start text-left z-10 w-full">
              {/* Location Header */}
              <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 leading-tight">
                {data.location}
              </h2>

              {/* Condition Pill */}
              <div className="flex items-center gap-2 mb-4 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm shadow-inner shadow-white/5">
                  {WeatherIcon}
                  <span className="text-white/90 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      {data.condition}
                  </span>
              </div>

              {/* Temperature Block */}
              <div className="flex items-end gap-3 mb-5 w-full">
                  <span className="text-6xl md:text-7xl font-extralight tracking-tighter leading-none bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent">
                      {mainTemp}°
                  </span>
                  <div className="flex flex-col text-white/40 text-[10px] font-medium pb-1.5">
                    <span>Current</span>
                    <span>{displayTemp}</span>
                  </div>
              </div>

              {/* Quote Block */}
              <div className="relative mb-6 pl-3 border-l-2 border-purple-400/50">
                  <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed font-light italic">
                  "{data.description}"
                  </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 w-full mb-4">
                  <div className="bg-white/5 rounded-xl p-2.5 flex flex-col border border-white/5 hover:bg-white/10 transition-colors group/stat">
                      <div className="flex items-center gap-1.5 mb-0.5 text-purple-300 text-[9px] font-bold uppercase tracking-wider">
                        <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        Humidity
                      </div>
                      <span className="text-base font-semibold text-white/90 group-hover/stat:text-white transition-colors">{data.humidity}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 flex flex-col border border-white/5 hover:bg-white/10 transition-colors group/stat">
                      <div className="flex items-center gap-1.5 mb-0.5 text-purple-300 text-[9px] font-bold uppercase tracking-wider">
                        <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        Wind
                      </div>
                      <span className="text-base font-semibold text-white/90 group-hover/stat:text-white transition-colors">{data.wind}</span>
                  </div>
              </div>

              {/* Footer Sources */}
              {data.sources.length > 0 && (
              <div className="w-full text-left mt-auto pt-3 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[8px] text-white/30 uppercase tracking-widest font-semibold">Sources</span>
                    {data.sources.map((source, idx) => (
                        <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9px] text-purple-300 hover:text-white transition-colors truncate max-w-[100px] flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded hover:bg-white/10"
                        >
                        {source.title}
                        </a>
                    ))}
                  </div>
              </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherCard;
