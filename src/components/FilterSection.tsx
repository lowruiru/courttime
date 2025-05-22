import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { format, addDays } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterOptions, Levels, NeighborhoodsByRegion, AllNeighborhoods } from "@/types/instructor";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, X } from "lucide-react";

interface FilterSectionProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

const FilterSection = ({ onFilterChange, activeFilters }: FilterSectionProps) => {
  const [filters, setFilters] = useState<FilterOptions>(activeFilters);
  const [locationCommandOpen, setLocationCommandOpen] = useState(false);

  // Effect to apply filter changes automatically
  useEffect(() => {
    // Debounce to avoid too many updates
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };
  
  const resetFilters = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const defaultFilters: FilterOptions = {
      instructorName: "",
      location: [],
      budget: 200,
      level: "",
      needsCourt: false,
      date: today,
      timeRange: [6, 22]
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const toggleLocation = (location: string) => {
    const newLocations = filters.location.includes(location)
      ? filters.location.filter(l => l !== location)
      : [...filters.location, location];
    handleFilterChange("location", newLocations);
  };

  const removeLocation = (location: string) => {
    const newLocations = filters.location.filter(l => l !== location);
    handleFilterChange("location", newLocations);
  };

  const goToPreviousDay = () => {
    if (filters.date) {
      const newDate = addDays(filters.date, -1);
      handleFilterChange("date", newDate);
    }
  };

  const goToNextDay = () => {
    if (filters.date) {
      const newDate = addDays(filters.date, 1);
      handleFilterChange("date", newDate);
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = addDays(today, 1);
      handleFilterChange("date", tomorrow);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-4">
          <h2 className="text-base font-semibold">Find a Tennis Instructor</h2>
          <div className="flex items-center gap-2">
            <Switch
              id="needsCourt"
              checked={filters.needsCourt}
              onCheckedChange={(checked) => handleFilterChange("needsCourt", checked)}
              className="h-4"
            />
            <Label htmlFor="needsCourt" className="text-xs">I need a court</Label>
          </div>
          
          {/* Budget filter */}
          <div className="space-y-0 flex items-center gap-2">
            <Label htmlFor="budget" className="text-xs whitespace-nowrap">Budget: S${filters.budget}</Label>
            <Slider
              id="budget"
              value={[filters.budget]}
              min={30}
              max={200}
              step={10}
              onValueChange={(value) => handleFilterChange("budget", value[0])}
              className="w-24"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {/* 1. Search by Instructor Name */}
        <div className="space-y-1 col-span-1">
          <Label htmlFor="instructorName" className="text-xs">Instructor Name</Label>
          <div className="relative">
            <Input
              id="instructorName"
              placeholder="Search..."
              value={filters.instructorName || ""}
              onChange={(e) => handleFilterChange("instructorName", e.target.value)}
              className="h-8 text-xs pl-8"
            />
            <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* 2. Date Selection */}
        <div className="space-y-1 col-span-1">
          <Label htmlFor="date" className="text-xs">Date</Label>
          <div className="flex h-8 space-x-1">
            <Button
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={goToPreviousDay}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-8 text-xs px-2",
                    !filters.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {filters.date ? format(filters.date, "MMM d") : <span>Pick</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) => handleFilterChange("date", date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline" 
              size="icon"
              className="h-8 w-8"
              onClick={goToNextDay}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 3. Time Range */}
        <div className="space-y-1 col-span-1">
          <Label htmlFor="timeRange" className="text-xs">
            {filters.timeRange[0].toString().padStart(2, '0')}:00-{filters.timeRange[1].toString().padStart(2, '0')}:00
          </Label>
          <Slider
            id="timeRange"
            value={filters.timeRange}
            min={6}
            max={22}
            step={1}
            onValueChange={(value) => handleFilterChange("timeRange", value)}
            className="py-2"
          />
        </div>

        {/* 4. Location */}
        <div className="space-y-1 col-span-1">
          <Label htmlFor="location" className="text-xs">Location</Label>
          <Popover open={locationCommandOpen} onOpenChange={setLocationCommandOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={locationCommandOpen}
                className="h-8 w-full justify-between text-xs overflow-hidden whitespace-nowrap"
              >
                {filters.location.length > 0
                  ? `${filters.location.length} selected`
                  : "Select"}
                <ChevronRight className="ml-1 h-4 w-4 shrink-0 rotate-90 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search locations..." className="h-8" />
                <CommandList>
                  <CommandEmpty>No locations found.</CommandEmpty>
                  {Object.entries(NeighborhoodsByRegion).map(([region, neighborhoods]) => (
                    <CommandGroup key={region} heading={region}>
                      {neighborhoods.map((neighborhood) => (
                        <CommandItem
                          key={neighborhood}
                          value={neighborhood}
                          onSelect={() => toggleLocation(neighborhood)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-4 w-4 border rounded flex items-center justify-center",
                              filters.location.includes(neighborhood) ? "bg-primary border-primary" : "border-input"
                            )}>
                              {filters.location.includes(neighborhood) && (
                                <CheckIcon className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span>{neighborhood}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {filters.location.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {filters.location.slice(0, 1).map((location) => (
                <Badge key={location} variant="outline" className="text-[10px] h-5 px-1">
                  {location}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeLocation(location)}
                  />
                </Badge>
              ))}
              {filters.location.length > 1 && (
                <Badge variant="outline" className="text-[10px] h-5 px-1">
                  +{filters.location.length - 1} more
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {/* 5. Level */}
        <div className="space-y-1 col-span-1">
          <Label htmlFor="level" className="text-xs">Level</Label>
          <Select
            value={filters.level}
            onValueChange={(value) => handleFilterChange("level", value)}
          >
            <SelectTrigger id="level" className="h-8 text-xs">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="all_levels">Any Level</SelectItem>
              {Levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* 6. Budget filter - Moved down next to level */}
        <div className="space-y-1 col-span-1">
          <Label htmlFor="budget" className="text-xs whitespace-nowrap">Budget: S${filters.budget}</Label>
          <Slider
            id="budget"
            value={[filters.budget]}
            min={30}
            max={200}
            step={10}
            onValueChange={(value) => handleFilterChange("budget", value[0])}
            className="py-2"
          />
        </div>
      </div>
      
      {/* Filter Action Buttons */}
      <div className="flex justify-end gap-3 mt-3">
        <Button variant="outline" size="sm" onClick={resetFilters} className="h-7 text-xs">Reset</Button>
        <Button size="sm" className="bg-tennis-green hover:bg-tennis-green/90 h-7 text-xs" onClick={applyFilters}>
          Search Instructors
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
