
import { Instructor } from "../types/instructor";
import { addDays } from "date-fns";

// Helper function to create availability slots
const generateAvailability = (instructorId: string, baseDate: Date, locations: string[]) => {
  const availability = [];
  
  // Generate slots for 7 days
  for (let day = 0; day < 7; day++) {
    const date = addDays(baseDate, day);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate random slots for each day
    const slotsCount = Math.floor(Math.random() * 5) + 2; // 2-6 slots per day
    for (let i = 0; i < slotsCount; i++) {
      const startHour = Math.floor(Math.random() * 12) + 8; // 8am to 8pm
      const endHour = startHour + 1; // 1 hour sessions
      
      availability.push({
        id: `${instructorId}-${dateStr}-${startHour}`,
        date: dateStr,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        location: locations[Math.floor(Math.random() * locations.length)],
        booked: Math.random() > 0.8 // 20% chance of being booked
      });
    }
  }
  
  // Sort by date and time
  availability.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });
  
  return availability;
};

// Get today's date at midnight
const today = new Date();
today.setHours(0, 0, 0, 0);

export const instructors: Instructor[] = [
  {
    id: "1",
    name: "James Wong",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    location: ["Kallang", "Tampines"],
    fee: 70,
    levels: ["Beginner", "Intermediate", "Kids (5-12)"],
    providesOwnCourt: false,
    bio: "Former national player with 10+ years of coaching experience. Specializes in developing fundamentals and building confidence in new players.",
    phone: "91234567",
    rating: 4.8,
    reviews: [
      {
        id: "r1-1",
        userId: "u1",
        userName: "Sarah T.",
        rating: 5,
        comment: "James is patient and skilled at breaking down complex techniques for beginners.",
        date: "2024-04-15"
      },
      {
        id: "r1-2",
        userId: "u2",
        userName: "Michael L.",
        rating: 4.5,
        comment: "My kids have improved tremendously under Coach James. Highly recommended!",
        date: "2024-04-02"
      }
    ],
    availability: generateAvailability("1", today, ["Kallang", "Tampines"])
  },
  {
    id: "2",
    name: "Michelle Tan",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    location: ["Bukit Timah", "Jurong"],
    fee: 90,
    levels: ["Intermediate", "Advanced", "Professional"],
    providesOwnCourt: true,
    bio: "Professional player with ATP tour experience. Focused on advanced techniques, tournament preparation, and mental toughness.",
    phone: "92345678",
    rating: 4.9,
    reviews: [
      {
        id: "r2-1",
        userId: "u3",
        userName: "David C.",
        rating: 5,
        comment: "Michelle's professional experience really shows. She helped me prepare for my first tournament.",
        date: "2024-04-10"
      },
      {
        id: "r2-2",
        userId: "u4",
        userName: "Amanda P.",
        rating: 5,
        comment: "Worth every dollar. My game improved dramatically after just 5 sessions.",
        date: "2024-03-28"
      }
    ],
    availability: generateAvailability("2", today, ["Bukit Timah", "Jurong"])
  },
  {
    id: "3",
    name: "Raj Kumar",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    location: ["Yio Chu Kang", "Serangoon"],
    fee: 60,
    levels: ["Beginner", "Kids (5-12)", "Teenagers (13-19)"],
    providesOwnCourt: false,
    bio: "Youth coach with specialty in introducing tennis to young players. Creates fun, engaging lessons that build skills while enjoying the game.",
    phone: "93456789",
    rating: 4.7,
    reviews: [
      {
        id: "r3-1",
        userId: "u5",
        userName: "Jennifer H.",
        rating: 5,
        comment: "My 7-year-old was initially reluctant but now loves tennis thanks to Coach Raj.",
        date: "2024-04-20"
      },
      {
        id: "r3-2",
        userId: "u6",
        userName: "Kevin T.",
        rating: 4,
        comment: "Great with kids. Makes the lessons entertaining and educational.",
        date: "2024-03-15"
      }
    ],
    availability: generateAvailability("3", today, ["Yio Chu Kang", "Serangoon"])
  },
  {
    id: "4",
    name: "Lisa Chen",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    location: ["Marina Bay", "Kallang"],
    fee: 110,
    levels: ["Advanced", "Professional"],
    providesOwnCourt: true,
    bio: "Former WTA player specialized in advanced coaching. Focus on technique refinement, tactical play, and competition strategies.",
    phone: "94567890",
    rating: 5.0,
    reviews: [
      {
        id: "r4-1",
        userId: "u7",
        userName: "Thomas R.",
        rating: 5,
        comment: "Lisa's attention to detail is incredible. She noticed and fixed flaws in my serve that I've had for years.",
        date: "2024-04-12"
      },
      {
        id: "r4-2",
        userId: "u8",
        userName: "Sophie W.",
        rating: 5,
        comment: "If you're serious about improving your game at an advanced level, Lisa is the coach for you.",
        date: "2024-04-01"
      }
    ],
    availability: generateAvailability("4", today, ["Marina Bay", "Kallang"])
  },
  {
    id: "5",
    name: "Ahmad Ibrahim",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    location: ["Woodlands", "Jurong", "Pasir Ris"],
    fee: 50,
    levels: ["Beginner", "Intermediate", "Teenagers (13-19)"],
    providesOwnCourt: false,
    bio: "Community coach focused on making tennis accessible to everyone. Patient approach for adult beginners and casual players looking to improve.",
    phone: "95678901",
    rating: 4.6,
    reviews: [
      {
        id: "r5-1",
        userId: "u9",
        userName: "Rachel K.",
        rating: 5,
        comment: "Ahmad is incredibly patient. I started as a complete beginner at 40 and now enjoy playing regularly.",
        date: "2024-04-18"
      },
      {
        id: "r5-2",
        userId: "u10",
        userName: "Brian L.",
        rating: 4,
        comment: "Great coach who adapts to your learning pace. No pressure, just steady improvement.",
        date: "2024-03-22"
      }
    ],
    availability: generateAvailability("5", today, ["Woodlands", "Jurong", "Pasir Ris"])
  }
];
