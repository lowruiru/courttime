
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
  location: string;
  budget: number;
  level: string;
  needsCourt: boolean;
  date: Date | undefined;
  timeRange: [number, number]; // 24h format, e.g. [8, 21] for 8am to 9pm
}

export const Locations = [
  "Kallang",
  "Jurong",
  "Tampines",
  "Bukit Timah",
  "Yio Chu Kang",
  "Serangoon",
  "Marina Bay",
  "Woodlands",
  "Pasir Ris"
];

export const Levels = [
  "Beginner",
  "Intermediate"
];
