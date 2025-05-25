import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FilterOptions } from "@/types/instructor";
import { useIsMobile } from "@/hooks/use-mobile";

const locations = [
  "Yio Chu Kang",
  "Bishan",
  "Yishun",
  "Sengkang",
  "Punggol",
  "Pasir Ris",
  "Tampines",
  "Marine Parade",
  "Queenstown",
  "Bukit Batok",
  "Woodlands",
];

interface FilterSectionProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

const FilterSection = ({ onFilterChange, activeFilters }: FilterSectionProps) => {
  const [filters, setFilters] = useState<FilterOptions>(activeFilters);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleFilterUpdate = (updatedFilters: FilterOptions) => {
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleLocationChange = (location: string[]) => {
    const updatedFilters = { ...filters, location };
    setFilters(updatedFilters);
    handleFilterUpdate(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      instructorName: "",
      location: [],
      budget: 200,
      level: "",
      needsCourt: false,
      date: today,
      timeRange: [6, 22],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const updatedFilters = { ...filters, date };
      setFilters(updatedFilters);
      handleFilterUpdate(updatedFilters);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* First Row - Location and Budget */}
      <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
        {/* Location Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Location</Label>
          <Select onValueChange={(value) => handleLocationChange(value === "all" ? [] : [value])}>
            <SelectTrigger className="w-full h-9 text-xs">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Budget Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Budget (S$/hr)</Label>
          <Slider
            defaultValue={[filters.budget]}
            max={200}
            step={10}
            onValueChange={(value) => {
              const updatedFilters = { ...filters, budget: value[0] };
              setFilters(updatedFilters);
              handleFilterUpdate(updatedFilters);
            }}
          />
          <Input
            type="number"
            value={filters.budget}
            onChange={(e) => {
              const budget = parseInt(e.target.value);
              if (!isNaN(budget)) {
                const updatedFilters = { ...filters, budget };
                setFilters(updatedFilters);
                handleFilterUpdate(updatedFilters);
              }
            }}
            className="mt-2 h-8 text-xs"
          />
        </div>
      </div>

      {/* Second Row - Level, Court, Date, Time */}
      <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-4"} gap-4`}>
        {/* Level Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Level</Label>
          <Select onValueChange={(value) => {
            const updatedFilters = { ...filters, level: value };
            setFilters(updatedFilters);
            handleFilterUpdate(updatedFilters);
          }}>
            <SelectTrigger className="w-full h-9 text-xs">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_levels">Any</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Court Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Court</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Button
              variant={filters.needsCourt ? "default" : "outline"}
              onClick={() => {
                const updatedFilters = { ...filters, needsCourt: !filters.needsCourt };
                setFilters(updatedFilters);
                handleFilterUpdate(updatedFilters);
              }}
              className="text-xs h-8"
            >
              {filters.needsCourt ? "Instructor provides" : "I need a court"}
            </Button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-9 text-xs",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {filters.date ? format(filters.date, "MMM d, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={handleDateSelect}
                disabled={(date) => date < today}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Range Filter */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Time Range</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="From"
              value={filters.timeRange[0]}
              onChange={(e) => {
                const fromTime = parseInt(e.target.value);
                if (!isNaN(fromTime)) {
                  const updatedFilters = { ...filters, timeRange: [fromTime, filters.timeRange[1]] };
                  setFilters(updatedFilters);
                  handleFilterUpdate(updatedFilters);
                }
              }}
              className="w-16 h-8 text-xs"
            />
            <span className="mx-1 text-gray-500">to</span>
            <Input
              type="number"
              placeholder="To"
              value={filters.timeRange[1]}
              onChange={(e) => {
                const toTime = parseInt(e.target.value);
                if (!isNaN(toTime)) {
                  const updatedFilters = { ...filters, timeRange: [filters.timeRange[0], toTime] };
                  setFilters(updatedFilters);
                  handleFilterUpdate(updatedFilters);
                }
              }}
              className="w-16 h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button 
          onClick={() => handleFilterUpdate(filters)} 
          className="bg-tennis-green hover:bg-tennis-green/90 text-xs h-8"
        >
          Search
        </Button>
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="text-xs h-8"
        >
          <RotateCcw className="mr-1 h-3 w-3" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
