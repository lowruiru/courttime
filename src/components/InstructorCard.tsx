
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instructor, TimeSlot } from "@/types/instructor";
import { Calendar, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parse } from "date-fns";

interface InstructorCardProps {
  instructor: Instructor;
  timeSlot: TimeSlot;
}

const InstructorCard = ({ instructor, timeSlot }: InstructorCardProps) => {
  const date = parse(timeSlot.date, "yyyy-MM-dd", new Date());
  const formattedDate = format(date, "EEE, MMM d, yyyy");
  const whatsappMessage = `Hi ${instructor.name}, I'm interested in booking a tennis lesson with you on ${formattedDate} at ${timeSlot.startTime}.`;
  const whatsappLink = `https://wa.me/${instructor.phone}?text=${encodeURIComponent(whatsappMessage)}`;
  
  return (
    <Card className="mb-4 overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Time Slot (Left Column) */}
          <div className="md:w-1/5 bg-gray-50 p-4 flex flex-col justify-center items-center">
            <Clock className="h-5 w-5 mb-1 text-tennis-green" />
            <p className="text-lg font-bold text-tennis-green">{timeSlot.startTime}</p>
            <p className="text-sm text-muted-foreground">to {timeSlot.endTime}</p>
            <div className="mt-2 text-xs">
              <Calendar className="h-4 w-4 inline mr-1" />
              <span>{format(date, "EEE, MMM d")}</span>
            </div>
          </div>
          
          {/* Instructor Details */}
          <div className="flex-1 p-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="text-lg font-semibold">{instructor.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(instructor.rating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium">{instructor.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <div className="flex flex-col items-end">
                  <p className="font-semibold text-tennis-green">S${instructor.fee}/hr</p>
                  <p className="text-sm text-muted-foreground">
                    {instructor.providesOwnCourt ? "Provides court" : "Requires your court"}
                  </p>
                </div>
                
                {/* Action Buttons - Moved up next to price */}
                <div className="flex gap-2 mt-2">
                  <Button 
                    className="bg-tennis-green hover:bg-tennis-green/90 py-1 px-3 h-auto text-xs"
                    asChild
                  >
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-1 h-3 w-3" />
                      Book this slot
                    </a>
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-tennis-green text-tennis-green hover:bg-tennis-green/10 py-1 px-3 h-auto text-xs"
                    asChild
                  >
                    <Link to={`/instructor/${instructor.id}`}>
                      More Info
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Levels and Location */}
            <div className="mt-3">
              <p className="text-sm"><span className="font-medium">Teaches:</span> {instructor.levels.join(", ")}</p>
              <p className="text-sm"><span className="font-medium">Location:</span> {timeSlot.location}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCard;
