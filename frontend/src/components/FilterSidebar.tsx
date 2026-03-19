import { Search, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterState {
  platform: string;
  category: string;
  contentType: string;
  followers: string;
  location: string;
  price: string;
  gender: string;
  age: string;
  language: string;
}

const defaultFilters: FilterState = {
  platform: "any",
  category: "",
  contentType: "any",
  followers: "any",
  location: "any",
  price: "any",
  gender: "any",
  age: "any",
  language: "any",
};

const platforms = ["Instagram", "TikTok", "YouTube"];
const contentTypes = ["UGC", "Reels", "Posts", "Videos", "Reviews", "Vlogs"];
const followerRanges = [
  { label: "1K - 10K", value: "1k-10k" },
  { label: "10K - 50K", value: "10k-50k" },
  { label: "50K - 500K", value: "50k-500k" },
  { label: "500K - 1M", value: "500k-1m" },
  { label: "1M+", value: "1m+" },
];
const priceRanges = [
  { label: "Under $50", value: "0-50" },
  { label: "$50 - $100", value: "50-100" },
  { label: "$100 - $250", value: "100-250" },
  { label: "$250 - $500", value: "250-500" },
  { label: "$500+", value: "500+" },
];
const genders = ["Male", "Female", "Non-binary"];
const ageRanges = ["18-24", "25-34", "35-44", "45+"];
const languages = ["English", "Hindi", "Spanish", "French", "Arabic", "Mandarin"];
const locations = [
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "UAE",
  "Spain",
];

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onSearch,
  searchQuery,
}: FilterSidebarProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAll = () => {
    onFilterChange(defaultFilters);
    onSearch("");
  };

  const hasActiveFilters =
    Object.entries(filters).some(
      ([key, val]) => val !== defaultFilters[key as keyof FilterState]
    ) || searchQuery !== "";

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="flex gap-2">
        {/* Platform Dropdown */}
        <div className="shrink-0">
          <Select
            value={filters.platform}
            onValueChange={(v) => updateFilter("platform", v)}
          >
            <SelectTrigger className="w-[130px] bg-white rounded-full border-gray-200">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-gray-500 text-xs">Platform</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {platforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Search */}
        <div className="relative flex-1">
          <Input
            placeholder="Enter keywords, niches or categories"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="bg-white rounded-full border-gray-200 pr-10 text-sm"
          />
          <button
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors"
            onClick={() => {}}
          >
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Filter Pills Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Content Type */}
        <Select
          value={filters.contentType}
          onValueChange={(v) => updateFilter("contentType", v)}
        >
          <SelectTrigger className="h-8 text-xs rounded-full border-gray-200 bg-white px-3 gap-1 w-auto">
            <span className={filters.contentType !== "any" ? "text-pink-600 font-medium" : ""}>
              Content Type
            </span>
            <ChevronDown className="w-3 h-3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {contentTypes.map((ct) => (
              <SelectItem key={ct} value={ct}>
                {ct}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Followers */}
        <Select
          value={filters.followers}
          onValueChange={(v) => updateFilter("followers", v)}
        >
          <SelectTrigger className="h-8 text-xs rounded-full border-gray-200 bg-white px-3 gap-1 w-auto">
            <span className={filters.followers !== "any" ? "text-pink-600 font-medium" : ""}>
              Followers
            </span>
            <ChevronDown className="w-3 h-3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {followerRanges.map((fr) => (
              <SelectItem key={fr.value} value={fr.value}>
                {fr.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select
          value={filters.location}
          onValueChange={(v) => updateFilter("location", v)}
        >
          <SelectTrigger className="h-8 text-xs rounded-full border-gray-200 bg-white px-3 gap-1 w-auto">
            <span className={filters.location !== "any" ? "text-pink-600 font-medium" : ""}>
              Location
            </span>
            <ChevronDown className="w-3 h-3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price */}
        <Select
          value={filters.price}
          onValueChange={(v) => updateFilter("price", v)}
        >
          <SelectTrigger className="h-8 text-xs rounded-full border-gray-200 bg-white px-3 gap-1 w-auto">
            <span className={filters.price !== "any" ? "text-pink-600 font-medium" : ""}>
              Price
            </span>
            <ChevronDown className="w-3 h-3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {priceRanges.map((pr) => (
              <SelectItem key={pr.value} value={pr.value}>
                {pr.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gender */}
        <Select
          value={filters.gender}
          onValueChange={(v) => updateFilter("gender", v)}
        >
          <SelectTrigger className="h-8 text-xs rounded-full border-gray-200 bg-white px-3 gap-1 w-auto">
            <span className={filters.gender !== "any" ? "text-pink-600 font-medium" : ""}>
              Gender
            </span>
            <ChevronDown className="w-3 h-3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {genders.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Age */}
        <Select
          value={filters.age}
          onValueChange={(v) => updateFilter("age", v)}
        >
          <SelectTrigger className="h-8 text-xs rounded-full border-gray-200 bg-white px-3 gap-1 w-auto">
            <span className={filters.age !== "any" ? "text-pink-600 font-medium" : ""}>
              Age
            </span>
            <ChevronDown className="w-3 h-3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {ageRanges.map((ar) => (
              <SelectItem key={ar} value={ar}>
                {ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Language */}
        <Select
          value={filters.language}
          onValueChange={(v) => updateFilter("language", v)}
        >
          <SelectTrigger className="h-8 text-xs rounded-full border-gray-200 bg-white px-3 gap-1 w-auto">
            <span className={filters.language !== "any" ? "text-pink-600 font-medium" : ""}>
              Language
            </span>
            <ChevronDown className="w-3 h-3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {languages.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear All */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-gray-500 hover:text-gray-900 px-2"
            onClick={clearAll}
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}

export { defaultFilters };
