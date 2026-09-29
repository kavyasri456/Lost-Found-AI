import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Tag, 
  ArrowRight, 
  Info, 
  ShieldAlert, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  Split,
  Eye,
  MessageSquare,
  Download,
  Copy,
  Check,
  Database,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import { Item, MatchResult } from '../types';
import { compareItems, findMatchesForItem, findGlobalCampusMatches } from '../utils/aiMatching';
import { ItemImage } from '../components/ItemImage';

interface AIMatchingPageProps {
  items: Item[];
  selectedItemForMatch: Item | null;
  onSelectItemForMatch: (item: Item | null) => void;
  onViewItemDetails: (item: Item) => void;
  onOpenSafeContact: (item: Item) => void;
}

export const AIMatchingPage: React.FC<AIMatchingPageProps> = ({
  items,
  selectedItemForMatch,
  onSelectItemForMatch,
  onViewItemDetails,
  onOpenSafeContact,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inspect' | 'global' | 'simulator' | 'dataset'>(
    selectedItemForMatch ? 'inspect' : 'global'
  );
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // For Simulator
  const [simTitle, setSimTitle] = useState('Apple AirPods with blue case');
  const [simCategory, setSimCategory] = useState<Item['category']>('Electronics');
  const [simLocation, setSimLocation] = useState<Item['location']>('Main Library');
  const [simDescription, setSimDescription] = useState('Lost silicone case with silver clip near 2nd floor window');
  const [simType, setSimType] = useState<'lost' | 'found'>('lost');

  // Currently focused item for detailed inspection
  const currentInspectItem = selectedItemForMatch || items[0] || null;

  // Matches for the inspect item
  const inspectMatches = useMemo(() => {
    if (!currentInspectItem) return [];
    return findMatchesForItem(currentInspectItem, items, 25);
  }, [currentInspectItem, items]);

  // Global pairs across the whole campus
  const globalPairs = useMemo(() => {
    return findGlobalCampusMatches(items, 45);
  }, [items]);

  // Simulator matches
  const simMatches = useMemo(() => {
    if (!simTitle.trim() && !simDescription.trim()) return [];
    const mockItem: Item = {
      id: 'sim-query',
      type: simType,
      title: simTitle,
      description: simDescription,
      category: simCategory,
      location: simLocation,
      date: new Date().toISOString().split('T')[0],
      contactName: 'Simulator',
      contactEmail: 'sim@campus.edu',
      preferredContact: 'safe_relay',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    return findMatchesForItem(mockItem, items, 25);
  }, [simTitle, simDescription, simCategory, simLocation, simType, items]);

  // Modal for side-by-side comparison
  const [comparisonPair, setComparisonPair] = useState<MatchResult | null>(null);

  const handleCopy = (text: string, type: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus AI Match Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Intelligent Item Matching
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Our algorithm analyzes keywords, semantic descriptions, campus landmarks, and timeframes
            to surface potential connections between lost belongings and found reports.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setActiveSubTab('global')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'global'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Campus Pairs ({globalPairs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('inspect')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'inspect'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inspect an Item
          </button>
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'simulator'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => setActiveSubTab('dataset')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'dataset'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Agent Training Data</span>
          </button>
        </div>
      </div>

      {/* Transparent Disclaimer Banner */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">AI Suggestions Notice:</span>
          <p className="text-blue-800 leading-relaxed">
            Match percentages and explanations are algorithmic suggestions computed using text token similarity,
            campus building correlation, and date windows. They are not absolute confirmations. Always verify physical
            ownership identifiers (passcodes, interior markings, serial numbers) safely before property exchange.
          </p>
        </div>
      </div>

      {/* VIEW 1: GLOBAL CAMPUS PAIRS */}
      {activeSubTab === 'global' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Top Potential Campus Matches ({globalPairs.length})
              </h2>
              <p className="text-xs text-slate-500">
                High-confidence correlations discovered between active Lost and Found reports.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {globalPairs.map((match, idx) => (
              <div
                key={`${match.sourceItem.id}-${match.matchedItem.id}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-all shadow-xs flex flex-col lg:flex-row items-stretch justify-between gap-6"
              >
                {/* Left: Lost Item */}
                <div className="flex-1 flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <ItemImage
                      src={match.sourceItem.imageUrl}
                      alt={match.sourceItem.title}
                      category={match.sourceItem.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>LOST ITEM</span>
                      <span className="text-slate-400 font-normal">· {match.sourceItem.date}</span>
                    </div>
                    <h3 
                      onClick={() => onViewItemDetails(match.sourceItem)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {match.sourceItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{match.sourceItem.description}</p>
                    <div className="text-[11px] text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{match.sourceItem.location}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Match Badge & Score Breakdown */}
                <div className="flex flex-col items-center justify-center px-4 py-2 bg-slate-50 rounded-xl border border-slate-200/80 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-2xl font-black text-blue-700 tabular-nums">
                      {match.overallScore}%
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {match.confidence} Match Likelihood
                  </span>
                  <div className="w-full mt-2.5 pt-2 border-t border-slate-200 text-[10px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-semibold text-slate-800">{match.breakdown.category}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-semibold text-slate-800">{match.breakdown.location}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Text Similarity:</span>
                      <span className="font-semibold text-slate-800">{match.breakdown.keywords}%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Found Item */}
                <div className="flex-1 flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <ItemImage
                      src={match.matchedItem.imageUrl}
                      alt={match.matchedItem.title}
                      category={match.matchedItem.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>FOUND REPORT</span>
                      <span className="text-slate-400 font-normal">· {match.matchedItem.date}</span>
                    </div>
                    <h3
                      onClick={() => onViewItemDetails(match.matchedItem)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {match.matchedItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{match.matchedItem.description}</p>
                    <div className="text-[11px] text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{match.matchedItem.location}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col justify-end gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4 shrink-0">
                  <button
                    onClick={() => setComparisonPair(match)}
                    className="flex-1 lg:flex-initial px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Split className="w-3.5 h-3.5" />
                    <span>Compare</span>
                  </button>
                  <button
                    onClick={() => onOpenSafeContact(match.matchedItem)}
                    className="flex-1 lg:flex-initial px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: INSPECT A SPECIFIC ITEM */}
      {activeSubTab === 'inspect' && (
        <div className="space-y-6">
          {/* Item Selector Dropdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select an item to run AI matching against all campus reports:
              </label>
              <select
                value={currentInspectItem?.id || ''}
                onChange={(e) => {
                  const found = items.find(i => i.id === e.target.value);
                  if (found) onSelectItemForMatch(found);
                }}
                className="w-full sm:w-96 px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {items.map((it) => (
                  <option key={it.id} value={it.id}>
                    [{it.type.toUpperCase()}] {it.title} ({it.location})
                  </option>
                ))}
              </select>
            </div>

            {currentInspectItem && (
              <button
                onClick={() => onViewItemDetails(currentInspectItem)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Item Card</span>
              </button>
            )}
          </div>

          {currentInspectItem && (
            <div className="space-y-6">
              {/* Selected Item Summary Card */}
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                  <ItemImage
                    src={currentInspectItem.imageUrl}
                    alt={currentInspectItem.title}
                    category={currentInspectItem.category}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className={currentInspectItem.type === 'lost' ? 'text-rose-700' : 'text-emerald-700'}>
                      {currentInspectItem.type.toUpperCase()}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500">{currentInspectItem.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500">{currentInspectItem.location}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{currentInspectItem.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{currentInspectItem.description}</p>
                </div>
              </div>

              {/* Match Results */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Ranked Matches ({inspectMatches.length})
                  </h3>
                  <span className="text-xs text-slate-500">
                    Scanning {items.filter(i => i.type !== currentInspectItem.type).length} opposite items
                  </span>
                </div>

                {inspectMatches.length > 0 ? (
                  <div className="space-y-4">
                    {inspectMatches.map((res) => (
                      <div
                        key={res.matchedItem.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                            <ItemImage
                              src={res.matchedItem.imageUrl}
                              alt={res.matchedItem.title}
                              category={res.matchedItem.category}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-semibold">
                              <span className="text-emerald-700">FOUND</span>
                              <span aria-hidden="true">·</span>
                              <span className="text-slate-500">{res.matchedItem.date}</span>
                              <span aria-hidden="true">·</span>
                              <span className="text-blue-700">{res.matchedItem.location}</span>
                            </div>
                            <h4
                              onClick={() => onViewItemDetails(res.matchedItem)}
                              className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                            >
                              {res.matchedItem.title}
                            </h4>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {res.matchedItem.description}
                            </p>

                            {/* Transparent Match Reason */}
                            <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                              <span className="font-semibold text-blue-900">Why this matched: </span>
                              <span>{res.explanation}</span>
                            </div>
                          </div>
                        </div>

                        {/* Match score & button */}
                        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                          <div className="text-right">
                            <div className="text-2xl font-black text-blue-700 tabular-nums">
                              {res.overallScore}%
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold uppercase">
                              Similarity
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setComparisonPair(res)}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              Compare
                            </button>
                            <button
                              onClick={() => onOpenSafeContact(res.matchedItem)}
                              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    No relevant matching reports registered in the system yet. Try picking another item or testing with the live simulator.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: LIVE SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Interactive AI Match Simulator
              </h2>
              <p className="text-xs text-slate-500">
                Type an item description below to test how the algorithm extracts tokens, compares category,
                evaluates location coordinates, and ranks potential campus matches in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={simType}
                  onChange={(e) => setSimType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="lost">Lost Item Query</option>
                  <option value="found">Found Item Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Title</label>
                <input
                  type="text"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={simCategory}
                  onChange={(e) => setSimCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Water Bottles">Water Bottles</option>
                  <option value="Keys & Access">Keys & Access</option>
                  <option value="Bags & Backpacks">Bags & Backpacks</option>
                  <option value="Campus IDs & Cards">Campus IDs & Cards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <select
                  value={simLocation}
                  onChange={(e) => setSimLocation(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="Main Library">Main Library</option>
                  <option value="Campus Rec & Gym">Campus Rec & Gym</option>
                  <option value="Student Union">Student Union</option>
                  <option value="Engineering Hall">Engineering Hall</option>
                  <option value="North Dining Commons">North Dining Commons</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={simDescription}
                onChange={(e) => setSimDescription(e.target.value)}
                placeholder="e.g. blue silicone sleeve, yosemite stickers, patagonia grey canvas"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Simulator Live Ranked Output */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Live AI Match Results ({simMatches.length})
            </h3>

            {simMatches.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {simMatches.map((m) => (
                  <div
                    key={m.matchedItem.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <ItemImage
                          src={m.matchedItem.imageUrl}
                          alt={m.matchedItem.title}
                          category={m.matchedItem.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-800">{m.matchedItem.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{m.matchedItem.location}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{m.matchedItem.title}</h4>
                        <div className="text-[11px] text-blue-700 mt-0.5">{m.explanation}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-blue-700 tabular-nums">
                        {m.overallScore}%
                      </span>
                      <button
                        onClick={() => onViewItemDetails(m.matchedItem)}
                        className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                Type more keywords above to simulate matching.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: AGENT TRAINING DATA & EXPORT */}
      {activeSubTab === 'dataset' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  AI Agent Fine-Tuning & Evaluation Dataset
                </h2>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Pre-formatted conversational transcripts, domain entity ontology, scoring weights,
                and paired item matches curated from this application. Ready for fine-tuning OpenAI, Gemini, LLaMA, or Mistral models.
              </p>
            </div>

            {/* Direct Download Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <a
                href="/training_dataset.json"
                download="lost_and_found_ai_training.json"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download .JSON</span>
              </a>
              <a
                href="/training_dataset.jsonl"
                download="lost_and_found_ai_training.jsonl"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download .JSONL</span>
              </a>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
              <span className="text-xl font-black text-blue-600 block">ChatML & Alpaca</span>
              <span className="text-[11px] text-slate-500 font-medium">Instruction Formats</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
              <span className="text-xl font-black text-slate-900 block">{items.length}</span>
              <span className="text-[11px] text-slate-500 font-medium">Curated Items Seeded</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
              <span className="text-xl font-black text-emerald-600 block">{globalPairs.length}</span>
              <span className="text-[11px] text-slate-500 font-medium">High Match Pairs</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
              <span className="text-xl font-black text-indigo-600 block">4 Feature Weights</span>
              <span className="text-[11px] text-slate-500 font-medium">Scoring Algorithm</span>
            </div>
          </div>

          {/* JSON Preview Sections */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    training_dataset.jsonl (OpenAI / ChatML Standard)
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(
                        [
                          {
                            messages: [
                              {
                                role: 'system',
                                content:
                                  'You are Lost & Found AI, an intelligent campus belongings recovery agent.',
                              },
                              {
                                role: 'user',
                                content:
                                  'I lost my AirPods Pro on the second floor of the campus library in a sky blue case.',
                              },
                              {
                                role: 'assistant',
                                content:
                                  'I identified a high-confidence match (92%): AirPods Pro Earbuds in Light Blue Cover found in Main Library 2nd floor, turned into 1st Floor Security.',
                              },
                            ],
                          },
                        ],
                        null,
                        2
                      ),
                      'chatml'
                    )
                  }
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors flex items-center gap-1.5"
                >
                  {copiedType === 'chatml' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-xl overflow-x-auto leading-relaxed max-h-72">
{`{"messages": [{"role": "system", "content": "You are Lost & Found AI, an intelligent campus belongings recovery agent."}, {"role": "user", "content": "I lost my AirPods Pro on the second floor of the campus library in a sky blue silicone case."}, {"role": "assistant", "content": "I found a potential 92% match: 'AirPods Pro Earbuds in Light Blue Rubber Cover' turned in at Main Library Circulation Desk."}]}
{"messages": [{"role": "system", "content": "You are Lost & Found AI, an intelligent campus belongings recovery agent."}, {"role": "user", "content": "Extract structured item parameters from: 'Left black TI-84 calculator with bee sticker in Engineering Hall 302.'"}, {"role": "assistant", "content": "{\\"type\\": \\"lost\\", \\"title\\": \\"TI-84 Graphing Calculator\\", \\"category\\": \\"Electronics\\", \\"location\\": \\"Engineering Hall\\", \\"location_detail\\": \\"Room 302\\"}"}]}
{"messages": [{"role": "system", "content": "You are Lost & Found AI, an intelligent campus belongings recovery agent."}, {"role": "user", "content": "Someone found my backpack. How do I safely verify ownership without disclosing private passcodes?"}, {"role": "assistant", "content": "Meet at an official desk (Main Library or Student Union Welcome Counter) and describe physical non-public clues (specific keychain, notebook titles, scuffs)."}]}`}
              </pre>
            </div>

            {/* Feature Weighting Matrix */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Ground-Truth Feature Scoring Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-blue-700 block">40% Keyword / NLP</span>
                  <span className="text-slate-600 mt-1 block">
                    Jaccard token coefficient + weighted key brand/descriptor matches.
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-blue-700 block">25% Category</span>
                  <span className="text-slate-600 mt-1 block">
                    Exact category match = 100%, related = 40%, unrelated = 10%.
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-blue-700 block">20% Campus Hub</span>
                  <span className="text-slate-600 mt-1 block">
                    Identical building = 100%, adjacent zone = 65%, other = 20%.
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-blue-700 block">15% Timeline</span>
                  <span className="text-slate-600 mt-1 block">
                    0-day = 100%, 1-day = 90%, 2-3 days = 75%, 4-7 days = 55%.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Dialog */}
      {comparisonPair && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Split className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Side-by-Side Match Analysis</h3>
              </div>
              <button
                onClick={() => setComparisonPair(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Score header */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center space-y-1">
                <div className="text-3xl font-black text-blue-700 tabular-nums">
                  {comparisonPair.overallScore}% AI Match
                </div>
                <p className="text-xs text-blue-800">{comparisonPair.explanation}</p>
              </div>

              {/* Side by side columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Source */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-rose-700 uppercase">
                    Lost Report
                  </div>
                  <div className="rounded-lg overflow-hidden h-36 border border-slate-200 bg-white">
                    <ItemImage
                      src={comparisonPair.sourceItem.imageUrl}
                      alt={comparisonPair.sourceItem.title}
                      category={comparisonPair.sourceItem.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{comparisonPair.sourceItem.title}</h4>
                  <p className="text-xs text-slate-600">{comparisonPair.sourceItem.description}</p>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 space-y-1">
                    <div><strong>Location:</strong> {comparisonPair.sourceItem.location}</div>
                    <div><strong>Date:</strong> {comparisonPair.sourceItem.date}</div>
                  </div>
                </div>

                {/* Target */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-emerald-700 uppercase">
                    Found Report
                  </div>
                  <div className="rounded-lg overflow-hidden h-36 border border-slate-200 bg-white">
                    <ItemImage
                      src={comparisonPair.matchedItem.imageUrl}
                      alt={comparisonPair.matchedItem.title}
                      category={comparisonPair.matchedItem.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{comparisonPair.matchedItem.title}</h4>
                  <p className="text-xs text-slate-600">{comparisonPair.matchedItem.description}</p>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 space-y-1">
                    <div><strong>Location:</strong> {comparisonPair.matchedItem.location}</div>
                    <div><strong>Date:</strong> {comparisonPair.matchedItem.date}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  onClick={() => setComparisonPair(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    const target = comparisonPair.matchedItem;
                    setComparisonPair(null);
                    onOpenSafeContact(target);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Contact Finder Safely
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
