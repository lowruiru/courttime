
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
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-medium">Available Dates</h3>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="h-6 w-6"
            onClick={goToNextWeek}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => (
          <Button
            key={index}
            variant={isCurrentDate(date) ? "default" : "outline"}
            className={`flex flex-col h-auto py-1 px-1 ${
              isCurrentDate(date) ? "bg-tennis-green hover:bg-tennis-green/90" : ""
            }`}
            onClick={() => onDateChange(date)}
          >
            <span className="text-[10px] font-normal">{format(date, "EEE")}</span>
            <span className="text-sm">{format(date, "d")}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DateNavigation;
