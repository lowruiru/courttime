
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterSection from "@/components/FilterSection";
import InstructorCard from "@/components/InstructorCard";
import { Instructor, FilterOptions, TimeSlot } from "@/types/instructor";
import { instructors } from "@/data/instructors";
import { isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const RESULTS_PER_PAGE = 5;

const SearchPage = () => {
  const defaultFilters: FilterOptions = {
    instructorName: "",
    location: [],
    budget: 200,
    level: "",
    needsCourt: false,
    date: undefined, // Remove default date
    timeRange: [6, 22]
  };
  
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [filteredResults, setFilteredResults] = useState<{ instructor: Instructor, timeSlot: TimeSlot }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [instructorNameFilter, setInstructorNameFilter] = useState<string>("");
  const [sortOptions, setSortOptions] = useState({
    time: { active: true, direction: "asc" as "asc" | "desc" },
    price: { active: false, direction: "asc" as "asc" | "desc" }
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );
  
  // Apply filters to instructors and their availability
  useEffect(() => {
    setIsLoading(true);
    setNoResults(false);
    setCurrentPage(1); // Reset to first page on filter change
    
    // Simulate API delay for realistic UX
    const timer = setTimeout(() => {
      const results: { instructor: Instructor, timeSlot: TimeSlot }[] = [];
      
      instructors.forEach(instructor => {
        // Filter by name if specified
        if (instructorNameFilter && !instructor.name.toLowerCase().includes(instructorNameFilter.toLowerCase())) return;
        
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
      
      // Apply multi-criteria sorting
      let sortedResults = [...results];
      
      // Apply sorting based on active sort options
      sortedResults.sort((a, b) => {
        // First sort by time if active
        if (sortOptions.time.active) {
          const aTime = a.timeSlot.startTime;
          const bTime = b.timeSlot.startTime;
          const timeCompare = sortOptions.time.direction === "asc" 
            ? aTime.localeCompare(bTime)
            : bTime.localeCompare(aTime);
          
          // If times are different or price sorting is not active, return the time comparison
          if (timeCompare !== 0 || !sortOptions.price.active) return timeCompare;
        }
        
        // Then sort by price if active
        if (sortOptions.price.active) {
          return sortOptions.price.direction === "asc"
            ? a.instructor.fee - b.instructor.fee
            : b.instructor.fee - a.instructor.fee;
        }
        
        return 0; // Default if no sort criteria are active
      });
      
      setFilteredResults(sortedResults);
      setNoResults(sortedResults.length === 0);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters, sortOptions, instructorNameFilter]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const toggleSort = (type: "time" | "price") => {
    setSortOptions(prev => {
      const newOptions = { ...prev };
      
      if (prev[type].active) {
        // Toggle direction if already active
        newOptions[type].direction = prev[type].direction === "asc" ? "desc" : "asc";
      } else {
        // Enable this sort option
        newOptions[type].active = true;
      }
      
      return newOptions;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll back to top of results
    window.scrollTo({
      top: document.querySelector('.sticky')?.getBoundingClientRect().bottom || 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4">
        {/* Fixed Filter Sections with higher z-index */}
        <div className="sticky top-[48px] z-40 bg-gray-50 pt-2 pb-1">
          <div className="bg-white rounded-lg shadow-md p-3 mb-2">
            <FilterSection 
              onFilterChange={handleFilterChange}
              activeFilters={filters}
            />
          </div>
          
          {/* Sort Controls with Toggles - Moved Instructor Name Filter */}
          <div className="bg-white rounded-lg shadow-md px-3 py-2 mb-0 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold whitespace-nowrap">
                {isLoading 
                  ? "Searching for instructors..." 
                  : "Available Instructors"
                }
              </h2>
              
              {/* Instructor name filter - moved next to "Available Instructors" */}
              <div className="relative">
                <Input
                  placeholder="Search instructor..."
                  value={instructorNameFilter}
                  onChange={(e) => setInstructorNameFilter(e.target.value)}
                  className="h-7 text-xs w-40 pl-8"
                />
                <Search className="absolute left-2 top-1.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              <ToggleGroup type="multiple">
                <ToggleGroupItem 
                  value="time" 
                  aria-label="Sort by time" 
                  size="sm"
                  className={`text-xs h-7 flex items-center gap-1 ${sortOptions.time.active ? "bg-gray-100" : ""}`}
                  onClick={() => toggleSort("time")}
                >
                  Time
                  {sortOptions.time.active && (
                    sortOptions.time.direction === "asc" 
                      ? <ArrowUp className="h-3 w-3" /> 
                      : <ArrowDown className="h-3 w-3" />
                  )}
                </ToggleGroupItem>
                
                <ToggleGroupItem 
                  value="price" 
                  aria-label="Sort by price"
                  size="sm"
                  className={`text-xs h-7 flex items-center gap-1 ${sortOptions.price.active ? "bg-gray-100" : ""}`}
                  onClick={() => toggleSort("price")}
                >
                  Price
                  {sortOptions.price.active && (
                    sortOptions.price.direction === "asc" 
                      ? <ArrowUp className="h-3 w-3" /> 
                      : <ArrowDown className="h-3 w-3" />
                  )}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
        
        {/* Add an extra margin/padding for better scroll appearance */}
        <div className="pt-3">
          {/* Results Section */}
          <div className="mb-6">
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
              // Results list with pagination
              <>
                <div>
                  {paginatedResults.map(({ instructor, timeSlot }) => (
                    <InstructorCard 
                      key={`${instructor.id}-${timeSlot.id}`}
                      instructor={instructor} 
                      timeSlot={timeSlot}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {filteredResults.length > RESULTS_PER_PAGE && (
                  <Pagination className="my-6">
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                        </PaginationItem>
                      )}
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show current page, first, last, and pages around current
                        const shouldShowPage = 
                          pageNumber === 1 || 
                          pageNumber === totalPages ||
                          Math.abs(pageNumber - currentPage) <= 1;
                        
                        if (!shouldShowPage) {
                          // Show ellipsis for gaps
                          if (pageNumber === 2 || pageNumber === totalPages - 1) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <span className="px-2">...</span>
                              </PaginationItem>
                            );
                          }
                          return null;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
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
