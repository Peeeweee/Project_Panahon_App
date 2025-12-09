import React from 'react';
import { FavoriteLocation } from '../types';

interface FavoritesProps {
  favorites: FavoriteLocation[];
  onSelectFavorite: (name: string) => void;
  onRemoveFavorite: (name: string) => void;
  isVisible: boolean;
}

const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
  isVisible
}) => {
  if (!isVisible || favorites.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-sm font-medium">Favorites:</span>
          <div className="flex gap-2">
            {favorites.map((fav) => (
              <div
                key={fav.name}
                className="group relative"
              >
                <button
                  onClick={() => onSelectFavorite(fav.name)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-full px-4 py-2 transition-all duration-200 hover:scale-105"
                >
                  <span className="text-xl">{getLocationEmoji(fav.isoCode)}</span>
                  <span className="text-white text-sm font-medium">{fav.name}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(fav.name);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  title="Remove favorite"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get emoji based on country code
const getLocationEmoji = (isoCode: string): string => {
  const emojiMap: { [key: string]: string } = {
    'US': '🇺🇸',
    'PH': '🇵🇭',
    'JP': '🇯🇵',
    'CN': '🇨🇳',
    'GB': '🇬🇧',
    'FR': '🇫🇷',
    'DE': '🇩🇪',
    'IN': '🇮🇳',
    'BR': '🇧🇷',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'IT': '🇮🇹',
    'ES': '🇪🇸',
    'MX': '🇲🇽',
    'KR': '🇰🇷',
  };

  return emojiMap[isoCode] || '📍';
};

export default Favorites;
