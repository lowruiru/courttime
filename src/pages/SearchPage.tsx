
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterSection from "@/components/FilterSection";
import DateNavigation from "@/components/DateNavigation";
import InstructorCard from "@/components/InstructorCard";
import { Instructor, FilterOptions, TimeSlot } from "@/types/instructor";
import { instructors } from "@/data/instructors";
import { isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

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
  const [sortBy, setSortBy] = useState<"time" | "price">("time");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
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
      
      // Sort results based on current sort settings
      let sortedResults = [...results];
      
      if (sortBy === "time") {
        sortedResults.sort((a, b) => {
          const aTime = a.timeSlot.startTime;
          const bTime = b.timeSlot.startTime;
          return sortDirection === "asc" 
            ? aTime.localeCompare(bTime)
            : bTime.localeCompare(aTime);
        });
      } else if (sortBy === "price") {
        sortedResults.sort((a, b) => {
          return sortDirection === "asc"
            ? a.instructor.fee - b.instructor.fee
            : b.instructor.fee - a.instructor.fee;
        });
      }
      
      setFilteredResults(sortedResults);
      setNoResults(sortedResults.length === 0);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters, sortBy, sortDirection]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const handleDateChange = (date: Date) => {
    setFilters({ ...filters, date });
  };
  
  const toggleSort = (type: "time" | "price") => {
    if (sortBy === type) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortDirection("asc");
    }
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
        
        {/* Filter Section - Fixed at the top */}
        <div className="sticky top-16 z-40">
          <FilterSection 
            onFilterChange={handleFilterChange}
            activeFilters={filters}
          />
          
          {/* Date Navigation */}
          <DateNavigation 
            currentDate={filters.date}
            onDateChange={handleDateChange}
          />
        </div>
        
        {/* Results Section */}
        <div className="mb-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isLoading 
                ? "Searching for instructors..." 
                : `Available Instructors ${filteredResults.length > 0 ? `(${filteredResults.length})` : ''}`
              }
            </h2>
            
            {/* Sort Controls */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={`text-xs ${sortBy === "time" ? "bg-gray-100" : ""}`}
                onClick={() => toggleSort("time")}
              >
                Time {sortBy === "time" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={`text-xs ${sortBy === "price" ? "bg-gray-100" : ""}`}
                onClick={() => toggleSort("price")}
              >
                Price {sortBy === "price" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                )}
              </Button>
            </div>
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
        
        {/* Disclaimer Footer */}
        <div className="border-t border-gray-200 mt-12 pt-6 text-sm text-gray-500">
          <h3 className="font-semibold mb-2">Disclaimer:</h3>
          <p className="mb-4">
            This website is created for learning purposes only. The information provided here should not be 
            considered professional advice. Please note that we make no guarantees regarding the accuracy, 
            completeness, or reliability of the contents of this website. Any actions you take based on the 
            contents of this website are at your own risk. We are not liable for any losses or damages 
            incurred from the use of this website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
