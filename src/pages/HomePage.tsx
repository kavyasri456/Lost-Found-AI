import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import { Item, ItemCategory } from '../types';
import { ItemCard } from '../components/ItemCard';
import { CATEGORIES } from '../data/sampleData';

interface HomePageProps {
  items: Item[];
  onNavigate: (tab: 'home' | 'browse' | 'report' | 'ai-matches') => void;
  onSelectItem: (item: Item) => void;
  onOpenReportModal: (type: 'lost' | 'found') => void;
  onSelectCategoryFilter: (category: ItemCategory) => void;
  onSearchQuery: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  items,
  onNavigate,
  onSelectItem,
  onOpenReportModal,
  onSelectCategoryFilter,
  onSearchQuery,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [recentTab, setRecentTab] = useState<'all' | 'lost' | 'found'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchQuery(searchInput.trim());
      onNavigate('browse');
    }
  };

  const filteredRecents = items
    .filter((item) => {
      if (recentTab === 'lost') return item.type === 'lost';
      if (recentTab === 'found') return item.type === 'found';
      return true;
    })
    .slice(0, 6);

  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200 pt-12 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Tagline / Subtitle */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Campus Belonging Recovery Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none text-balance">
              Lost something on campus? <br className="hidden sm:inline" />
              <span className="text-blue-600">Let AI find it for you.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Lost & Found AI helps college students report lost or found items across campus,
              leveraging intelligent text similarity to instantly suggest potential matches.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onOpenReportModal('lost')}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Lost Item</span>
              </button>

              <button
                onClick={() => onOpenReportModal('found')}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm rounded-xl transition-all shadow-xs hover:border-slate-400 active:scale-98 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Report Found Item</span>
              </button>

              <button
                onClick={() => onNavigate('ai-matches')}
                className="w-full sm:w-auto px-5 py-3 text-blue-700 hover:bg-blue-50/80 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>View AI Matches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Search Bar */}
            <div className="pt-4 max-w-xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search by item name, brand, or building (e.g. 'AirPods', 'Library', 'Hydro Flask')..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-24 py-3 bg-white text-slate-900 border border-slate-300 rounded-xl shadow-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-500">
                <span className="font-medium text-slate-400">Popular:</span>
                {['AirPods', 'Student ID', 'Hydro Flask', 'Backpack', 'Keys'].map((itemTag) => (
                  <button
                    key={itemTag}
                    onClick={() => {
                      onSearchQuery(itemTag);
                      onNavigate('browse');
                    }}
                    className="hover:text-blue-600 hover:underline transition-colors text-slate-600 font-medium"
                  >
                    {itemTag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Recovery Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 block tabular-nums">
                {items.length}
              </span>
              <span className="text-xs text-slate-500">Campus Reports Filed</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 block tabular-nums">
                {lostCount}
              </span>
              <span className="text-xs text-slate-500">Active Lost Inquiries</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 block tabular-nums">
                {foundCount}
              </span>
              <span className="text-xs text-slate-500">Found Items Waiting</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 block tabular-nums">
                92%
              </span>
              <span className="text-xs text-slate-500">AI Match Correlation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Browse Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Explore by Category</h2>
            <button
              onClick={() => onNavigate('browse')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategoryFilter(cat);
                  onNavigate('browse');
                }}
                className="whitespace-nowrap px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-lg transition-colors shrink-0"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Reported Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Recently Reported on Campus
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live bulletin of belongings reported by students, faculty, and campus desks.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setRecentTab('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                recentTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setRecentTab('lost')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                recentTab === 'lost'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost ({lostCount})
            </button>
            <button
              onClick={() => setRecentTab('found')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                recentTab === 'found'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found ({foundCount})
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecents.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onCheckMatches={() => {
                onSelectItem(item);
              }}
            />
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            <span>Browse Complete Campus Registry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* How AI Matching Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Smart Correlation Engine</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              How Lost & Found AI connects the dots
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              When students report an item, our algorithm cross-references text descriptions,
              brand identifiers, campus coordinates, and date timestamps to uncover high-probability
              matches between lost belongings and found reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Report with Details</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add an item description, category, campus hall or room, photo, and approximate time window.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Instant AI Correlation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our similarity model scores title overlap, location proximity, and category congruence to suggest candidates.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Safe Campus Relay</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect via private student relay and meet safely at designated desks like the Library or Union.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
