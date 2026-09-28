import React, { useState } from 'react';
import { 
  Laptop, 
  CreditCard, 
  Key, 
  Briefcase, 
  Droplet, 
  BookOpen, 
  Shirt, 
  Clock, 
  Sparkles, 
  Dumbbell, 
  Package 
} from 'lucide-react';
import { ItemCategory } from '../types';

interface ItemImageProps {
  src?: string;
  alt: string;
  category: ItemCategory;
  className?: string;
}

export const ItemImage: React.FC<ItemImageProps> = ({ src, alt, category, className = 'w-full h-48' }) => {
  const [hasError, setHasError] = useState(false);

  const getCategoryIcon = () => {
    switch (category) {
      case 'Electronics':
        return <Laptop className="w-8 h-8 text-blue-500" />;
      case 'Campus IDs & Cards':
        return <CreditCard className="w-8 h-8 text-indigo-500" />;
      case 'Keys & Access':
        return <Key className="w-8 h-8 text-amber-500" />;
      case 'Bags & Backpacks':
        return <Briefcase className="w-8 h-8 text-sky-500" />;
      case 'Water Bottles':
        return <Droplet className="w-8 h-8 text-teal-500" />;
      case 'Books & Study Supplies':
        return <BookOpen className="w-8 h-8 text-emerald-500" />;
      case 'Clothing & Accessories':
        return <Shirt className="w-8 h-8 text-purple-500" />;
      case 'Eyewear & Watches':
        return <Clock className="w-8 h-8 text-slate-500" />;
      case 'Jewelry':
        return <Sparkles className="w-8 h-8 text-yellow-500" />;
      case 'Sports & Gym':
        return <Dumbbell className="w-8 h-8 text-rose-500" />;
      default:
        return <Package className="w-8 h-8 text-slate-400" />;
    }
  };

  if (!src || hasError) {
    return (
      <div className={`${className} bg-slate-100 flex flex-col items-center justify-center border-b border-slate-200 relative overflow-hidden group`}>
        <div className="w-14 h-14 rounded-xl bg-white shadow-xs flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-105">
          {getCategoryIcon()}
        </div>
        <span className="text-xs font-medium text-slate-600 px-3 text-center truncate max-w-[90%]">
          {category}
        </span>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden bg-slate-100 border-b border-slate-200`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
        loading="lazy"
      />
    </div>
  );
};
