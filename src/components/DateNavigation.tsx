
import { Button } from "@/components/ui/button";
import { format, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface DateNavigationProps {
  currentDate: Date | undefined;
  onDateChange: (date: Date) => void;
}

const DateNavigation = ({ currentDate, onDateChange }: DateNavigationProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [dates, setDates] = useState<Date[]>([]);
  
  useEffect(() => {
    // Generate 7 days starting from today
    const newDates = [];
    for (let i = 0; i < 7; i++) {
      newDates.push(addDays(today, i));
    }
    setDates(newDates);
  }, []);
  
  const goToPreviousWeek = () => {
    if (dates.length > 0) {
      const newDates = dates.map(date => addDays(date, -7));
      setDates(newDates);
    }
  };
  
  const goToNextWeek = () => {
    if (dates.length > 0) {
      const newDates = dates.map(date => addDays(date, 7));
      setDates(newDates);
    }
  };
  
  const isCurrentDate = (date: Date) => {
    return currentDate && isSameDay(date, currentDate);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Available Dates</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, index) => (
          <Button
            key={index}
            variant={isCurrentDate(date) ? "default" : "outline"}
            className={`flex flex-col h-auto py-2 ${
              isCurrentDate(date) ? "bg-tennis-green hover:bg-tennis-green/90" : ""
            }`}
            onClick={() => onDateChange(date)}
          >
            <span className="text-xs font-normal">{format(date, "EEE")}</span>
            <span className="text-lg">{format(date, "d")}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DateNavigation;
