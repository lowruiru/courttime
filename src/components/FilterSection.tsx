
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterOptions, Levels, Locations } from "@/types/instructor";

interface FilterSectionProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

const FilterSection = ({ onFilterChange, activeFilters }: FilterSectionProps) => {
  const [filters, setFilters] = useState<FilterOptions>(activeFilters);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };
  
  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      location: "",
      budget: 200,
      level: "",
      needsCourt: false,
      date: undefined,
      timeRange: [7, 22]
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4">Find Your Tennis Instructor</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Location Filter */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select
            value={filters.location}
            onValueChange={(value) => handleFilterChange("location", value)}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_locations">Any Location</SelectItem>
              {Locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Budget Filter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="budget">Budget (per session)</Label>
            <span className="text-sm font-medium">S${filters.budget}</span>
          </div>
          <Slider
            id="budget"
            value={[filters.budget]}
            min={30}
            max={200}
            step={10}
            onValueChange={(value) => handleFilterChange("budget", value[0])}
            className="py-4"
          />
        </div>
        
        {/* Level Filter */}
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={filters.level}
            onValueChange={(value) => handleFilterChange("level", value)}
          >
            <SelectTrigger id="level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_levels">Any Level</SelectItem>
              {Levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}
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
        </div>
        
        {/* Time Range Filter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="timeRange">Time Range</Label>
            <span className="text-sm font-medium">
              {filters.timeRange[0]}:00 - {filters.timeRange[1]}:00
            </span>
          </div>
          <Slider
            id="timeRange"
            value={filters.timeRange}
            min={7}
            max={22}
            step={1}
            onValueChange={(value) => handleFilterChange("timeRange", value)}
            className="py-4"
          />
        </div>
        
        {/* Court Availability Filter */}
        <div className="space-y-2">
          <Label htmlFor="needsCourt" className="flex justify-between">
            <span>Need Instructor's Court</span>
            <Switch
              id="needsCourt"
              checked={filters.needsCourt}
              onCheckedChange={(checked) => handleFilterChange("needsCourt", checked)}
            />
          </Label>
          <p className="text-xs text-muted-foreground">Toggle if you need the instructor to provide a court</p>
        </div>
      </div>
      
      {/* Filter Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={resetFilters}>Reset</Button>
        <Button className="bg-tennis-green hover:bg-tennis-green/90" onClick={applyFilters}>
          Search Instructors
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
