import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Sparkles, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Share2,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Item, MatchResult } from '../types';
import { ItemImage } from './ItemImage';
import { findMatchesForItem } from '../utils/aiMatching';

interface ItemDetailsModalProps {
  item: Item | null;
  allItems: Item[];
  onClose: () => void;
  onOpenContact: (item: Item) => void;
  onViewMatchItem: (matchedItem: Item) => void;
  onToggleStatus?: (item: Item) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  allItems,
  onClose,
  onOpenContact,
  onViewMatchItem,
  onToggleStatus,
}) => {
  if (!item) return null;

  const isLost = item.type === 'lost';
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate direct AI suggestions for this item
  const suggestedMatches = findMatchesForItem(item, allItems, 35).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link to this item copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${
                isLost ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLost ? 'bg-rose-600 animate-pulse' : 'bg-emerald-600'}`} />
              {isLost ? 'LOST REPORT' : 'FOUND REPORT'}
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Ref: {item.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              title="Share report"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Media & Headline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
              <ItemImage
                src={item.imageUrl}
                alt={item.title}
                category={item.category}
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500 font-normal">{formattedDate}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {item.title}
                </h2>
              </div>

              {/* Reward Callout */}
              {item.reward && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-900 font-medium">
                  <span className="font-bold bg-amber-500 text-white px-2 py-0.5 rounded text-[11px]">REWARD OFFERED</span>
                  <span>{item.reward} for safe return</span>
                </div>
              )}

              {/* Location details */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">{item.location}</span>
                    {item.locationDetail && (
                      <span className="text-slate-600 block mt-0.5">{item.locationDetail}</span>
                    )}
                  </div>
                </div>

                {item.turnInLocation && (
                  <div className="flex items-start gap-2 pt-2 border-t border-slate-200/80 text-emerald-800">
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Current Holding Station:</span>
                      <span className="text-emerald-700 block mt-0.5">{item.turnInLocation}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Call to Action */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenContact(item)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Connect with Reporter (Safe Relay)</span>
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Campus email verification required · No spam</span>
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2 border-t border-slate-200 pt-5">
            <h4 className="text-sm font-bold text-slate-900">Item Description & Identifiers</h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
              {item.description}
            </p>
          </div>

          {/* Reporter & Verification Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-5 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Reported by</span>
                <span className="font-bold text-slate-900">{item.contactName}</span>
                <span className="text-slate-500 block text-[11px] font-mono">{item.contactEmail}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-900 block text-xs">Safe Handoff Protocol</span>
                <span className="text-[11px] text-blue-800 leading-snug">
                  Arrange return at high-traffic campus zones such as the Student Union Information Desk or Campus Police Substation.
                </span>
              </div>
            </div>
          </div>

          {/* AI Matches Section for this item */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    AI Matching Suggestions ({suggestedMatches.length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Cross-referenced opposite {isLost ? 'found' : 'lost'} records based on text semantics and campus coordinates.
                  </p>
                </div>
              </div>
            </div>

            {suggestedMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {suggestedMatches.map((match) => (
                  <div
                    key={match.matchedItem.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-600">
                          {match.matchedItem.type === 'found' ? 'Found Item' : 'Lost Item'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                          {match.overallScore}% Match
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {match.matchedItem.title}
                      </h5>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {match.matchedItem.description}
                      </p>
                      <div className="mt-2 text-[10px] text-blue-800 bg-white p-2 rounded border border-blue-100">
                        <span className="font-semibold">Match reason: </span>
                        {match.explanation}
                      </div>
                    </div>

                    <button
                      onClick={() => onViewMatchItem(match.matchedItem)}
                      className="mt-3 w-full py-1.5 px-3 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Compare This Item</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No automatic matches currently registered for this item above threshold. As new reports are filed, the AI matching engine will continually correlate records.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Status: <span className="font-semibold text-slate-800 capitalize">{item.status}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
