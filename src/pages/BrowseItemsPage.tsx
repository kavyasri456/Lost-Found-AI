import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  RotateCcw, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Check,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Item, ItemCategory, CampusLocation, ItemType } from '../types';
import { ItemCard } from '../components/ItemCard';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../data/sampleData';

interface BrowseItemsPageProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  onCheckMatches: (item: Item) => void;
  onOpenReport: () => void;
  initialSearchQuery?: string;
  initialCategory?: ItemCategory | 'All';
}

export const BrowseItemsPage: React.FC<BrowseItemsPageProps> = ({
  items,
  onSelectItem,
  onCheckMatches,
  onOpenReport,
  initialSearchQuery = '',
  initialCategory = 'All',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Status filter
      if (statusFilter === 'lost' && item.type !== 'lost') return false;
      if (statusFilter === 'found' && item.type !== 'found') return false;

      // 2. Category filter
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;

      // 3. Location filter
      if (locationFilter !== 'All' && item.location !== locationFilter) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const locMatch = item.location.toLowerCase().includes(query);
        const locDetailMatch = item.locationDetail?.toLowerCase().includes(query);
        const catMatch = item.category.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !locMatch && !locDetailMatch && !catMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [items, statusFilter, categoryFilter, locationFilter, searchQuery, sortBy]);

  const hasActiveFilters = 
    statusFilter !== 'all' || 
    categoryFilter !== 'All' || 
    locationFilter !== 'All' || 
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('All');
    setLocationFilter('All');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Lost & Found Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse through active reports across university buildings, residence halls, and transit hubs.
          </p>
        </div>

        {/* Live Search input */}
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search keywords, items, buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs (Lost / Found / All) */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStatusFilter('lost')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'lost'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setStatusFilter('found')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'found'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found Only
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Campus Location Dropdown */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="All">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <span className="font-bold text-slate-900">{filteredItems.length}</span> item
            {filteredItems.length === 1 ? '' : 's'}
            {searchQuery && (
              <span> matching "<strong className="text-slate-800">{searchQuery}</strong>"</span>
            )}
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Active filters:</span>
              {statusFilter !== 'all' && (
                <span className="text-[11px] font-semibold text-blue-700 capitalize">{statusFilter}</span>
              )}
              {categoryFilter !== 'All' && (
                <span className="text-[11px] font-semibold text-blue-700">· {categoryFilter}</span>
              )}
              {locationFilter !== 'All' && (
                <span className="text-[11px] font-semibold text-blue-700">· {locationFilter}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onCheckMatches={onCheckMatches}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No items match your criteria</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any lost or found items matching your current filters or search keywords.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
            <button
              onClick={onOpenReport}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Report This Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
