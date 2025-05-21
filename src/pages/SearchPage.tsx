
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterSection from "@/components/FilterSection";
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
    location: [],
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
        if (filters.location.length > 0) {
          const hasMatch = instructor.location.some(loc => filters.location.includes(loc));
          if (!hasMatch) return;
        }
        
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
      
      <div className="container mx-auto px-4">
        {/* Compact Hero Section */}
        <div className="mb-2 pt-2 text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-1">Find Tennis Instructors in Singapore</h1>
          <p className="text-xs text-muted-foreground md:w-2/3 mx-auto">
            Find tennis instructors at your preferred location, time, and budget.
          </p>
        </div>
        
        {/* Fixed Filter and Date Navigation - Combined and Compact */}
        <div className="sticky top-[48px] z-40 bg-gray-50 pt-1 pb-2">
          <div className="bg-white rounded-lg shadow-md p-3 mb-0">
            <FilterSection 
              onFilterChange={handleFilterChange}
              activeFilters={filters}
            />
          </div>
          
          {/* Sort Controls */}
          <div className="bg-white rounded-b-lg shadow-md px-3 py-2 mb-3 border-t flex justify-between items-center">
            <h2 className="text-sm font-semibold">
              {isLoading 
                ? "Searching for instructors..." 
                : `Available Instructors ${filteredResults.length > 0 ? `(${filteredResults.length})` : ''}`
              }
            </h2>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={`text-xs h-7 ${sortBy === "time" ? "bg-gray-100" : ""}`}
                onClick={() => toggleSort("time")}
              >
                Time {sortBy === "time" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={`text-xs h-7 ${sortBy === "price" ? "bg-gray-100" : ""}`}
                onClick={() => toggleSort("price")}
              >
                Price {sortBy === "price" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="mb-6 pt-1">
          {isLoading ? (
            // Loading state 
            <div className="flex justify-center py-4">
              <div className="animate-pulse space-y-3 w-full">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm h-36" />
                ))}
              </div>
            </div>
          ) : noResults ? (
            // No results state
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No instructors found</h3>
              <p className="text-muted-foreground mb-3">
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
        <div className="border-t border-gray-200 mt-8 pt-4 text-sm text-gray-500">
          <h3 className="font-semibold mb-2">Disclaimer:</h3>
          <p className="mb-4 text-xs">
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
