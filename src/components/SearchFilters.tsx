import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchFiltersProps {
  categories: any[];
  departments: any[];
  subjects: any[];
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  query: string;
  category: string;
  department: string;
  subject: string;
  semester: string;
}

export const SearchFilters = ({ categories, departments, subjects, onSearch }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    department: "",
    subject: "",
    semester: "",
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters, [key]: "" };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      query: "",
      category: "",
      department: "",
      subject: "",
      semester: "",
    };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials by title, description, or tags..."
            value={filters.query}
            onChange={(e) => handleFilterChange("query", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.department} onValueChange={(value) => handleFilterChange("department", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.subject} onValueChange={(value) => handleFilterChange("subject", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subj) => (
              <SelectItem key={subj.id} value={subj.id}>
                {subj.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.semester} onValueChange={(value) => handleFilterChange("semester", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <SelectItem key={sem} value={sem.toString()}>
                Semester {sem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.category && (
            <Badge variant="secondary">
              Category
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("category")}
              />
            </Badge>
          )}
          {filters.department && (
            <Badge variant="secondary">
              Department
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("department")}
              />
            </Badge>
          )}
          {filters.subject && (
            <Badge variant="secondary">
              Subject
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("subject")}
              />
            </Badge>
          )}
          {filters.semester && (
            <Badge variant="secondary">
              Semester {filters.semester}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("semester")}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};
