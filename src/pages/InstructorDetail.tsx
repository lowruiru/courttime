
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { instructors } from '@/data/instructors';
import { format, parse, addDays, isBefore, compareAsc } from "date-fns";
import { Calendar, CheckCircle, Clock, MessageCircle, ArrowLeft, MapPin, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TimeSlot } from '@/types/instructor';

const InstructorDetail = () => {
  const { id } = useParams();
  const instructor = instructors.find(i => i.id === id);
  
  // Handle if instructor not found
  useEffect(() => {
    if (!instructor) {
      console.error(`Instructor with ID ${id} not found`);
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [instructor, id]);
  
  // Group availability by date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  useEffect(() => {
    if (instructor && instructor.availability.length > 0) {
      // Find the first non-booked slot's date
      const firstAvailableSlot = instructor.availability.find(slot => !slot.booked);
      if (firstAvailableSlot) {
        setSelectedDate(parse(firstAvailableSlot.date, "yyyy-MM-dd", new Date()));
      }
    }
  }, [instructor]);
  
  // Group time slots by date and filter for the selected date + 1 week
  const groupedAvailability = () => {
    if (!instructor || !selectedDate) return {};
    
    const oneWeekLater = addDays(selectedDate, 7);
    
    const availableSlots = instructor.availability
      .filter(slot => {
        if (slot.booked) return false;
        
        const slotDate = parse(slot.date, "yyyy-MM-dd", new Date());
        return (
          !isBefore(slotDate, selectedDate) && 
          isBefore(slotDate, oneWeekLater)
        );
      })
      .sort((a, b) => {
        // First sort by date
        const dateCompare = compareAsc(
          parse(a.date, "yyyy-MM-dd", new Date()),
          parse(b.date, "yyyy-MM-dd", new Date())
        );
        
        // If same date, sort by time
        if (dateCompare === 0) {
          return a.startTime.localeCompare(b.startTime);
        }
        
        return dateCompare;
      });
    
    // Group by date
    const grouped: Record<string, TimeSlot[]> = {};
    availableSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    
    return grouped;
  };
  
  if (!instructor) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-10">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Instructor Not Found</h2>
            <Link to="/">
              <Button className="bg-tennis-green hover:bg-tennis-green/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const availability = groupedAvailability();

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Back button */}
        <Link to="/" className="flex items-center text-tennis-green mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to results
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructor Profile */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Instructor Image */}
                  <div className="md:w-1/3">
                    <img 
                      src={instructor.image} 
                      alt={instructor.name} 
                      className="rounded-lg w-full h-64 md:h-auto object-cover"
                    />
                  </div>
                  
                  {/* Instructor Details */}
                  <div className="md:w-2/3">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h1 className="text-2xl font-semibold">{instructor.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-tennis-yellow">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-lg">
                                {i < Math.floor(instructor.rating) ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <span className="font-medium">{instructor.rating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">
                            ({instructor.reviews.length} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <p className="text-xl font-semibold text-tennis-green">S${instructor.fee}/hr</p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Instructor Details */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium">Locations</h3>
                        <p>{instructor.location.join(", ")}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Levels Taught</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {instructor.levels.map((level) => (
                            <span 
                              key={level}
                              className="px-2 py-1 bg-muted rounded-full text-xs"
                            >
                              {level}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Class Sizes</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {instructor.classSizes.map((size) => (
                            <span 
                              key={size}
                              className="px-2 py-1 bg-muted rounded-full text-xs inline-flex items-center"
                            >
                              <Users className="h-3 w-3 mr-1" />
                              {size} {size > 1 ? 'pax' : 'pax'}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium">Court</h3>
                        <p className="flex items-center gap-2">
                          {instructor.providesOwnCourt ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-tennis-green" />
                              <span>Can provide court</span>
                            </>
                          ) : (
                            <>
                              <span>Requires your court booking</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        className="bg-tennis-green hover:bg-tennis-green/90"
                        asChild
                      >
                        <a href={`https://wa.me/${instructor.phone}?text=Hi, I'm interested in booking a tennis lesson with you.`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Contact Me
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Instructor Bio */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-3">About Me</h2>
                  <p>{instructor.bio}</p>
                </div>
                
                {/* Availability Section */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Upcoming Availability</h2>
                  {Object.keys(availability).length > 0 ? (
                    <div>
                      {Object.entries(availability).map(([dateStr, slots]) => {
                        const date = parse(dateStr, "yyyy-MM-dd", new Date());
                        const formattedDate = format(date, "EEE, MMM d, yyyy");
                        
                        return (
                          <div key={dateStr} className="mb-6">
                            <h3 className="font-medium mb-3 flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-tennis-green" />
                              {formattedDate}
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {slots.map((slot) => {
                                const whatsappMessage = `Hi ${instructor.name}, I'm interested in booking a tennis lesson with you on ${formattedDate} at ${slot.startTime}.`;
                                
                                return (
                                  <div 
                                    key={`avail-${slot.id}`}
                                    className="bg-white border rounded-md overflow-hidden hover:shadow-md transition-shadow"
                                  >
                                    <div className="p-3 space-y-2">
                                      <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{slot.location}</span>
                                      </div>
                                      <Button 
                                        className="w-full mt-2 bg-tennis-green hover:bg-tennis-green/90"
                                        size="sm"
                                        asChild
                                      >
                                        <a href={`https://wa.me/${instructor.phone}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer">
                                          <MessageCircle className="mr-2 h-3 w-3" />
                                          Book this slot
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No upcoming availability in the next week.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - Reviews and Ratings */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Reviews & Ratings</h2>
                <div className="space-y-6">
                  {instructor.reviews.length > 0 ? (
                    instructor.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between">
                          <div className="font-medium">{review.userName}</div>
                          <div className="flex text-tennis-yellow">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>
                                {i < Math.floor(review.rating) ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {review.date}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetail;
