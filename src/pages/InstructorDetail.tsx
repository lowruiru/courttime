
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { instructors } from '@/data/instructors';
import { format, parse } from "date-fns";
import { Calendar, CheckCircle, Clock, MessageCircle, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

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
  
  const whatsappLink = `https://wa.me/${instructor.phone}?text=Hi, I'm interested in booking a tennis lesson with you.`;

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
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
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
                  <h2 className="text-xl font-semibold mb-3">Upcoming Availability</h2>
                  <div className="grid gap-3">
                    {instructor.availability
                      .filter(slot => !slot.booked)
                      .slice(0, 5)
                      .map((slot) => {
                        const date = parse(slot.date, "yyyy-MM-dd", new Date());
                        return (
                          <div 
                            key={slot.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{format(date, "EEE, MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{slot.startTime} - {slot.endTime}</span>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Location:</span> {slot.location}
                              </div>
                            </div>
                            <Button 
                              className="mt-3 sm:mt-0 bg-tennis-green hover:bg-tennis-green/90"
                              size="sm"
                              asChild
                            >
                              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Contact
                              </a>
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Reviews Section */}
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
