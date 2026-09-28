import React from 'react';
import { MapPin, Calendar, Sparkles, ArrowUpRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Item } from '../types';
import { ItemImage } from './ItemImage';

interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
  onCheckMatches: (item: Item) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onSelect,
  onCheckMatches,
}) => {
  const isLost = item.type === 'lost';

  // Format date cleanly e.g., "Sep 26, 2026"
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Photo with status indicator overlay */}
        <div className="relative">
          <ItemImage
            src={item.imageUrl}
            alt={item.title}
            category={item.category}
            className="w-full h-44 object-cover"
          />
          {/* Status Flag - Clean, high contrast banner tag */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-white/95 backdrop-blur-xs shadow-xs text-slate-800 border border-slate-200/80">
            {isLost ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-rose-700">LOST ITEM</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700">FOUND ITEM</span>
              </>
            )}
          </div>

          {item.reward && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500 text-white shadow-xs">
              {item.reward}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2.5">
          {/* Zero-Pill Metadata Header */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="text-blue-700 font-semibold">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(item)}
            className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 cursor-pointer transition-colors"
            title={item.title}
          >
            {item.title}
          </h3>

          {/* Location line */}
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800 truncate">{item.location}</span>
            {item.locationDetail && (
              <span className="text-slate-400 truncate">({item.locationDetail})</span>
            )}
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 pt-1 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onSelect(item)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onCheckMatches(item)}
          title="Find matching lost & found reports using AI similarity"
          className="py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Match</span>
        </button>
      </div>
    </div>
  );
};
