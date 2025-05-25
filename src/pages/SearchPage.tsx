import { useState, useEffect } from "react";
import Header from "@/components/Header";
import FilterSection from "@/components/FilterSection";
import InstructorCard from "@/components/InstructorCard";
import { Instructor, FilterOptions, TimeSlot, Specializations } from "@/types/instructor";
import { instructors } from "@/data/instructors";
import { isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const RESULTS_PER_PAGE = 5;

const SearchPage = () => {
  // Set default date to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const defaultFilters: FilterOptions = {
    instructorName: "",
    location: [],
    budget: 200,
    level: "",
    needsCourt: false,
    date: today, // Set default to today
    timeRange: [6, 22]
  };
  
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [filteredResults, setFilteredResults] = useState<{ instructor: Instructor, timeSlot: TimeSlot, isAvailable: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState({
    time: { active: true, direction: "asc" as "asc" | "desc" }, // Set default to earliest first
    price: { active: false, direction: "asc" as "asc" | "desc" }
  });
  const isMobile = useIsMobile();
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Apply availability filter
  const finalResults = showAvailableOnly 
    ? filteredResults.filter(result => result.isAvailable)
    : filteredResults;
  
  // Calculate total pages and paginate results
  const totalPages = Math.ceil(finalResults.length / RESULTS_PER_PAGE);
  const paginatedResults = finalResults.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );
  
  // Assign specializations to instructors if missing
  useEffect(() => {
    // Modify instructors data to add missing specializations
    instructors.forEach(instructor => {
      if (!instructor.specialization) {
        const randomIndex = Math.floor(Math.random() * Specializations.length);
        instructor.specialization = Specializations[randomIndex];
      }
    });
  }, []);

  // Apply filters to instructors and their availability
  useEffect(() => {
    setIsLoading(true);
    setNoResults(false);
    setCurrentPage(1); // Reset to first page on filter change
    
    // Simulate API delay for realistic UX
    const timer = setTimeout(() => {
      const results: { instructor: Instructor, timeSlot: TimeSlot, isAvailable: boolean }[] = [];
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      
      // Get all instructors and create multiple entries per instructor for the filtered date
      const availableInstructors = instructors.filter(instructor => {
        // Filter by name if specified - make sure this works properly
        if (filters.instructorName && filters.instructorName.trim() !== "") {
          const nameMatch = instructor.name.toLowerCase().includes(filters.instructorName.toLowerCase().trim());
          if (!nameMatch) return false;
        }
        
        // Filter by budget
        if (instructor.fee > filters.budget) return false;
        
        // Filter by location if specified
        if (filters.location.length > 0) {
          const hasMatch = instructor.location.some(loc => filters.location.includes(loc));
          if (!hasMatch) return false;
        }
        
        // Filter by level if specified
        if (filters.level && filters.level !== "all_levels" && !instructor.levels.includes(filters.level)) return false;
        
        // Filter by court availability if needed
        if (filters.needsCourt && !instructor.providesOwnCourt) return false;
        
        return true;
      });

      // If we have a date filter, ensure at least 5 different instructors
      if (filters.date) {
        // Shuffle instructors to get variety
        const shuffledInstructors = [...availableInstructors].sort(() => Math.random() - 0.5);
        const minInstructors = Math.max(5, Math.min(shuffledInstructors.length, 8));
        const selectedInstructors = shuffledInstructors.slice(0, minInstructors);
        
        selectedInstructors.forEach(instructor => {
          // Generate 1-3 time slots for each instructor on the filtered date
          const slotsCount = Math.floor(Math.random() * 3) + 1;
          
          for (let i = 0; i < slotsCount; i++) {
            let startHour = Math.floor(Math.random() * (filters.timeRange[1] - filters.timeRange[0])) + filters.timeRange[0];
            
            // If filtering by today's date, only show slots after current time
            if (isSameDay(filters.date, currentTime)) {
              startHour = Math.max(startHour, currentHour + 1);
            }
            
            // Skip if hour is outside range
            if (startHour > filters.timeRange[1]) continue;
            
            const endHour = startHour + 1;
            const startTime = `${startHour.toString().padStart(2, '0')}:00`;
            const endTime = `${endHour.toString().padStart(2, '0')}:00`;
            const dateStr = filters.date.toISOString().split('T')[0];
            
            // Randomly make some slots unavailable (30% chance)
            const isAvailable = Math.random() > 0.3;
            
            const timeSlot: TimeSlot = {
              id: `generated-${instructor.id}-${dateStr}-${startHour}`,
              date: dateStr,
              startTime,
              endTime,
              location: instructor.location[Math.floor(Math.random() * instructor.location.length)],
              booked: false
            };
            
            results.push({ instructor, timeSlot, isAvailable });
          }
        });
      } else {
        // Original logic for when no date filter is applied
        availableInstructors.forEach(instructor => {
          const availableSlots = instructor.availability.filter(slot => {
            // Skip booked slots
            if (slot.booked) return false;
            
            // Filter by time range
            const startHour = parseInt(slot.startTime.split(':')[0], 10);
            return startHour >= filters.timeRange[0] && startHour <= filters.timeRange[1];
          });
          
          availableSlots.forEach(slot => {
            // Randomly make some slots unavailable (20% chance)
            const isAvailable = Math.random() > 0.2;
            results.push({ instructor, timeSlot: slot, isAvailable });
          });
        });
      }
      
      // Apply sorting - only one sort option can be active at a time
      let sortedResults = [...results];
      
      if (sortOptions.price.active) {
        // Sort by price only
        sortedResults.sort((a, b) => {
          return sortOptions.price.direction === "asc"
            ? a.instructor.fee - b.instructor.fee
            : b.instructor.fee - a.instructor.fee;
        });
      } else {
        // Sort by time (default when price is not active)
        sortedResults.sort((a, b) => {
          // First sort by date
          const dateA = new Date(a.timeSlot.date);
          const dateB = new Date(b.timeSlot.date);
          
          if (dateA.getTime() !== dateB.getTime()) {
            return sortOptions.time.direction === "asc" 
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          }
          
          // If dates are the same, sort by time
          const timeA = a.timeSlot.startTime;
          const timeB = b.timeSlot.startTime;
          return sortOptions.time.direction === "asc" 
            ? timeA.localeCompare(timeB)
            : timeB.localeCompare(timeA);
        });
      }
      
      setFilteredResults(sortedResults);
      setNoResults(sortedResults.length === 0);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters, sortOptions]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const toggleSort = (type: "time" | "price") => {
    setSortOptions(prev => {
      const newOptions = { ...prev };
      
      if (type === "price") {
        if (prev.price.active) {
          // Toggle direction if already active
          newOptions.price.direction = prev.price.direction === "asc" ? "desc" : "asc";
        } else {
          // Enable price sorting and disable time sorting
          newOptions.price.active = true;
          newOptions.time.active = false;
        }
      } else if (type === "time") {
        if (prev.time.active) {
          // Toggle direction if already active
          newOptions.time.direction = prev.time.direction === "asc" ? "desc" : "asc";
        } else {
          // Enable time sorting and disable price sorting
          newOptions.time.active = true;
          newOptions.price.active = false;
        }
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
        <div className={`sticky top-[48px] z-10 bg-gray-50 pt-2 pb-1`}>
          {/* Lower the z-index from 40 to 10 so it doesn't cover the signup modal */}
          <div className="bg-white rounded-lg shadow-md p-3 mb-2">
            <FilterSection 
              onFilterChange={handleFilterChange}
              activeFilters={filters}
            />
          </div>
          
          {/* Sort Controls with Toggles */}
          <div className="bg-white rounded-lg shadow-md px-3 py-2 mb-0 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className={`text-sm font-semibold whitespace-nowrap`}>
                {isLoading 
                  ? "Searching for instructors..." 
                  : "All Instructors"
                }
              </h2>
              
              {/* Search bar and availability filter */}
              <div className="flex items-center gap-3">
                <div className="relative">
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="showAvailableOnly"
                    checked={showAvailableOnly}
                    onCheckedChange={setShowAvailableOnly}
                    className="h-4"
                  />
                  <Label htmlFor="showAvailableOnly" className="text-xs whitespace-nowrap">
                    Show available classes only
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <span className={`text-xs text-muted-foreground ${isMobile ? 'hidden' : 'block'}`}>Sort by:</span>
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
              // Results list with pagination - showing exactly 5 results per page
              <>
                <div>
                  {paginatedResults.map(({ instructor, timeSlot, isAvailable }, index) => (
                    <InstructorCard 
                      key={`${instructor.id}-${timeSlot.id}-${index}`}
                      instructor={instructor} 
                      timeSlot={timeSlot}
                      isAvailable={isAvailable}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {finalResults.length > RESULTS_PER_PAGE && (
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
