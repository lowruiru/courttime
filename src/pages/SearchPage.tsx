
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterSection from "@/components/FilterSection";
import DateNavigation from "@/components/DateNavigation";
import InstructorCard from "@/components/InstructorCard";
import { Instructor, FilterOptions, TimeSlot } from "@/types/instructor";
import { instructors } from "@/data/instructors";
import { isSameDay } from "date-fns";

const SearchPage = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const defaultFilters: FilterOptions = {
    location: "",
    budget: 200,
    level: "",
    needsCourt: false,
    date: today,
    timeRange: [7, 22]
  };
  
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [filteredResults, setFilteredResults] = useState<{ instructor: Instructor, timeSlot: TimeSlot }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  
  // Apply filters to instructors and their availability
  useEffect(() => {
    setIsLoading(true);
    setNoResults(false);
    
    // Simulate API delay for realistic UX
    const timer = setTimeout(() => {
      const results: { instructor: Instructor, timeSlot: TimeSlot }[] = [];
      
      instructors.forEach(instructor => {
        // Filter by budget
        if (instructor.fee > filters.budget) return;
        
        // Filter by location if specified
        if (filters.location && filters.location !== "all_locations" && !instructor.location.includes(filters.location)) return;
        
        // Filter by level if specified
        if (filters.level && filters.level !== "all_levels" && !instructor.levels.includes(filters.level)) return;
        
        // Filter by court availability if needed
        if (filters.needsCourt && !instructor.providesOwnCourt) return;
        
        // Filter by date and time slots
        const availableSlots = instructor.availability.filter(slot => {
          // Skip booked slots
          if (slot.booked) return false;
          
          // Filter by date if specified
          if (filters.date) {
            const slotDate = new Date(slot.date);
            if (!isSameDay(slotDate, filters.date)) return false;
          }
          
          // Filter by time range
          const startHour = parseInt(slot.startTime.split(':')[0], 10);
          return startHour >= filters.timeRange[0] && startHour <= filters.timeRange[1];
        });
        
        // Add instructor with each available time slot
        availableSlots.forEach(slot => {
          results.push({ instructor, timeSlot: slot });
        });
      });
      
      // Sort results by time (earliest first)
      results.sort((a, b) => {
        const aTime = a.timeSlot.startTime;
        const bTime = b.timeSlot.startTime;
        return aTime.localeCompare(bTime);
      });
      
      setFilteredResults(results);
      setNoResults(results.length === 0);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const handleDateChange = (date: Date) => {
    setFilters({ ...filters, date });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Find Tennis Instructors in Singapore</h1>
          <p className="text-muted-foreground md:w-2/3 mx-auto">
            Book lessons with experienced tennis instructors at your preferred location, time, and budget.
          </p>
        </div>
        
        {/* Filter Section */}
        <FilterSection 
          onFilterChange={handleFilterChange}
          activeFilters={filters}
        />
        
        {/* Date Navigation */}
        <DateNavigation 
          currentDate={filters.date}
          onDateChange={handleDateChange}
        />
        
        {/* Results Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isLoading 
                ? "Searching for instructors..." 
                : `Available Instructors ${filteredResults.length > 0 ? `(${filteredResults.length})` : ''}`
              }
            </h2>
          </div>
          
          {isLoading ? (
            // Loading state 
            <div className="flex justify-center py-12">
              <div className="animate-pulse space-y-4 w-full">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm h-48" />
                ))}
              </div>
            </div>
          ) : noResults ? (
            // No results state
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No instructors found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            // Results list
            <div>
              {filteredResults.map(({ instructor, timeSlot }) => (
                <InstructorCard 
                  key={timeSlot.id}
                  instructor={instructor} 
                  timeSlot={timeSlot}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
