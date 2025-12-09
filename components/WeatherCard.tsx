
import React, { useMemo } from 'react';
import { WeatherResult } from '../types';

interface WeatherCardProps {
  data: WeatherResult;
  onClose: () => void;
  isExiting: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, onClose, isExiting }) => {
  
  // Extract main temperature number safely
  const mainTemp = useMemo(() => {
    const match = data.temperature.match(/(-?\d+)/);
    return match ? match[0] : "--";
  }, [data.temperature]);

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
      `}</style>

      <div 
          className={`
              transition-all duration-700 ease-in-out
              ${isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0 animate-in fade-in slide-in-from-bottom-10'}
              max-w-3xl w-full mx-4 md:mx-0
              rounded-[2rem] 
              flex flex-col md:flex-row min-h-[380px]
              relative group
          `}
      >
        {/* 
            Main Container Border/Shadow Layer
            This provides the shape but has NO background fill or blur, 
            allowing the SVG in Z-30 to be seen clearly through the left side.
        */}
        <div className="absolute inset-0 rounded-[2rem] border border-white/10 shadow-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white backdrop-blur-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* LEFT PANEL: Transparent for Country View 
            - Mobile: h-64 (Fixed height to reserve space for animation)
            - Desktop: h-auto (Full height)
        */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative flex flex-col items-center justify-end p-6 overflow-hidden rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-tr-none shrink-0">
          {/* Dynamic Watermark at bottom */}
          <div className="text-white/[0.05] font-black text-[5rem] md:text-[8rem] select-none pointer-events-none leading-none tracking-tighter mix-blend-overlay" style={{ fontFamily: 'Inter, sans-serif' }}>
              {data.isoCode || "WRLD"}
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
                    <span>{data.temperature}</span>
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
