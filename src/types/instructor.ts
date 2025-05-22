
export interface Instructor {
  id: string;
  name: string;
  image: string;
  location: string[];
  fee: number;
  levels: string[];
  providesOwnCourt: boolean;
  bio: string;
  phone: string;
  rating: number;
  reviews: Review[];
  availability: TimeSlot[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TimeSlot {
  id: string;
  date: string; // ISO format
  startTime: string; // 24h format
  endTime: string; // 24h format
  location: string;
  booked: boolean;
}

export interface FilterOptions {
  instructorName?: string;
  location: string[];
  budget: number;
  level: string;
  needsCourt: boolean;
  date: Date | undefined;
  timeRange: [number, number]; // 24h format, e.g. [8, 21] for 8am to 9pm
}

export const NeighborhoodsByRegion = {
  "North": ["Ang Mo Kio", "Woodlands", "Sembawang", "Yishun"],
  "North-east": ["Hougang", "Punggol", "Sengkang", "Serangoon"],
  "East": ["Bedok", "Geylang", "Marine Parade", "Pasir Ris", "Tampines"],
  "Central": ["Central Area", "Bishan", "Toa Payoh", "Kallang/Whampoa"],
  "South": ["Bukit Merah", "Queenstown", "Bukit Timah"],
  "West": ["Bukit Batok", "Bukit Panjang", "Bukit Timah", "Choa Chu Kang", "Clementi", "Jurong East", "Jurong West", "Tengah"]
};

// Flatten neighborhoods for easier access
export const AllNeighborhoods = Object.values(NeighborhoodsByRegion).flat();

export const Levels = [
  "Beginner",
  "Intermediate"
];
