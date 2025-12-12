import { useMemo } from 'react';

interface WeatherBackgroundProps {
  weatherType: 'rain' | 'cloudy' | 'snow' | 'storm' | 'clear';
  isFullScreen?: boolean; // If true, covers entire viewport; if false, fits container
}

const WeatherBackground = ({ weatherType, isFullScreen = false }: WeatherBackgroundProps) => {
  // Generate particles for animations
  const particles = useMemo(() => {
    const count = isFullScreen ? 50 : 30;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      left: Math.random() * 100,
      size: Math.random() * 0.5 + 0.5,
    }));
  }, [isFullScreen]);

  const containerClass = isFullScreen
    ? "fixed inset-0 w-screen h-screen pointer-events-none z-0"
    : "absolute inset-0 w-full h-full pointer-events-none overflow-hidden";

  // Rain Effect
  if (weatherType === 'rain') {
    return (
      <div className={containerClass}>
        <style>{`
          @keyframes rainFall {
            0% {
              transform: translateY(-100vh) rotate(15deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(15deg);
              opacity: 0.5;
            }
          }

          @keyframes rainSplash {
            0% {
              transform: scale(0) translateY(0);
              opacity: 1;
            }
            100% {
              transform: scale(1.5) translateY(10px);
              opacity: 0;
            }
          }
        `}</style>

        {/* Rain Droplets */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-0.5 bg-gradient-to-b from-blue-200/80 to-blue-400/40"
            style={{
              left: `${p.left}%`,
              height: `${20 + p.size * 30}px`,
              animation: `rainFall ${p.duration}s linear ${p.delay}s infinite`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}

        {/* Rain overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-blue-800/5 to-blue-900/10" />
      </div>
    );
  }

  // Snow Effect
  if (weatherType === 'snow') {
    return (
      <div className={containerClass}>
        <style>{`
          @keyframes snowFall {
            0% {
              transform: translateY(-10px) translateX(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) translateX(50px) rotate(360deg);
              opacity: 0.8;
            }
          }

          @keyframes snowSway {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(20px);
            }
          }
        `}</style>

        {/* Snowflakes */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/90 shadow-lg"
            style={{
              left: `${p.left}%`,
              width: `${4 + p.size * 6}px`,
              height: `${4 + p.size * 6}px`,
              animation: `snowFall ${p.duration * 1.5}s linear ${p.delay}s infinite, snowSway ${2 + p.size}s ease-in-out infinite`,
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* Snow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200/10 via-white/5 to-blue-100/10" />
      </div>
    );
  }

  // Cloudy Effect
  if (weatherType === 'cloudy') {
    return (
      <div className={containerClass}>
        <style>{`
          @keyframes cloudDrift {
            0% {
              transform: translateX(-20%);
              opacity: 0.3;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              transform: translateX(120%);
              opacity: 0.3;
            }
          }

          @keyframes cloudPulse {
            0%, 100% {
              filter: blur(40px);
            }
            50% {
              filter: blur(60px);
            }
          }
        `}</style>

        {/* Cloud shapes */}
        {particles.slice(0, isFullScreen ? 15 : 8).map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-br from-gray-300/40 to-gray-500/30"
            style={{
              left: `${p.left}%`,
              top: `${(p.id * 15) % 80}%`,
              width: `${100 + p.size * 150}px`,
              height: `${60 + p.size * 80}px`,
              animation: `cloudDrift ${15 + p.duration * 5}s linear ${p.delay}s infinite, cloudPulse 8s ease-in-out infinite`,
              filter: 'blur(50px)',
            }}
          />
        ))}

        {/* Cloudy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-400/10 via-gray-300/5 to-gray-400/10" />
      </div>
    );
  }

  // Storm Effect
  if (weatherType === 'storm') {
    return (
      <div className={containerClass}>
        <style>{`
          @keyframes stormRain {
            0% {
              transform: translateY(-100vh) rotate(25deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(25deg);
              opacity: 0.7;
            }
          }

          @keyframes lightning {
            0%, 90%, 100% {
              opacity: 0;
            }
            92%, 94%, 96% {
              opacity: 0.8;
            }
            93%, 95% {
              opacity: 0.3;
            }
          }

          @keyframes stormClouds {
            0%, 100% {
              transform: translateX(0) scale(1);
              opacity: 0.4;
            }
            50% {
              transform: translateX(30px) scale(1.1);
              opacity: 0.7;
            }
          }
        `}</style>

        {/* Heavy rain */}
        {particles.map(p => (
          <div
            key={`rain-${p.id}`}
            className="absolute w-1 bg-gradient-to-b from-blue-100/90 to-blue-300/60"
            style={{
              left: `${p.left}%`,
              height: `${30 + p.size * 40}px`,
              animation: `stormRain ${p.duration * 0.7}s linear ${p.delay}s infinite`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}

        {/* Dark storm clouds */}
        {particles.slice(0, isFullScreen ? 10 : 6).map(p => (
          <div
            key={`cloud-${p.id}`}
            className="absolute rounded-full bg-gradient-to-br from-gray-700/50 to-gray-900/40"
            style={{
              left: `${p.left}%`,
              top: `${(p.id * 20) % 60}%`,
              width: `${120 + p.size * 180}px`,
              height: `${70 + p.size * 100}px`,
              animation: `stormClouds ${6 + p.duration}s ease-in-out infinite`,
              filter: 'blur(60px)',
            }}
          />
        ))}

        {/* Lightning flashes */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-yellow-200/60 via-white/40 to-blue-200/30"
          style={{
            animation: 'lightning 8s infinite',
            mixBlendMode: 'screen',
          }}
        />

        {/* Storm overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-gray-800/10 to-blue-900/20" />
      </div>
    );
  }

  // Clear/Sunny Effect
  if (weatherType === 'clear') {
    return (
      <div className={containerClass}>
        <style>{`
          @keyframes sunRays {
            0% {
              transform: rotate(0deg);
              opacity: 0.2;
            }
            50% {
              opacity: 0.4;
            }
            100% {
              transform: rotate(360deg);
              opacity: 0.2;
            }
          }

          @keyframes sparkle {
            0%, 100% {
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: scale(1) rotate(180deg);
              opacity: 1;
            }
          }

          @keyframes sunGlow {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.1);
            }
          }
        `}</style>

        {/* Sun rays */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute w-[800px] h-[800px]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255, 200, 50, 0.15) 10deg, transparent 20deg, transparent 40deg, rgba(255, 220, 100, 0.15) 50deg, transparent 60deg, transparent 80deg, rgba(255, 200, 50, 0.15) 90deg, transparent 100deg)',
              animation: 'sunRays 40s linear infinite',
              filter: 'blur(2px)',
            }}
          />
        </div>

        {/* Sparkles */}
        {particles.slice(0, isFullScreen ? 20 : 12).map(p => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.left}%`,
              top: `${(p.id * 17) % 100}%`,
            }}
          >
            <div
              className="w-2 h-2 bg-yellow-200/60 rounded-full"
              style={{
                animation: `sparkle ${3 + p.duration}s ease-in-out ${p.delay}s infinite`,
                boxShadow: '0 0 10px rgba(255, 220, 100, 0.6)',
              }}
            />
          </div>
        ))}

        {/* Warm glow overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-yellow-200/10 via-orange-100/5 to-amber-200/10"
          style={{
            animation: 'sunGlow 8s ease-in-out infinite',
          }}
        />
      </div>
    );
  }

  return null;
};

export default WeatherBackground;
