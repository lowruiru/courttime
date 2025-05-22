
import { Instructor, formatTimeToHHMM } from "../types/instructor";
import { addDays, addMonths, format } from "date-fns";

// Helper function to create availability slots through June 2025
const generateAvailability = (instructorId: string, baseDate: Date, locations: string[]) => {
  const availability = [];
  
  // Generate slots for the next 14 months (through June 2025)
  for (let month = 0; month < 14; month++) {
    // Add 2-3 days per month
    const currentMonth = addMonths(baseDate, month);
    const daysInMonth = Math.floor(Math.random() * 2) + 2; // 2-3 days per month
    
    for (let dayOffset = 0; dayOffset < daysInMonth; dayOffset++) {
      // Pick random days within the month
      const dayInMonth = Math.floor(Math.random() * 28) + 1; // Random day 1-28 to avoid month boundary issues
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayInMonth);
      const dateStr = format(date, "yyyy-MM-dd");
      
      // Generate random slots for each day
      const slotsCount = Math.floor(Math.random() * 4) + 2; // 2-5 slots per day
      for (let i = 0; i < slotsCount; i++) {
        const startHour = Math.floor(Math.random() * 12) + 8; // 8am to 8pm
        const endHour = startHour + 1; // 1 hour sessions
        
        // Format times with leading zeros for consistent 4-digit format
        const startTimeFormatted = formatTimeToHHMM(`${startHour}:00`);
        const endTimeFormatted = formatTimeToHHMM(`${endHour}:00`);
        
        availability.push({
          id: `${instructorId}-${dateStr}-${startHour}`,
          date: dateStr,
          startTime: startTimeFormatted,
          endTime: endTimeFormatted,
          location: locations[Math.floor(Math.random() * locations.length)],
          booked: Math.random() > 0.8 // 20% chance of being booked
        });
      }
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

// Ensure there's at least one instructor available for every day until June 2025
const ensureDailyCoverage = (instructors: Instructor[]) => {
  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate end date (June 30, 2025)
  const endDate = new Date(2025, 5, 30); // Month is 0-based
  
  // Create a map to track days with coverage
  const coveredDays = new Map();
  
  // Check current coverage
  instructors.forEach(instructor => {
    instructor.availability.forEach(slot => {
      if (!slot.booked) {
        coveredDays.set(slot.date, true);
      }
    });
  });
  
  // Fill missing dates
  const currentDate = new Date(today);
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    
    if (!coveredDays.has(dateStr)) {
      // Add availability for a random instructor
      const randomInstructorIndex = Math.floor(Math.random() * instructors.length);
      const instructor = instructors[randomInstructorIndex];
      
      // Create 1-3 slots for this date
      const slotsToAdd = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < slotsToAdd; i++) {
        const startHour = Math.floor(Math.random() * 12) + 8; // 8am to 8pm
        const endHour = startHour + 1;
        
        // Format times with leading zeros
        const startTimeFormatted = formatTimeToHHMM(`${startHour}:00`);
        const endTimeFormatted = formatTimeToHHMM(`${endHour}:00`);
        
        instructor.availability.push({
          id: `${instructor.id}-${dateStr}-${startHour}`,
          date: dateStr,
          startTime: startTimeFormatted,
          endTime: endTimeFormatted,
          location: instructor.location[Math.floor(Math.random() * instructor.location.length)],
          booked: false
        });
      }
      
      // Re-sort this instructor's availability
      instructor.availability.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return instructors;
};

// Get today's date at midnight
const today = new Date();
today.setHours(0, 0, 0, 0);

// Create instructors data
let instructorsData: Instructor[] = [
  {
    id: "1",
    name: "James Wong",
    image: "https://images.unsplash.com/photo-1599171041648-944a0b9be55f?q=80&w=1480&auto=format&fit=crop",
    location: ["Kallang", "Tampines"],
    fee: 70,
    levels: ["Beginner", "Intermediate"],
    providesOwnCourt: false,
    bio: "Former national player with 10+ years of coaching experience. Specializes in developing fundamentals and building confidence in new players.",
    phone: "91234567",
    rating: 4.8,
    classSizes: [1, 2],
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
    image: "https://images.unsplash.com/photo-1588453862009-502cd5df3d30?q=80&w=1480&auto=format&fit=crop",
    location: ["Bukit Timah", "Jurong"],
    fee: 90,
    levels: ["Intermediate"],
    providesOwnCourt: true,
    bio: "Professional player with 8 years of coaching experience. Focused on intermediate techniques, match preparation, and strategic gameplay.",
    phone: "92345678",
    rating: 4.9,
    classSizes: [1],
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
    image: "https://images.unsplash.com/photo-1622279457486-28f309bee101?q=80&w=1480&auto=format&fit=crop",
    location: ["Yio Chu Kang", "Serangoon"],
    fee: 60,
    levels: ["Beginner"],
    providesOwnCourt: false,
    bio: "Specialized in introducing tennis to beginners. Creates fun, engaging lessons that build skills while enjoying the game.",
    phone: "93456789",
    rating: 4.7,
    classSizes: [1, 2],
    reviews: [
      {
        id: "r3-1",
        userId: "u5",
        userName: "Jennifer H.",
        rating: 5,
        comment: "Raj is incredibly patient. Perfect for beginners like me.",
        date: "2024-04-20"
      },
      {
        id: "r3-2",
        userId: "u6",
        userName: "Kevin T.",
        rating: 4,
        comment: "Great approach to teaching fundamentals. Highly recommended.",
        date: "2024-03-15"
      }
    ],
    availability: generateAvailability("3", today, ["Yio Chu Kang", "Serangoon"])
  },
  {
    id: "4",
    name: "Lisa Chen",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c1?q=80&w=1480&auto=format&fit=crop",
    location: ["Marina Bay", "Kallang"],
    fee: 110,
    levels: ["Intermediate"],
    providesOwnCourt: true,
    bio: "Former national player specialized in intermediate coaching. Focus on technique refinement, tactical play, and competition strategies.",
    phone: "94567890",
    rating: 5.0,
    classSizes: [1, 2],
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
        comment: "Worth every penny. Lisa has transformed my game completely.",
        date: "2024-04-01"
      }
    ],
    availability: generateAvailability("4", today, ["Marina Bay", "Kallang"])
  },
  {
    id: "5",
    name: "Ahmad Ibrahim",
    image: "https://images.unsplash.com/photo-1599152771241-3dd4e9e0a49c?q=80&w=1480&auto=format&fit=crop",
    location: ["Woodlands", "Jurong", "Pasir Ris"],
    fee: 50,
    levels: ["Beginner", "Intermediate"],
    providesOwnCourt: false,
    bio: "Community coach focused on making tennis accessible to everyone. Patient approach for beginners and developing intermediate players.",
    phone: "95678901",
    rating: 4.6,
    classSizes: [1, 2],
    reviews: [
      {
        id: "r5-1",
        userId: "u9",
        userName: "Rachel K.",
        rating: 5,
        comment: "Ahmad is incredibly patient. I started as a complete beginner and now enjoy playing regularly.",
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
  },
  {
    id: "6",
    name: "Sarah Lim",
    image: "https://images.unsplash.com/photo-1614743758466-e569f4791116?q=80&w=1480&auto=format&fit=crop",
    location: ["Tampines", "Pasir Ris"],
    fee: 75,
    levels: ["Beginner", "Intermediate"],
    providesOwnCourt: true,
    bio: "Tennis coach with 5 years of experience teaching players of all ages. Specializes in developing proper technique and building confidence.",
    phone: "96789012",
    rating: 4.7,
    classSizes: [1],
    reviews: [
      {
        id: "r6-1",
        userId: "u11",
        userName: "Jason T.",
        rating: 5,
        comment: "Sarah is an excellent coach who makes learning tennis enjoyable. Highly recommend!",
        date: "2024-05-10"
      },
      {
        id: "r6-2",
        userId: "u12",
        userName: "Linda M.",
        rating: 4.5,
        comment: "My technique has improved significantly since I started lessons with Sarah.",
        date: "2024-04-28"
      }
    ],
    availability: generateAvailability("6", today, ["Tampines", "Pasir Ris"])
  },
  {
    id: "7",
    name: "Daniel Teo",
    image: "https://images.unsplash.com/flagged/photo-1576972405668-2d020a01cbfa?q=80&w=1374&auto=format&fit=crop",
    location: ["Jurong", "Bukit Timah"],
    fee: 85,
    levels: ["Intermediate"],
    providesOwnCourt: false,
    bio: "Former collegiate player with a focus on developing intermediate players. Specializes in strategic gameplay and technique refinement.",
    phone: "97890123",
    rating: 4.8,
    classSizes: [1, 2],
    reviews: [
      {
        id: "r7-1",
        userId: "u13",
        userName: "Monica W.",
        rating: 5,
        comment: "Daniel has helped me take my game to the next level. His strategic insights are invaluable.",
        date: "2024-05-05"
      },
      {
        id: "r7-2",
        userId: "u14",
        userName: "Kenneth L.",
        rating: 4.5,
        comment: "Great coach for intermediate players looking to improve their game.",
        date: "2024-04-20"
      }
    ],
    availability: generateAvailability("7", today, ["Jurong", "Bukit Timah"])
  },
  {
    id: "8",
    name: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1560012057-4372e14c5085?q=80&w=1374&auto=format&fit=crop",
    location: ["Serangoon", "Kallang"],
    fee: 65,
    levels: ["Beginner"],
    providesOwnCourt: false,
    bio: "Specialized in beginner-friendly coaching with a focus on building proper foundations. Makes tennis accessible and enjoyable for all.",
    phone: "98901234",
    rating: 4.6,
    classSizes: [1, 2],
    reviews: [
      {
        id: "r8-1",
        userId: "u15",
        userName: "Victor C.",
        rating: 5,
        comment: "Priya is incredibly patient and makes learning tennis so much fun. Perfect for beginners!",
        date: "2024-05-12"
      },
      {
        id: "r8-2",
        userId: "u16",
        userName: "Natasha R.",
        rating: 4,
        comment: "Great instructor for anyone just starting out with tennis.",
        date: "2024-04-25"
      }
    ],
    availability: generateAvailability("8", today, ["Serangoon", "Kallang"])
  }
];

// Ensure at least one instructor available for every day
instructorsData = ensureDailyCoverage(instructorsData);

export const instructors = instructorsData;
