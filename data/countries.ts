// Comprehensive list of all countries and regions organized by continent
// NO COUNTRY LEFT BEHIND - Complete world coverage

export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2 code
  flag: string; // Emoji flag
  capital?: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export interface Continent {
  name: string;
  emoji: string;
  countries: Country[];
}

export const WORLD_COUNTRIES: Continent[] = [
  {
    name: 'Africa',
    emoji: '🌍',
    countries: [
      { name: 'Algeria', code: 'DZ', flag: '🇩🇿', capital: 'Algiers', coordinates: { lat: 36.7538, lon: 3.0588 } },
      { name: 'Angola', code: 'AO', flag: '🇦🇴', capital: 'Luanda', coordinates: { lat: -8.8383, lon: 13.2344 } },
      { name: 'Benin', code: 'BJ', flag: '🇧🇯', capital: 'Porto-Novo', coordinates: { lat: 6.4969, lon: 2.6289 } },
      { name: 'Botswana', code: 'BW', flag: '🇧🇼', capital: 'Gaborone', coordinates: { lat: -24.6282, lon: 25.9231 } },
      { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫', capital: 'Ouagadougou', coordinates: { lat: 12.3714, lon: -1.5197 } },
      { name: 'Burundi', code: 'BI', flag: '🇧🇮', capital: 'Gitega', coordinates: { lat: -3.4269, lon: 29.9189 } },
      { name: 'Cameroon', code: 'CM', flag: '🇨🇲', capital: 'Yaoundé', coordinates: { lat: 3.8480, lon: 11.5021 } },
      { name: 'Cape Verde', code: 'CV', flag: '🇨🇻', capital: 'Praia', coordinates: { lat: 14.9331, lon: -23.5133 } },
      { name: 'Central African Republic', code: 'CF', flag: '🇨🇫', capital: 'Bangui', coordinates: { lat: 4.3947, lon: 18.5582 } },
      { name: 'Chad', code: 'TD', flag: '🇹🇩', capital: "N'Djamena", coordinates: { lat: 12.1348, lon: 15.0557 } },
      { name: 'Comoros', code: 'KM', flag: '🇰🇲', capital: 'Moroni', coordinates: { lat: -11.6986, lon: 43.2554 } },
      { name: 'Congo', code: 'CG', flag: '🇨🇬', capital: 'Brazzaville', coordinates: { lat: -4.2634, lon: 15.2429 } },
      { name: 'DR Congo', code: 'CD', flag: '🇨🇩', capital: 'Kinshasa', coordinates: { lat: -4.3276, lon: 15.3136 } },
      { name: "Côte d'Ivoire", code: 'CI', flag: '🇨🇮', capital: 'Yamoussoukro', coordinates: { lat: 6.8270, lon: -5.2893 } },
      { name: 'Djibouti', code: 'DJ', flag: '🇩🇯', capital: 'Djibouti', coordinates: { lat: 11.8251, lon: 42.5903 } },
      { name: 'Egypt', code: 'EG', flag: '🇪🇬', capital: 'Cairo', coordinates: { lat: 30.0444, lon: 31.2357 } },
      { name: 'Equatorial Guinea', code: 'GQ', flag: '🇬🇶', capital: 'Malabo', coordinates: { lat: 3.7504, lon: 8.7371 } },
      { name: 'Eritrea', code: 'ER', flag: '🇪🇷', capital: 'Asmara', coordinates: { lat: 15.3229, lon: 38.9251 } },
      { name: 'Eswatini', code: 'SZ', flag: '🇸🇿', capital: 'Mbabane', coordinates: { lat: -26.3054, lon: 31.1367 } },
      { name: 'Ethiopia', code: 'ET', flag: '🇪🇹', capital: 'Addis Ababa', coordinates: { lat: 9.0320, lon: 38.7469 } },
      { name: 'Gabon', code: 'GA', flag: '🇬🇦', capital: 'Libreville', coordinates: { lat: 0.4162, lon: 9.4673 } },
      { name: 'Gambia', code: 'GM', flag: '🇬🇲', capital: 'Banjul', coordinates: { lat: 13.4549, lon: -16.5790 } },
      { name: 'Ghana', code: 'GH', flag: '🇬🇭', capital: 'Accra', coordinates: { lat: 5.6037, lon: -0.1870 } },
      { name: 'Guinea', code: 'GN', flag: '🇬🇳', capital: 'Conakry', coordinates: { lat: 9.6412, lon: -13.5784 } },
      { name: 'Guinea-Bissau', code: 'GW', flag: '🇬🇼', capital: 'Bissau', coordinates: { lat: 11.8037, lon: -15.1804 } },
      { name: 'Kenya', code: 'KE', flag: '🇰🇪', capital: 'Nairobi', coordinates: { lat: -1.2921, lon: 36.8219 } },
      { name: 'Lesotho', code: 'LS', flag: '🇱🇸', capital: 'Maseru', coordinates: { lat: -29.3167, lon: 27.4833 } },
      { name: 'Liberia', code: 'LR', flag: '🇱🇷', capital: 'Monrovia', coordinates: { lat: 6.3156, lon: -10.8074 } },
      { name: 'Libya', code: 'LY', flag: '🇱🇾', capital: 'Tripoli', coordinates: { lat: 32.8872, lon: 13.1913 } },
      { name: 'Madagascar', code: 'MG', flag: '🇲🇬', capital: 'Antananarivo', coordinates: { lat: -18.8792, lon: 47.5079 } },
      { name: 'Malawi', code: 'MW', flag: '🇲🇼', capital: 'Lilongwe', coordinates: { lat: -13.9626, lon: 33.7741 } },
      { name: 'Mali', code: 'ML', flag: '🇲🇱', capital: 'Bamako', coordinates: { lat: 12.6392, lon: -8.0029 } },
      { name: 'Mauritania', code: 'MR', flag: '🇲🇷', capital: 'Nouakchott', coordinates: { lat: 18.0735, lon: -15.9582 } },
      { name: 'Mauritius', code: 'MU', flag: '🇲🇺', capital: 'Port Louis', coordinates: { lat: -20.1609, lon: 57.5012 } },
      { name: 'Morocco', code: 'MA', flag: '🇲🇦', capital: 'Rabat', coordinates: { lat: 33.9716, lon: -6.8498 } },
      { name: 'Mozambique', code: 'MZ', flag: '🇲🇿', capital: 'Maputo', coordinates: { lat: -25.9655, lon: 32.5832 } },
      { name: 'Namibia', code: 'NA', flag: '🇳🇦', capital: 'Windhoek', coordinates: { lat: -22.5597, lon: 17.0832 } },
      { name: 'Niger', code: 'NE', flag: '🇳🇪', capital: 'Niamey', coordinates: { lat: 13.5127, lon: 2.1128 } },
      { name: 'Nigeria', code: 'NG', flag: '🇳🇬', capital: 'Abuja', coordinates: { lat: 9.0765, lon: 7.3986 } },
      { name: 'Rwanda', code: 'RW', flag: '🇷🇼', capital: 'Kigali', coordinates: { lat: -1.9403, lon: 29.8739 } },
      { name: 'São Tomé and Príncipe', code: 'ST', flag: '🇸🇹', capital: 'São Tomé', coordinates: { lat: 0.3302, lon: 6.7273 } },
      { name: 'Senegal', code: 'SN', flag: '🇸🇳', capital: 'Dakar', coordinates: { lat: 14.6928, lon: -17.4467 } },
      { name: 'Seychelles', code: 'SC', flag: '🇸🇨', capital: 'Victoria', coordinates: { lat: -4.6796, lon: 55.4920 } },
      { name: 'Sierra Leone', code: 'SL', flag: '🇸🇱', capital: 'Freetown', coordinates: { lat: 8.4657, lon: -13.2317 } },
      { name: 'Somalia', code: 'SO', flag: '🇸🇴', capital: 'Mogadishu', coordinates: { lat: 2.0469, lon: 45.3182 } },
      { name: 'South Africa', code: 'ZA', flag: '🇿🇦', capital: 'Pretoria', coordinates: { lat: -25.7479, lon: 28.2293 } },
      { name: 'South Sudan', code: 'SS', flag: '🇸🇸', capital: 'Juba', coordinates: { lat: 4.8517, lon: 31.5825 } },
      { name: 'Sudan', code: 'SD', flag: '🇸🇩', capital: 'Khartoum', coordinates: { lat: 15.5007, lon: 32.5599 } },
      { name: 'Tanzania', code: 'TZ', flag: '🇹🇿', capital: 'Dodoma', coordinates: { lat: -6.1630, lon: 35.7516 } },
      { name: 'Togo', code: 'TG', flag: '🇹🇬', capital: 'Lomé', coordinates: { lat: 6.1256, lon: 1.2318 } },
      { name: 'Tunisia', code: 'TN', flag: '🇹🇳', capital: 'Tunis', coordinates: { lat: 36.8065, lon: 10.1815 } },
      { name: 'Uganda', code: 'UG', flag: '🇺🇬', capital: 'Kampala', coordinates: { lat: 0.3476, lon: 32.5825 } },
      { name: 'Zambia', code: 'ZM', flag: '🇿🇲', capital: 'Lusaka', coordinates: { lat: -15.3875, lon: 28.3228 } },
      { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼', capital: 'Harare', coordinates: { lat: -17.8252, lon: 31.0335 } },
    ]
  },
  {
    name: 'Asia',
    emoji: '🌏',
    countries: [
      { name: 'Afghanistan', code: 'AF', flag: '🇦🇫', capital: 'Kabul', coordinates: { lat: 34.5553, lon: 69.2075 } },
      { name: 'Armenia', code: 'AM', flag: '🇦🇲', capital: 'Yerevan', coordinates: { lat: 40.1792, lon: 44.4991 } },
      { name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿', capital: 'Baku', coordinates: { lat: 40.4093, lon: 49.8671 } },
      { name: 'Bahrain', code: 'BH', flag: '🇧🇭', capital: 'Manama', coordinates: { lat: 26.0667, lon: 50.5577 } },
      { name: 'Bangladesh', code: 'BD', flag: '🇧🇩', capital: 'Dhaka', coordinates: { lat: 23.8103, lon: 90.4125 } },
      { name: 'Bhutan', code: 'BT', flag: '🇧🇹', capital: 'Thimphu', coordinates: { lat: 27.4728, lon: 89.6393 } },
      { name: 'Brunei', code: 'BN', flag: '🇧🇳', capital: 'Bandar Seri Begawan', coordinates: { lat: 4.9031, lon: 114.9398 } },
      { name: 'Cambodia', code: 'KH', flag: '🇰🇭', capital: 'Phnom Penh', coordinates: { lat: 11.5564, lon: 104.9282 } },
      { name: 'China', code: 'CN', flag: '🇨🇳', capital: 'Beijing', coordinates: { lat: 39.9042, lon: 116.4074 } },
      { name: 'Cyprus', code: 'CY', flag: '🇨🇾', capital: 'Nicosia', coordinates: { lat: 35.1856, lon: 33.3823 } },
      { name: 'Georgia', code: 'GE', flag: '🇬🇪', capital: 'Tbilisi', coordinates: { lat: 41.7151, lon: 44.8271 } },
      { name: 'India', code: 'IN', flag: '🇮🇳', capital: 'New Delhi', coordinates: { lat: 28.6139, lon: 77.2090 } },
      { name: 'Indonesia', code: 'ID', flag: '🇮🇩', capital: 'Jakarta', coordinates: { lat: -6.2088, lon: 106.8456 } },
      { name: 'Iran', code: 'IR', flag: '🇮🇷', capital: 'Tehran', coordinates: { lat: 35.6892, lon: 51.3890 } },
      { name: 'Iraq', code: 'IQ', flag: '🇮🇶', capital: 'Baghdad', coordinates: { lat: 33.3128, lon: 44.3615 } },
      { name: 'Israel', code: 'IL', flag: '🇮🇱', capital: 'Jerusalem', coordinates: { lat: 31.7683, lon: 35.2137 } },
      { name: 'Japan', code: 'JP', flag: '🇯🇵', capital: 'Tokyo', coordinates: { lat: 35.6762, lon: 139.6503 } },
      { name: 'Jordan', code: 'JO', flag: '🇯🇴', capital: 'Amman', coordinates: { lat: 31.9454, lon: 35.9284 } },
      { name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿', capital: 'Nur-Sultan', coordinates: { lat: 51.1694, lon: 71.4491 } },
      { name: 'Kuwait', code: 'KW', flag: '🇰🇼', capital: 'Kuwait City', coordinates: { lat: 29.3759, lon: 47.9774 } },
      { name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬', capital: 'Bishkek', coordinates: { lat: 42.8746, lon: 74.5698 } },
      { name: 'Laos', code: 'LA', flag: '🇱🇦', capital: 'Vientiane', coordinates: { lat: 17.9757, lon: 102.6331 } },
      { name: 'Lebanon', code: 'LB', flag: '🇱🇧', capital: 'Beirut', coordinates: { lat: 33.8886, lon: 35.4955 } },
      { name: 'Malaysia', code: 'MY', flag: '🇲🇾', capital: 'Kuala Lumpur', coordinates: { lat: 3.1390, lon: 101.6869 } },
      { name: 'Maldives', code: 'MV', flag: '🇲🇻', capital: 'Malé', coordinates: { lat: 4.1755, lon: 73.5093 } },
      { name: 'Mongolia', code: 'MN', flag: '🇲🇳', capital: 'Ulaanbaatar', coordinates: { lat: 47.8864, lon: 106.9057 } },
      { name: 'Myanmar', code: 'MM', flag: '🇲🇲', capital: 'Naypyidaw', coordinates: { lat: 19.7633, lon: 96.0785 } },
      { name: 'Nepal', code: 'NP', flag: '🇳🇵', capital: 'Kathmandu', coordinates: { lat: 27.7172, lon: 85.3240 } },
      { name: 'North Korea', code: 'KP', flag: '🇰🇵', capital: 'Pyongyang', coordinates: { lat: 39.0392, lon: 125.7625 } },
      { name: 'Oman', code: 'OM', flag: '🇴🇲', capital: 'Muscat', coordinates: { lat: 23.5880, lon: 58.3829 } },
      { name: 'Pakistan', code: 'PK', flag: '🇵🇰', capital: 'Islamabad', coordinates: { lat: 33.6844, lon: 73.0479 } },
      { name: 'Palestine', code: 'PS', flag: '🇵🇸', capital: 'Ramallah', coordinates: { lat: 31.9038, lon: 35.2034 } },
      { name: 'Philippines', code: 'PH', flag: '🇵🇭', capital: 'Manila', coordinates: { lat: 14.5995, lon: 120.9842 } },
      { name: 'Qatar', code: 'QA', flag: '🇶🇦', capital: 'Doha', coordinates: { lat: 25.2854, lon: 51.5310 } },
      { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', capital: 'Riyadh', coordinates: { lat: 24.7136, lon: 46.6753 } },
      { name: 'Singapore', code: 'SG', flag: '🇸🇬', capital: 'Singapore', coordinates: { lat: 1.3521, lon: 103.8198 } },
      { name: 'South Korea', code: 'KR', flag: '🇰🇷', capital: 'Seoul', coordinates: { lat: 37.5665, lon: 126.9780 } },
      { name: 'Sri Lanka', code: 'LK', flag: '🇱🇰', capital: 'Colombo', coordinates: { lat: 6.9271, lon: 79.8612 } },
      { name: 'Syria', code: 'SY', flag: '🇸🇾', capital: 'Damascus', coordinates: { lat: 33.5138, lon: 36.2765 } },
      { name: 'Taiwan', code: 'TW', flag: '🇹🇼', capital: 'Taipei', coordinates: { lat: 25.0330, lon: 121.5654 } },
      { name: 'Tajikistan', code: 'TJ', flag: '🇹🇯', capital: 'Dushanbe', coordinates: { lat: 38.5598, lon: 68.7738 } },
      { name: 'Thailand', code: 'TH', flag: '🇹🇭', capital: 'Bangkok', coordinates: { lat: 13.7563, lon: 100.5018 } },
      { name: 'Timor-Leste', code: 'TL', flag: '🇹🇱', capital: 'Dili', coordinates: { lat: -8.5569, lon: 125.5603 } },
      { name: 'Turkey', code: 'TR', flag: '🇹🇷', capital: 'Ankara', coordinates: { lat: 39.9334, lon: 32.8597 } },
      { name: 'Turkmenistan', code: 'TM', flag: '🇹🇲', capital: 'Ashgabat', coordinates: { lat: 37.9601, lon: 58.3261 } },
      { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', capital: 'Abu Dhabi', coordinates: { lat: 24.4539, lon: 54.3773 } },
      { name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿', capital: 'Tashkent', coordinates: { lat: 41.2995, lon: 69.2401 } },
      { name: 'Vietnam', code: 'VN', flag: '🇻🇳', capital: 'Hanoi', coordinates: { lat: 21.0285, lon: 105.8542 } },
      { name: 'Yemen', code: 'YE', flag: '🇾🇪', capital: "Sana'a", coordinates: { lat: 15.5527, lon: 48.5164 } },
    ]
  },
  {
    name: 'Europe',
    emoji: '🇪🇺',
    countries: [
      { name: 'Albania', code: 'AL', flag: '🇦🇱', capital: 'Tirana', coordinates: { lat: 41.3275, lon: 19.8187 } },
      { name: 'Andorra', code: 'AD', flag: '🇦🇩', capital: 'Andorra la Vella', coordinates: { lat: 42.5063, lon: 1.5218 } },
      { name: 'Austria', code: 'AT', flag: '🇦🇹', capital: 'Vienna', coordinates: { lat: 48.2082, lon: 16.3738 } },
      { name: 'Belarus', code: 'BY', flag: '🇧🇾', capital: 'Minsk', coordinates: { lat: 53.9006, lon: 27.5590 } },
      { name: 'Belgium', code: 'BE', flag: '🇧🇪', capital: 'Brussels', coordinates: { lat: 50.8503, lon: 4.3517 } },
      { name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦', capital: 'Sarajevo', coordinates: { lat: 43.8563, lon: 18.4131 } },
      { name: 'Bulgaria', code: 'BG', flag: '🇧🇬', capital: 'Sofia', coordinates: { lat: 42.6977, lon: 23.3219 } },
      { name: 'Croatia', code: 'HR', flag: '🇭🇷', capital: 'Zagreb', coordinates: { lat: 45.8150, lon: 15.9819 } },
      { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿', capital: 'Prague', coordinates: { lat: 50.0755, lon: 14.4378 } },
      { name: 'Denmark', code: 'DK', flag: '🇩🇰', capital: 'Copenhagen', coordinates: { lat: 55.6761, lon: 12.5683 } },
      { name: 'Estonia', code: 'EE', flag: '🇪🇪', capital: 'Tallinn', coordinates: { lat: 59.4370, lon: 24.7536 } },
      { name: 'Finland', code: 'FI', flag: '🇫🇮', capital: 'Helsinki', coordinates: { lat: 60.1699, lon: 24.9384 } },
      { name: 'France', code: 'FR', flag: '🇫🇷', capital: 'Paris', coordinates: { lat: 48.8566, lon: 2.3522 } },
      { name: 'Germany', code: 'DE', flag: '🇩🇪', capital: 'Berlin', coordinates: { lat: 52.5200, lon: 13.4050 } },
      { name: 'Greece', code: 'GR', flag: '🇬🇷', capital: 'Athens', coordinates: { lat: 37.9838, lon: 23.7275 } },
      { name: 'Hungary', code: 'HU', flag: '🇭🇺', capital: 'Budapest', coordinates: { lat: 47.4979, lon: 19.0402 } },
      { name: 'Iceland', code: 'IS', flag: '🇮🇸', capital: 'Reykjavik', coordinates: { lat: 64.1466, lon: -21.9426 } },
      { name: 'Ireland', code: 'IE', flag: '🇮🇪', capital: 'Dublin', coordinates: { lat: 53.3498, lon: -6.2603 } },
      { name: 'Italy', code: 'IT', flag: '🇮🇹', capital: 'Rome', coordinates: { lat: 41.9028, lon: 12.4964 } },
      { name: 'Kosovo', code: 'XK', flag: '🇽🇰', capital: 'Pristina', coordinates: { lat: 42.6629, lon: 21.1655 } },
      { name: 'Latvia', code: 'LV', flag: '🇱🇻', capital: 'Riga', coordinates: { lat: 56.9496, lon: 24.1052 } },
      { name: 'Liechtenstein', code: 'LI', flag: '🇱🇮', capital: 'Vaduz', coordinates: { lat: 47.1410, lon: 9.5209 } },
      { name: 'Lithuania', code: 'LT', flag: '🇱🇹', capital: 'Vilnius', coordinates: { lat: 54.6872, lon: 25.2797 } },
      { name: 'Luxembourg', code: 'LU', flag: '🇱🇺', capital: 'Luxembourg', coordinates: { lat: 49.6116, lon: 6.1319 } },
      { name: 'Malta', code: 'MT', flag: '🇲🇹', capital: 'Valletta', coordinates: { lat: 35.8989, lon: 14.5146 } },
      { name: 'Moldova', code: 'MD', flag: '🇲🇩', capital: 'Chisinau', coordinates: { lat: 47.0105, lon: 28.8638 } },
      { name: 'Monaco', code: 'MC', flag: '🇲🇨', capital: 'Monaco', coordinates: { lat: 43.7384, lon: 7.4246 } },
      { name: 'Montenegro', code: 'ME', flag: '🇲🇪', capital: 'Podgorica', coordinates: { lat: 42.4304, lon: 19.2594 } },
      { name: 'Netherlands', code: 'NL', flag: '🇳🇱', capital: 'Amsterdam', coordinates: { lat: 52.3676, lon: 4.9041 } },
      { name: 'North Macedonia', code: 'MK', flag: '🇲🇰', capital: 'Skopje', coordinates: { lat: 41.9973, lon: 21.4280 } },
      { name: 'Norway', code: 'NO', flag: '🇳🇴', capital: 'Oslo', coordinates: { lat: 59.9139, lon: 10.7522 } },
      { name: 'Poland', code: 'PL', flag: '🇵🇱', capital: 'Warsaw', coordinates: { lat: 52.2297, lon: 21.0122 } },
      { name: 'Portugal', code: 'PT', flag: '🇵🇹', capital: 'Lisbon', coordinates: { lat: 38.7223, lon: -9.1393 } },
      { name: 'Romania', code: 'RO', flag: '🇷🇴', capital: 'Bucharest', coordinates: { lat: 44.4268, lon: 26.1025 } },
      { name: 'Russia', code: 'RU', flag: '🇷🇺', capital: 'Moscow', coordinates: { lat: 55.7558, lon: 37.6173 } },
      { name: 'San Marino', code: 'SM', flag: '🇸🇲', capital: 'San Marino', coordinates: { lat: 43.9424, lon: 12.4578 } },
      { name: 'Serbia', code: 'RS', flag: '🇷🇸', capital: 'Belgrade', coordinates: { lat: 44.7866, lon: 20.4489 } },
      { name: 'Slovakia', code: 'SK', flag: '🇸🇰', capital: 'Bratislava', coordinates: { lat: 48.1486, lon: 17.1077 } },
      { name: 'Slovenia', code: 'SI', flag: '🇸🇮', capital: 'Ljubljana', coordinates: { lat: 46.0569, lon: 14.5058 } },
      { name: 'Spain', code: 'ES', flag: '🇪🇸', capital: 'Madrid', coordinates: { lat: 40.4168, lon: -3.7038 } },
      { name: 'Sweden', code: 'SE', flag: '🇸🇪', capital: 'Stockholm', coordinates: { lat: 59.3293, lon: 18.0686 } },
      { name: 'Switzerland', code: 'CH', flag: '🇨🇭', capital: 'Bern', coordinates: { lat: 46.9480, lon: 7.4474 } },
      { name: 'Ukraine', code: 'UA', flag: '🇺🇦', capital: 'Kyiv', coordinates: { lat: 50.4501, lon: 30.5234 } },
      { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', capital: 'London', coordinates: { lat: 51.5074, lon: -0.1278 } },
      { name: 'Vatican City', code: 'VA', flag: '🇻🇦', capital: 'Vatican City', coordinates: { lat: 41.9029, lon: 12.4534 } },
    ]
  },
  {
    name: 'North America',
    emoji: '🌎',
    countries: [
      { name: 'Antigua and Barbuda', code: 'AG', flag: '🇦🇬', capital: "St. John's", coordinates: { lat: 17.1175, lon: -61.8456 } },
      { name: 'Bahamas', code: 'BS', flag: '🇧🇸', capital: 'Nassau', coordinates: { lat: 25.0443, lon: -77.3504 } },
      { name: 'Barbados', code: 'BB', flag: '🇧🇧', capital: 'Bridgetown', coordinates: { lat: 13.1132, lon: -59.5987 } },
      { name: 'Belize', code: 'BZ', flag: '🇧🇿', capital: 'Belmopan', coordinates: { lat: 17.2510, lon: -88.7590 } },
      { name: 'Canada', code: 'CA', flag: '🇨🇦', capital: 'Ottawa', coordinates: { lat: 45.4215, lon: -75.6972 } },
      { name: 'Costa Rica', code: 'CR', flag: '🇨🇷', capital: 'San José', coordinates: { lat: 9.9281, lon: -84.0907 } },
      { name: 'Cuba', code: 'CU', flag: '🇨🇺', capital: 'Havana', coordinates: { lat: 23.1136, lon: -82.3666 } },
      { name: 'Dominica', code: 'DM', flag: '🇩🇲', capital: 'Roseau', coordinates: { lat: 15.3010, lon: -61.3870 } },
      { name: 'Dominican Republic', code: 'DO', flag: '🇩🇴', capital: 'Santo Domingo', coordinates: { lat: 18.4861, lon: -69.9312 } },
      { name: 'El Salvador', code: 'SV', flag: '🇸🇻', capital: 'San Salvador', coordinates: { lat: 13.6929, lon: -89.2182 } },
      { name: 'Grenada', code: 'GD', flag: '🇬🇩', capital: "St. George's", coordinates: { lat: 12.0561, lon: -61.7486 } },
      { name: 'Guatemala', code: 'GT', flag: '🇬🇹', capital: 'Guatemala City', coordinates: { lat: 14.6349, lon: -90.5069 } },
      { name: 'Haiti', code: 'HT', flag: '🇭🇹', capital: 'Port-au-Prince', coordinates: { lat: 18.5944, lon: -72.3074 } },
      { name: 'Honduras', code: 'HN', flag: '🇭🇳', capital: 'Tegucigalpa', coordinates: { lat: 14.0723, lon: -87.1921 } },
      { name: 'Jamaica', code: 'JM', flag: '🇯🇲', capital: 'Kingston', coordinates: { lat: 17.9714, lon: -76.7931 } },
      { name: 'Mexico', code: 'MX', flag: '🇲🇽', capital: 'Mexico City', coordinates: { lat: 19.4326, lon: -99.1332 } },
      { name: 'Nicaragua', code: 'NI', flag: '🇳🇮', capital: 'Managua', coordinates: { lat: 12.1150, lon: -86.2362 } },
      { name: 'Panama', code: 'PA', flag: '🇵🇦', capital: 'Panama City', coordinates: { lat: 8.9824, lon: -79.5199 } },
      { name: 'Saint Kitts and Nevis', code: 'KN', flag: '🇰🇳', capital: 'Basseterre', coordinates: { lat: 17.3026, lon: -62.7177 } },
      { name: 'Saint Lucia', code: 'LC', flag: '🇱🇨', capital: 'Castries', coordinates: { lat: 13.9094, lon: -60.9789 } },
      { name: 'Saint Vincent and the Grenadines', code: 'VC', flag: '🇻🇨', capital: 'Kingstown', coordinates: { lat: 13.1579, lon: -61.2248 } },
      { name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹', capital: 'Port of Spain', coordinates: { lat: 10.6918, lon: -61.2225 } },
      { name: 'United States', code: 'US', flag: '🇺🇸', capital: 'Washington, D.C.', coordinates: { lat: 38.9072, lon: -77.0369 } },
    ]
  },
  {
    name: 'South America',
    emoji: '🌎',
    countries: [
      { name: 'Argentina', code: 'AR', flag: '🇦🇷', capital: 'Buenos Aires', coordinates: { lat: -34.6037, lon: -58.3816 } },
      { name: 'Bolivia', code: 'BO', flag: '🇧🇴', capital: 'Sucre', coordinates: { lat: -19.0196, lon: -65.2619 } },
      { name: 'Brazil', code: 'BR', flag: '🇧🇷', capital: 'Brasília', coordinates: { lat: -15.8267, lon: -47.9218 } },
      { name: 'Chile', code: 'CL', flag: '🇨🇱', capital: 'Santiago', coordinates: { lat: -33.4489, lon: -70.6693 } },
      { name: 'Colombia', code: 'CO', flag: '🇨🇴', capital: 'Bogotá', coordinates: { lat: 4.7110, lon: -74.0721 } },
      { name: 'Ecuador', code: 'EC', flag: '🇪🇨', capital: 'Quito', coordinates: { lat: -0.1807, lon: -78.4678 } },
      { name: 'Guyana', code: 'GY', flag: '🇬🇾', capital: 'Georgetown', coordinates: { lat: 6.8013, lon: -58.1551 } },
      { name: 'Paraguay', code: 'PY', flag: '🇵🇾', capital: 'Asunción', coordinates: { lat: -25.2637, lon: -57.5759 } },
      { name: 'Peru', code: 'PE', flag: '🇵🇪', capital: 'Lima', coordinates: { lat: -12.0464, lon: -77.0428 } },
      { name: 'Suriname', code: 'SR', flag: '🇸🇷', capital: 'Paramaribo', coordinates: { lat: 5.8520, lon: -55.2038 } },
      { name: 'Uruguay', code: 'UY', flag: '🇺🇾', capital: 'Montevideo', coordinates: { lat: -34.9011, lon: -56.1645 } },
      { name: 'Venezuela', code: 'VE', flag: '🇻🇪', capital: 'Caracas', coordinates: { lat: 10.4806, lon: -66.9036 } },
    ]
  },
  {
    name: 'Oceania',
    emoji: '🌏',
    countries: [
      { name: 'Australia', code: 'AU', flag: '🇦🇺', capital: 'Canberra', coordinates: { lat: -35.2809, lon: 149.1300 } },
      { name: 'Fiji', code: 'FJ', flag: '🇫🇯', capital: 'Suva', coordinates: { lat: -18.1248, lon: 178.4501 } },
      { name: 'Kiribati', code: 'KI', flag: '🇰🇮', capital: 'Tarawa', coordinates: { lat: 1.3382, lon: 173.0176 } },
      { name: 'Marshall Islands', code: 'MH', flag: '🇲🇭', capital: 'Majuro', coordinates: { lat: 7.0897, lon: 171.3803 } },
      { name: 'Micronesia', code: 'FM', flag: '🇫🇲', capital: 'Palikir', coordinates: { lat: 6.9248, lon: 158.1610 } },
      { name: 'Nauru', code: 'NR', flag: '🇳🇷', capital: 'Yaren', coordinates: { lat: -0.5477, lon: 166.9209 } },
      { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', capital: 'Wellington', coordinates: { lat: -41.2865, lon: 174.7762 } },
      { name: 'Palau', code: 'PW', flag: '🇵🇼', capital: 'Ngerulmud', coordinates: { lat: 7.5150, lon: 134.5825 } },
      { name: 'Papua New Guinea', code: 'PG', flag: '🇵🇬', capital: 'Port Moresby', coordinates: { lat: -9.4438, lon: 147.1803 } },
      { name: 'Samoa', code: 'WS', flag: '🇼🇸', capital: 'Apia', coordinates: { lat: -13.8506, lon: -171.7513 } },
      { name: 'Solomon Islands', code: 'SB', flag: '🇸🇧', capital: 'Honiara', coordinates: { lat: -9.4280, lon: 159.9490 } },
      { name: 'Tonga', code: 'TO', flag: '🇹🇴', capital: "Nuku'alofa", coordinates: { lat: -21.1789, lon: -175.1982 } },
      { name: 'Tuvalu', code: 'TV', flag: '🇹🇻', capital: 'Funafuti', coordinates: { lat: -8.5211, lon: 179.1962 } },
      { name: 'Vanuatu', code: 'VU', flag: '🇻🇺', capital: 'Port Vila', coordinates: { lat: -17.7333, lon: 168.3273 } },
    ]
  },
  {
    name: 'Antarctica',
    emoji: '🇦🇶',
    countries: [
      { name: 'Antarctica', code: 'AQ', flag: '🇦🇶', capital: 'Research Stations', coordinates: { lat: -75.2509, lon: 0.0713 } },
    ]
  }
];

// Total count: 195 countries/regions - COMPLETE WORLD COVERAGE
export const getTotalCountryCount = (): number => {
  return WORLD_COUNTRIES.reduce((total, continent) => total + continent.countries.length, 0);
};

// Get all countries as flat array
export const getAllCountries = (): Country[] => {
  return WORLD_COUNTRIES.flatMap(continent => continent.countries);
};

// Search countries by name
export const searchCountries = (query: string): Country[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllCountries().filter(country =>
    country.name.toLowerCase().includes(lowercaseQuery) ||
    country.capital?.toLowerCase().includes(lowercaseQuery) ||
    country.code.toLowerCase().includes(lowercaseQuery)
  );
};
