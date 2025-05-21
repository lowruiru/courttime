
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
    <div>
      <h2 className="text-base font-semibold mb-3">Find Your Tennis Instructor</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {/* Column 1 */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="location" className="text-xs">Location</Label>
            <Select
              value={filters.location}
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger id="location" className="h-8 text-xs">
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
          
          <div className="space-y-1">
            <Label htmlFor="level" className="text-xs">Level</Label>
            <Select
              value={filters.level}
              onValueChange={(value) => handleFilterChange("level", value)}
            >
              <SelectTrigger id="level" className="h-8 text-xs">
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
        </div>
        
        {/* Column 2 */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label htmlFor="budget" className="text-xs">Budget (per session)</Label>
              <span className="text-xs font-medium">S${filters.budget}</span>
            </div>
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
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label htmlFor="timeRange" className="text-xs">Time Range</Label>
              <span className="text-xs font-medium">
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
              className="py-2"
            />
          </div>
        </div>
        
        {/* Column 3 */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="date" className="text-xs">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-8 text-xs",
                    !filters.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
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
          
          <div className="space-y-1">
            <Label htmlFor="needsCourt" className="flex justify-between text-xs">
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
      </div>
      
      {/* Filter Action Buttons */}
      <div className="flex justify-end gap-3 mt-3">
        <Button variant="outline" size="sm" onClick={resetFilters}>Reset</Button>
        <Button size="sm" className="bg-tennis-green hover:bg-tennis-green/90" onClick={applyFilters}>
          Search Instructors
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
