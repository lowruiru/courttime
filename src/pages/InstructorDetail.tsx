
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { instructors } from '@/data/instructors';
import { format, parse, addDays, isSameDay } from "date-fns";
import { Calendar, CheckCircle, Clock, MessageCircle, ArrowLeft, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TimeSlot } from '@/types/instructor';
import { useIsMobile } from '@/hooks/use-mobile';

const InstructorDetail = () => {
  const { id } = useParams();
  const instructor = instructors.find(i => i.id === id);
  const [groupedAvailability, setGroupedAvailability] = useState<Record<string, TimeSlot[]>>({});
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!instructor) {
      console.error(`Instructor with ID ${id} not found`);
      return;
    }
    
    // Group availability by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekLater = addDays(today, 7);
    
    // Filter slots to only include available slots for the next week
    const availableSlots = instructor.availability.filter(slot => {
      if (slot.booked) return false;
      
      const slotDate = parse(slot.date, "yyyy-MM-dd", new Date());
      return slotDate >= today && slotDate <= oneWeekLater;
    });
    
    // Group by date
    const groupedByDate: Record<string, TimeSlot[]> = {};
    
    availableSlots.forEach(slot => {
      if (!groupedByDate[slot.date]) {
        groupedByDate[slot.date] = [];
      }
      groupedByDate[slot.date].push(slot);
    });
    
    // Sort time slots within each date and remove duplicates
    Object.keys(groupedByDate).forEach(date => {
      const uniqueTimeSlots: TimeSlot[] = [];
      const timeSet = new Set<string>();
      
      // Sort by start time
      const sortedSlots = [...groupedByDate[date]].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      );
      
      // Filter out duplicates based on startTime and endTime combination
      sortedSlots.forEach(slot => {
        const timeKey = `${slot.startTime}-${slot.endTime}-${slot.location}`;
        if (!timeSet.has(timeKey)) {
          timeSet.add(timeKey);
          uniqueTimeSlots.push(slot);
        }
      });
      
      groupedByDate[date] = uniqueTimeSlots;
    });
    
    setGroupedAvailability(groupedByDate);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [instructor, id]);
  
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

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Back button */}
        <Link to="/" className="flex items-center text-tennis-green mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to results
        </Link>
        
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-8`}>
          {/* Instructor Profile */}
          <div className={`${isMobile ? '' : 'lg:col-span-2'}`}>
            <Card>
              <CardContent className="p-6">
                <div className={`flex flex-col ${isMobile ? '' : 'md:flex-row'} gap-6`}>
                  {/* Instructor Image */}
                  <div className={`${isMobile ? '' : 'md:w-1/3'}`}>
                    <img 
                      src={instructor.image} 
                      alt={instructor.name} 
                      className="rounded-lg w-full h-64 md:h-auto object-cover"
                    />
                  </div>
                  
                  {/* Instructor Details */}
                  <div className={`${isMobile ? '' : 'md:w-2/3'}`}>
                    <div className={`flex flex-col ${isMobile ? '' : 'md:flex-row'} justify-between`}>
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
                      <div className={`${isMobile ? 'mt-2' : 'mt-0'}`}>
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
                      
                      {/* Updated Specialization with same style as levels */}
                      <div>
                        <h3 className="font-medium">Specialization</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="px-2 py-1 bg-muted rounded-full text-xs">
                            {instructor.specialization || "General tennis"}
                          </span>
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
                
                {/* Availability Section - Reformatted to group by date */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Upcoming Availability</h2>
                  
                  {Object.keys(groupedAvailability).length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {Object.entries(groupedAvailability).map(([dateString, slots]) => {
                        const date = parse(dateString, "yyyy-MM-dd", new Date());
                        const formattedDate = format(date, "EEEE, MMMM d, yyyy");
                        
                        return (
                          <div key={dateString} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b flex items-center">
                              <Calendar className="h-4 w-4 text-tennis-green mr-2" />
                              <h3 className="font-medium">{formattedDate}</h3>
                            </div>
                            
                            <div className="p-3">
                              <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-3`}>
                                {slots.map(slot => {
                                  const whatsappMessage = `Hi ${instructor.name}, I'm interested in booking a tennis lesson with you on ${formattedDate} at ${slot.startTime}.`;
                                  
                                  return (
                                    <div 
                                      key={slot.id}
                                      className="bg-white border rounded-md overflow-hidden hover:shadow-sm transition-shadow"
                                    >
                                      <div className="p-3 space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                          <Clock className="h-4 w-4 text-tennis-green" />
                                          <span className="font-medium">
                                            {slot.startTime} - {slot.endTime}
                                          </span>
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
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No available slots in the next week.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - Reviews and Ratings */}
          <div>
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
                
                {/* Google Sign In Button for Feedback */}
                <div className="mt-8">
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-sm w-full"
                    onClick={() => window.location.href = "https://accounts.google.com/signin"}
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    <span>Sign in with Google to submit feedback</span>
                  </button>
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
