// Major cities database for regional weather exploration
// Organized by country with coordinates for precise weather data

export interface City {
  name: string;
  lat: number;
  lon: number;
  region?: string; // State/Province/Region name
  isCapital?: boolean;
  population?: number; // For future sorting/filtering
}

export interface CountryCities {
  countryName: string;
  countryCode: string;
  cities: City[];
}

// Cities organized by country
export const CITIES_BY_COUNTRY: Record<string, City[]> = {
  // JAPAN - Major cities across all regions (expanded to 25 cities)
  "Japan": [
    { name: "Tokyo", lat: 35.6762, lon: 139.6503, region: "Kantō", isCapital: true, population: 14000000 },
    { name: "Osaka", lat: 34.6937, lon: 135.5023, region: "Kansai", population: 2700000 },
    { name: "Kyoto", lat: 35.0116, lon: 135.7681, region: "Kansai", population: 1470000 },
    { name: "Yokohama", lat: 35.4437, lon: 139.6380, region: "Kantō", population: 3750000 },
    { name: "Nagoya", lat: 35.1815, lon: 136.9066, region: "Chūbu", population: 2320000 },
    { name: "Sapporo", lat: 43.0642, lon: 141.3469, region: "Hokkaidō", population: 1970000 },
    { name: "Fukuoka", lat: 33.5904, lon: 130.4017, region: "Kyūshū", population: 1600000 },
    { name: "Kobe", lat: 34.6901, lon: 135.1955, region: "Kansai", population: 1540000 },
    { name: "Sendai", lat: 38.2682, lon: 140.8694, region: "Tōhoku", population: 1090000 },
    { name: "Hiroshima", lat: 34.3853, lon: 132.4553, region: "Chūgoku", population: 1200000 },
    { name: "Nara", lat: 34.6851, lon: 135.8048, region: "Kansai", population: 360000 },
    { name: "Okinawa", lat: 26.2124, lon: 127.6809, region: "Okinawa", population: 320000 },
    { name: "Kawasaki", lat: 35.5307, lon: 139.7029, region: "Kantō", population: 1530000 },
    { name: "Chiba", lat: 35.6074, lon: 140.1065, region: "Kantō", population: 980000 },
    { name: "Saitama", lat: 35.8617, lon: 139.6455, region: "Kantō", population: 1300000 },
    { name: "Kumamoto", lat: 32.8031, lon: 130.7079, region: "Kyūshū", population: 740000 },
    { name: "Kagoshima", lat: 31.5966, lon: 130.5571, region: "Kyūshū", population: 600000 },
    { name: "Niigata", lat: 37.9161, lon: 139.0364, region: "Chūbu", population: 810000 },
    { name: "Okayama", lat: 34.6553, lon: 133.9195, region: "Chūgoku", population: 720000 },
    { name: "Kanazawa", lat: 36.5613, lon: 136.6562, region: "Chūbu", population: 470000 },
    { name: "Shizuoka", lat: 34.9756, lon: 138.3828, region: "Chūbu", population: 700000 },
    { name: "Matsuyama", lat: 33.8392, lon: 132.7657, region: "Shikoku", population: 510000 },
    { name: "Hakodate", lat: 41.7687, lon: 140.7288, region: "Hokkaidō", population: 260000 },
    { name: "Takayama", lat: 36.1463, lon: 137.2525, region: "Chūbu", population: 90000 },
    { name: "Nagasaki", lat: 32.7503, lon: 129.8779, region: "Kyūshū", population: 430000 },
  ],

  // PHILIPPINES - Major cities across regions (expanded to 25 cities)
  "Philippines": [
    { name: "Manila", lat: 14.5995, lon: 120.9842, region: "NCR", isCapital: true, population: 1780000 },
    { name: "Quezon City", lat: 14.6760, lon: 121.0437, region: "NCR", population: 2960000 },
    { name: "Cebu City", lat: 10.3157, lon: 123.8854, region: "Central Visayas", population: 960000 },
    { name: "Davao City", lat: 7.1907, lon: 125.4553, region: "Davao", population: 1780000 },
    { name: "Makati", lat: 14.5547, lon: 121.0244, region: "NCR", population: 580000 },
    { name: "Iloilo City", lat: 10.7202, lon: 122.5621, region: "Western Visayas", population: 450000 },
    { name: "Baguio", lat: 16.4023, lon: 120.5960, region: "Cordillera", population: 370000 },
    { name: "Cagayan de Oro", lat: 8.4542, lon: 124.6319, region: "Northern Mindanao", population: 730000 },
    { name: "Zamboanga City", lat: 6.9214, lon: 122.0790, region: "Zamboanga Peninsula", population: 980000 },
    { name: "Bacolod", lat: 10.6769, lon: 122.9500, region: "Western Visayas", population: 600000 },
    { name: "Boracay", lat: 11.9674, lon: 121.9248, region: "Western Visayas", population: 40000 },
    { name: "Palawan", lat: 9.8349, lon: 118.7384, region: "Mimaropa", population: 80000 },
    { name: "Pasig", lat: 14.5764, lon: 121.0851, region: "NCR", population: 800000 },
    { name: "Taguig", lat: 14.5176, lon: 121.0509, region: "NCR", population: 900000 },
    { name: "Antipolo", lat: 14.5864, lon: 121.1751, region: "Calabarzon", population: 890000 },
    { name: "General Santos", lat: 6.1125, lon: 125.1714, region: "Soccsksargen", population: 600000 },
    { name: "Butuan", lat: 8.9475, lon: 125.5406, region: "Caraga", population: 370000 },
    { name: "Dumaguete", lat: 9.3068, lon: 123.3054, region: "Central Visayas", population: 130000 },
    { name: "Tagaytay", lat: 14.1049, lon: 120.9612, region: "Calabarzon", population: 80000 },
    { name: "Tacloban", lat: 11.2436, lon: 125.0040, region: "Eastern Visayas", population: 250000 },
    { name: "Batangas City", lat: 13.7565, lon: 121.0583, region: "Calabarzon", population: 330000 },
    { name: "Vigan", lat: 17.5747, lon: 120.3869, region: "Ilocos", population: 54000 },
    { name: "Siargao", lat: 9.8598, lon: 126.0462, region: "Caraga", population: 30000 },
    { name: "Subic", lat: 14.8820, lon: 120.2709, region: "Central Luzon", population: 110000 },
    { name: "Angeles City", lat: 15.1450, lon: 120.5887, region: "Central Luzon", population: 460000 },
  ],

  // UNITED STATES - Major cities coast to coast
  "United States": [
    { name: "New York City", lat: 40.7128, lon: -74.0060, region: "New York", population: 8340000 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437, region: "California", population: 3980000 },
    { name: "Chicago", lat: 41.8781, lon: -87.6298, region: "Illinois", population: 2710000 },
    { name: "Houston", lat: 29.7604, lon: -95.3698, region: "Texas", population: 2320000 },
    { name: "Phoenix", lat: 33.4484, lon: -112.0740, region: "Arizona", population: 1680000 },
    { name: "Miami", lat: 25.7617, lon: -80.1918, region: "Florida", population: 470000 },
    { name: "San Francisco", lat: 37.7749, lon: -122.4194, region: "California", population: 880000 },
    { name: "Seattle", lat: 47.6062, lon: -122.3321, region: "Washington", population: 750000 },
    { name: "Boston", lat: 42.3601, lon: -71.0589, region: "Massachusetts", population: 690000 },
    { name: "Washington", lat: 38.9072, lon: -77.0369, region: "District of Columbia", isCapital: true, population: 710000 },
    { name: "Las Vegas", lat: 36.1699, lon: -115.1398, region: "Nevada", population: 650000 },
    { name: "Denver", lat: 39.7392, lon: -104.9903, region: "Colorado", population: 720000 },
  ],

  // UNITED KINGDOM - Major cities
  "United Kingdom": [
    { name: "London", lat: 51.5074, lon: -0.1278, region: "England", isCapital: true, population: 9000000 },
    { name: "Manchester", lat: 53.4808, lon: -2.2426, region: "England", population: 550000 },
    { name: "Birmingham", lat: 52.4862, lon: -1.8904, region: "England", population: 1140000 },
    { name: "Liverpool", lat: 53.4084, lon: -2.9916, region: "England", population: 500000 },
    { name: "Edinburgh", lat: 55.9533, lon: -3.1883, region: "Scotland", population: 530000 },
    { name: "Glasgow", lat: 55.8642, lon: -4.2518, region: "Scotland", population: 630000 },
    { name: "Cardiff", lat: 51.4816, lon: -3.1791, region: "Wales", population: 370000 },
    { name: "Belfast", lat: 54.5973, lon: -5.9301, region: "Northern Ireland", population: 340000 },
  ],

  // FRANCE - Major cities
  "France": [
    { name: "Paris", lat: 48.8566, lon: 2.3522, region: "Île-de-France", isCapital: true, population: 2160000 },
    { name: "Marseille", lat: 43.2965, lon: 5.3698, region: "Provence", population: 870000 },
    { name: "Lyon", lat: 45.7640, lon: 4.8357, region: "Auvergne-Rhône-Alpes", population: 520000 },
    { name: "Toulouse", lat: 43.6047, lon: 1.4442, region: "Occitanie", population: 480000 },
    { name: "Nice", lat: 43.7102, lon: 7.2620, region: "Provence", population: 340000 },
    { name: "Bordeaux", lat: 44.8378, lon: -0.5792, region: "Nouvelle-Aquitaine", population: 250000 },
    { name: "Strasbourg", lat: 48.5734, lon: 7.7521, region: "Grand Est", population: 280000 },
  ],

  // GERMANY - Major cities
  "Germany": [
    { name: "Berlin", lat: 52.5200, lon: 13.4050, region: "Berlin", isCapital: true, population: 3770000 },
    { name: "Munich", lat: 48.1351, lon: 11.5820, region: "Bavaria", population: 1470000 },
    { name: "Hamburg", lat: 53.5511, lon: 9.9937, region: "Hamburg", population: 1840000 },
    { name: "Frankfurt", lat: 50.1109, lon: 8.6821, region: "Hesse", population: 760000 },
    { name: "Cologne", lat: 50.9375, lon: 6.9603, region: "North Rhine-Westphalia", population: 1090000 },
    { name: "Stuttgart", lat: 48.7758, lon: 9.1829, region: "Baden-Württemberg", population: 630000 },
    { name: "Dresden", lat: 51.0504, lon: 13.7373, region: "Saxony", population: 560000 },
  ],

  // ITALY - Major cities
  "Italy": [
    { name: "Rome", lat: 41.9028, lon: 12.4964, region: "Lazio", isCapital: true, population: 2870000 },
    { name: "Milan", lat: 45.4642, lon: 9.1900, region: "Lombardy", population: 1400000 },
    { name: "Venice", lat: 45.4408, lon: 12.3155, region: "Veneto", population: 260000 },
    { name: "Florence", lat: 43.7696, lon: 11.2558, region: "Tuscany", population: 380000 },
    { name: "Naples", lat: 40.8518, lon: 14.2681, region: "Campania", population: 960000 },
    { name: "Turin", lat: 45.0703, lon: 7.6869, region: "Piedmont", population: 890000 },
  ],

  // SPAIN - Major cities
  "Spain": [
    { name: "Madrid", lat: 40.4168, lon: -3.7038, region: "Community of Madrid", isCapital: true, population: 3220000 },
    { name: "Barcelona", lat: 41.3851, lon: 2.1734, region: "Catalonia", population: 1620000 },
    { name: "Valencia", lat: 39.4699, lon: -0.3763, region: "Valencian Community", population: 790000 },
    { name: "Seville", lat: 37.3891, lon: -5.9845, region: "Andalusia", population: 690000 },
    { name: "Bilbao", lat: 43.2627, lon: -2.9253, region: "Basque Country", population: 350000 },
    { name: "Málaga", lat: 36.7213, lon: -4.4214, region: "Andalusia", population: 580000 },
  ],

  // AUSTRALIA - Major cities
  "Australia": [
    { name: "Sydney", lat: -33.8688, lon: 151.2093, region: "New South Wales", population: 5310000 },
    { name: "Melbourne", lat: -37.8136, lon: 144.9631, region: "Victoria", population: 5080000 },
    { name: "Brisbane", lat: -27.4698, lon: 153.0251, region: "Queensland", population: 2560000 },
    { name: "Perth", lat: -31.9505, lon: 115.8605, region: "Western Australia", population: 2140000 },
    { name: "Adelaide", lat: -34.9285, lon: 138.6007, region: "South Australia", population: 1370000 },
    { name: "Canberra", lat: -35.2809, lon: 149.1300, region: "Australian Capital Territory", isCapital: true, population: 430000 },
  ],

  // CANADA - Major cities
  "Canada": [
    { name: "Toronto", lat: 43.6532, lon: -79.3832, region: "Ontario", population: 2930000 },
    { name: "Vancouver", lat: 49.2827, lon: -123.1207, region: "British Columbia", population: 675000 },
    { name: "Montreal", lat: 45.5017, lon: -73.5673, region: "Quebec", population: 1780000 },
    { name: "Ottawa", lat: 45.4215, lon: -75.6972, region: "Ontario", isCapital: true, population: 1020000 },
    { name: "Calgary", lat: 51.0447, lon: -114.0719, region: "Alberta", population: 1340000 },
    { name: "Edmonton", lat: 53.5461, lon: -113.4938, region: "Alberta", population: 980000 },
  ],

  // SOUTH KOREA - Major cities
  "South Korea": [
    { name: "Seoul", lat: 37.5665, lon: 126.9780, region: "Seoul", isCapital: true, population: 9770000 },
    { name: "Busan", lat: 35.1796, lon: 129.0756, region: "Busan", population: 3450000 },
    { name: "Incheon", lat: 37.4563, lon: 126.7052, region: "Incheon", population: 2960000 },
    { name: "Daegu", lat: 35.8714, lon: 128.6014, region: "Daegu", population: 2460000 },
    { name: "Daejeon", lat: 36.3504, lon: 127.3845, region: "Daejeon", population: 1540000 },
    { name: "Jeju", lat: 33.4996, lon: 126.5312, region: "Jeju", population: 500000 },
  ],

  // CHINA - Major cities
  "China": [
    { name: "Beijing", lat: 39.9042, lon: 116.4074, region: "Beijing", isCapital: true, population: 21540000 },
    { name: "Shanghai", lat: 31.2304, lon: 121.4737, region: "Shanghai", population: 27060000 },
    { name: "Guangzhou", lat: 23.1291, lon: 113.2644, region: "Guangdong", population: 15300000 },
    { name: "Shenzhen", lat: 22.5431, lon: 114.0579, region: "Guangdong", population: 12530000 },
    { name: "Chengdu", lat: 30.5728, lon: 104.0668, region: "Sichuan", population: 20940000 },
    { name: "Hong Kong", lat: 22.3193, lon: 114.1694, region: "Hong Kong SAR", population: 7500000 },
  ],

  // INDIA - Major cities
  "India": [
    { name: "New Delhi", lat: 28.6139, lon: 77.2090, region: "Delhi", isCapital: true, population: 33000000 },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777, region: "Maharashtra", population: 20960000 },
    { name: "Bangalore", lat: 12.9716, lon: 77.5946, region: "Karnataka", population: 12760000 },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639, region: "West Bengal", population: 15130000 },
    { name: "Chennai", lat: 13.0827, lon: 80.2707, region: "Tamil Nadu", population: 10710000 },
    { name: "Hyderabad", lat: 17.3850, lon: 78.4867, region: "Telangana", population: 10490000 },
  ],

  // BRAZIL - Major cities
  "Brazil": [
    { name: "São Paulo", lat: -23.5505, lon: -46.6333, region: "São Paulo", population: 12330000 },
    { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, region: "Rio de Janeiro", population: 6750000 },
    { name: "Brasília", lat: -15.8267, lon: -47.9218, region: "Federal District", isCapital: true, population: 3060000 },
    { name: "Salvador", lat: -12.9714, lon: -38.5014, region: "Bahia", population: 2900000 },
    { name: "Fortaleza", lat: -3.7172, lon: -38.5433, region: "Ceará", population: 2690000 },
  ],

  // MEXICO - Major cities
  "Mexico": [
    { name: "Mexico City", lat: 19.4326, lon: -99.1332, region: "Mexico City", isCapital: true, population: 9210000 },
    { name: "Guadalajara", lat: 20.6597, lon: -103.3496, region: "Jalisco", population: 1540000 },
    { name: "Monterrey", lat: 25.6866, lon: -100.3161, region: "Nuevo León", population: 1140000 },
    { name: "Cancún", lat: 21.1619, lon: -86.8515, region: "Quintana Roo", population: 890000 },
    { name: "Tijuana", lat: 32.5149, lon: -117.0382, region: "Baja California", population: 1920000 },
  ],

  // SINGAPORE
  "Singapore": [
    { name: "Singapore", lat: 1.3521, lon: 103.8198, region: "Central Region", isCapital: true, population: 5690000 },
    { name: "Jurong", lat: 1.3329, lon: 103.7436, region: "West Region", population: 300000 },
    { name: "Woodlands", lat: 1.4382, lon: 103.7891, region: "North Region", population: 250000 },
  ],

  // THAILAND - Major cities
  "Thailand": [
    { name: "Bangkok", lat: 13.7563, lon: 100.5018, region: "Bangkok", isCapital: true, population: 10720000 },
    { name: "Chiang Mai", lat: 18.7883, lon: 98.9853, region: "Chiang Mai", population: 130000 },
    { name: "Phuket", lat: 7.8804, lon: 98.3923, region: "Phuket", population: 80000 },
    { name: "Pattaya", lat: 12.9236, lon: 100.8825, region: "Chonburi", population: 120000 },
  ],

  // INDONESIA - Major cities
  "Indonesia": [
    { name: "Jakarta", lat: -6.2088, lon: 106.8456, region: "Jakarta", isCapital: true, population: 10770000 },
    { name: "Surabaya", lat: -7.2575, lon: 112.7521, region: "East Java", population: 2870000 },
    { name: "Bandung", lat: -6.9175, lon: 107.6191, region: "West Java", population: 2510000 },
    { name: "Bali", lat: -8.4095, lon: 115.1889, region: "Bali", population: 890000 },
  ],

  // MALAYSIA - Major cities
  "Malaysia": [
    { name: "Kuala Lumpur", lat: 3.1390, lon: 101.6869, region: "Federal Territory", isCapital: true, population: 1790000 },
    { name: "Penang", lat: 5.4141, lon: 100.3288, region: "Penang", population: 710000 },
    { name: "Johor Bahru", lat: 1.4927, lon: 103.7414, region: "Johor", population: 500000 },
  ],

  // VIETNAM - Major cities
  "Vietnam": [
    { name: "Hanoi", lat: 21.0285, lon: 105.8542, region: "Hanoi", isCapital: true, population: 8250000 },
    { name: "Ho Chi Minh City", lat: 10.8231, lon: 106.6297, region: "Ho Chi Minh", population: 9000000 },
    { name: "Da Nang", lat: 16.0544, lon: 108.2022, region: "Da Nang", population: 1210000 },
  ],

  // TAIWAN
  "Taiwan": [
    { name: "Taipei", lat: 25.0330, lon: 121.5654, region: "Taipei", isCapital: true, population: 2650000 },
    { name: "Kaohsiung", lat: 22.6273, lon: 120.3014, region: "Kaohsiung", population: 2770000 },
    { name: "Taichung", lat: 24.1477, lon: 120.6736, region: "Taichung", population: 2820000 },
  ],

  // NEW ZEALAND - Major cities
  "New Zealand": [
    { name: "Auckland", lat: -36.8485, lon: 174.7633, region: "Auckland", population: 1660000 },
    { name: "Wellington", lat: -41.2865, lon: 174.7762, region: "Wellington", isCapital: true, population: 420000 },
    { name: "Christchurch", lat: -43.5321, lon: 172.6362, region: "Canterbury", population: 380000 },
    { name: "Queenstown", lat: -45.0312, lon: 168.6626, region: "Otago", population: 40000 },
  ],

  // SOUTH AFRICA - Major cities
  "South Africa": [
    { name: "Johannesburg", lat: -26.2041, lon: 28.0473, region: "Gauteng", population: 5780000 },
    { name: "Cape Town", lat: -33.9249, lon: 18.4241, region: "Western Cape", population: 4620000 },
    { name: "Durban", lat: -29.8587, lon: 31.0218, region: "KwaZulu-Natal", population: 3960000 },
    { name: "Pretoria", lat: -25.7479, lon: 28.2293, region: "Gauteng", isCapital: true, population: 2470000 },
  ],

  // EGYPT - Major cities
  "Egypt": [
    { name: "Cairo", lat: 30.0444, lon: 31.2357, region: "Cairo", isCapital: true, population: 21750000 },
    { name: "Alexandria", lat: 31.2001, lon: 29.9187, region: "Alexandria", population: 5200000 },
    { name: "Giza", lat: 30.0131, lon: 31.2089, region: "Giza", population: 9200000 },
  ],

  // UAE - Major cities
  "United Arab Emirates": [
    { name: "Dubai", lat: 25.2048, lon: 55.2708, region: "Dubai", population: 3400000 },
    { name: "Abu Dhabi", lat: 24.4539, lon: 54.3773, region: "Abu Dhabi", isCapital: true, population: 1500000 },
    { name: "Sharjah", lat: 25.3463, lon: 55.4209, region: "Sharjah", population: 1800000 },
  ],

  // TURKEY - Major cities
  "Turkey": [
    { name: "Istanbul", lat: 41.0082, lon: 28.9784, region: "Istanbul", population: 15460000 },
    { name: "Ankara", lat: 39.9334, lon: 32.8597, region: "Ankara", isCapital: true, population: 5660000 },
    { name: "Izmir", lat: 38.4237, lon: 27.1428, region: "Izmir", population: 4400000 },
  ],

  // RUSSIA - Major cities
  "Russia": [
    { name: "Moscow", lat: 55.7558, lon: 37.6173, region: "Moscow", isCapital: true, population: 12640000 },
    { name: "Saint Petersburg", lat: 59.9343, lon: 30.3351, region: "Saint Petersburg", population: 5380000 },
    { name: "Novosibirsk", lat: 55.0084, lon: 82.9357, region: "Novosibirsk Oblast", population: 1620000 },
  ],

  // ARGENTINA - Major cities
  "Argentina": [
    { name: "Buenos Aires", lat: -34.6037, lon: -58.3816, region: "Buenos Aires", isCapital: true, population: 3080000 },
    { name: "Córdoba", lat: -31.4201, lon: -64.1888, region: "Córdoba", population: 1390000 },
    { name: "Rosario", lat: -32.9442, lon: -60.6505, region: "Santa Fe", population: 1320000 },
  ],

  // CHILE - Major cities
  "Chile": [
    { name: "Santiago", lat: -33.4489, lon: -70.6693, region: "Santiago Metropolitan", isCapital: true, population: 6310000 },
    { name: "Valparaíso", lat: -33.0472, lon: -71.6127, region: "Valparaíso", population: 280000 },
  ],

  // SWEDEN - Major cities
  "Sweden": [
    { name: "Stockholm", lat: 59.3293, lon: 18.0686, region: "Stockholm", isCapital: true, population: 980000 },
    { name: "Gothenburg", lat: 57.7089, lon: 11.9746, region: "Västra Götaland", population: 580000 },
    { name: "Malmö", lat: 55.6050, lon: 13.0038, region: "Skåne", population: 350000 },
  ],

  // NORWAY - Major cities
  "Norway": [
    { name: "Oslo", lat: 59.9139, lon: 10.7522, region: "Oslo", isCapital: true, population: 700000 },
    { name: "Bergen", lat: 60.3913, lon: 5.3221, region: "Vestland", population: 280000 },
  ],

  // NETHERLANDS - Major cities
  "Netherlands": [
    { name: "Amsterdam", lat: 52.3676, lon: 4.9041, region: "North Holland", isCapital: true, population: 870000 },
    { name: "Rotterdam", lat: 51.9225, lon: 4.4792, region: "South Holland", population: 650000 },
    { name: "The Hague", lat: 52.0705, lon: 4.3007, region: "South Holland", population: 540000 },
  ],

  // SWITZERLAND - Major cities
  "Switzerland": [
    { name: "Zürich", lat: 47.3769, lon: 8.5417, region: "Zürich", population: 420000 },
    { name: "Geneva", lat: 46.2044, lon: 6.1432, region: "Geneva", population: 200000 },
    { name: "Bern", lat: 46.9480, lon: 7.4474, region: "Bern", isCapital: true, population: 140000 },
  ],

  // AUSTRIA - Major cities
  "Austria": [
    { name: "Vienna", lat: 48.2082, lon: 16.3738, region: "Vienna", isCapital: true, population: 1900000 },
    { name: "Salzburg", lat: 47.8095, lon: 13.0550, region: "Salzburg", population: 150000 },
  ],

  // POLAND - Major cities
  "Poland": [
    { name: "Warsaw", lat: 52.2297, lon: 21.0122, region: "Masovian", isCapital: true, population: 1790000 },
    { name: "Kraków", lat: 50.0647, lon: 19.9450, region: "Lesser Poland", population: 780000 },
    { name: "Gdańsk", lat: 54.3520, lon: 18.6466, region: "Pomeranian", population: 470000 },
  ],

  // GREECE - Major cities
  "Greece": [
    { name: "Athens", lat: 37.9838, lon: 23.7275, region: "Attica", isCapital: true, population: 3150000 },
    { name: "Thessaloniki", lat: 40.6401, lon: 22.9444, region: "Central Macedonia", population: 810000 },
  ],

  // PORTUGAL - Major cities
  "Portugal": [
    { name: "Lisbon", lat: 38.7223, lon: -9.1393, region: "Lisbon", isCapital: true, population: 550000 },
    { name: "Porto", lat: 41.1579, lon: -8.6291, region: "Porto", population: 240000 },
  ],
};

// Helper function to get cities for a country
export function getCitiesForCountry(countryName: string): City[] {
  return CITIES_BY_COUNTRY[countryName] || [];
}

// Helper function to check if a country has city data
export function hasRegionalData(countryName: string): boolean {
  return countryName in CITIES_BY_COUNTRY && CITIES_BY_COUNTRY[countryName].length > 0;
}

// Get all country names that have city data
export function getCountriesWithCityData(): string[] {
  return Object.keys(CITIES_BY_COUNTRY);
}
