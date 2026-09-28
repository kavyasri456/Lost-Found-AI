import React, { useState, useRef } from 'react';
import { 
  Upload, 
  MapPin, 
  Calendar, 
  Tag, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Item, ItemCategory, CampusLocation, ItemType, MatchResult } from '../types';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../data/sampleData';
import { findMatchesForItem } from '../utils/aiMatching';

interface ReportItemPageProps {
  initialType?: ItemType;
  allItems: Item[];
  onItemCreated: (newItem: Item) => void;
  onNavigateToMatches: (item: Item) => void;
  onNavigateToBrowse: () => void;
}

export const ReportItemPage: React.FC<ReportItemPageProps> = ({
  initialType = 'lost',
  allItems,
  onItemCreated,
  onNavigateToMatches,
  onNavigateToBrowse,
}) => {
  const [itemType, setItemType] = useState<ItemType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [location, setLocation] = useState<CampusLocation>('Main Library');
  const [locationDetail, setLocationDetail] = useState('');
  const [turnInLocation, setTurnInLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  
  // Contact info
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'safe_relay'>('safe_relay');

  // Photo upload handling
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission & Validation States
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<Item | null>(null);
  const [detectedMatches, setDetectedMatches] = useState<MatchResult[]>([]);

  // Sample preset images for quick student testing
  const samplePhotoPresets: { label: string; url: string }[] = [
    { label: 'AirPods / Case', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80' },
    { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80' },
    { label: 'Keys & Lanyard', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80' },
    { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
    { label: 'Student ID', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80' },
    { label: 'Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be smaller than 5MB.');
      return;
    }

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!title.trim()) {
      errors.title = 'Item title is required';
    } else if (title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (!description.trim()) {
      errors.description = 'Please provide an item description to help AI matching';
    } else if (description.trim().length < 10) {
      errors.description = 'Description should be at least 10 characters';
    }

    if (!date) {
      errors.date = 'Date is required';
    }

    if (!contactName.trim()) {
      errors.contactName = 'Your name is required';
    }

    if (!contactEmail.trim()) {
      errors.contactEmail = 'Campus email is required';
    } else if (!contactEmail.includes('@')) {
      errors.contactEmail = 'Enter a valid email address';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const newItem: Item = {
      id: `item-${Date.now()}`,
      type: itemType,
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      locationDetail: locationDetail.trim() || undefined,
      turnInLocation: itemType === 'found' ? (turnInLocation.trim() || undefined) : undefined,
      date,
      imageUrl: photoPreview || undefined,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim() || undefined,
      preferredContact,
      reward: itemType === 'lost' && reward.trim() ? reward.trim() : undefined,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    // Calculate matches immediately
    const matches = findMatchesForItem(newItem, allItems, 35);

    setTimeout(() => {
      onItemCreated(newItem);
      setSubmittedItem(newItem);
      setDetectedMatches(matches);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // If successfully submitted, show the confirmation screen with immediate AI suggestions!
  if (submittedItem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-300">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
              Report Successfully Filed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              "{submittedItem.title}" is now published
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your {submittedItem.type === 'lost' ? 'lost item inquiry' : 'found item report'} has been saved
              to the campus bulletin and indexed by the AI matching system.
            </p>
          </div>

          {/* AI Immediate Matches Notification */}
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl text-left space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-950">
                  AI Matching Engine Scan Results
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                {detectedMatches.length} {detectedMatches.length === 1 ? 'Match Found' : 'Matches Found'}
              </span>
            </div>

            {detectedMatches.length > 0 ? (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-blue-900">
                  We identified {detectedMatches.length} existing {submittedItem.type === 'lost' ? 'found' : 'lost'} item(s) on campus that closely resemble your report!
                </p>
                <div className="space-y-2">
                  {detectedMatches.slice(0, 2).map((m) => (
                    <div
                      key={m.matchedItem.id}
                      className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{m.matchedItem.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {m.matchedItem.location} · {m.matchedItem.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-700">{m.overallScore}% Match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-blue-900 leading-relaxed">
                No immediate high-probability matches exist in the current campus database right now.
                As new reports are filed by students or campus desks, the system will highlight matches.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-200">
            {detectedMatches.length > 0 && (
              <button
                onClick={() => onNavigateToMatches(submittedItem)}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>View Full AI Match Analysis</span>
              </button>
            )}
            <button
              onClick={onNavigateToBrowse}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
            >
              Browse Campus Directory
            </button>
            <button
              onClick={() => {
                setSubmittedItem(null);
                setTitle('');
                setDescription('');
                setPhotoPreview('');
                setPhotoFileName('');
                setReward('');
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              File Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          File a Campus Item Report
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide accurate item details to help our AI matching engine cross-reference lost and found belongings.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Step 1: Type Selection (Lost vs Found) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Report Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setItemType('lost')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                itemType === 'lost'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                  itemType === 'lost' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}
              >
                {itemType === 'lost' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">I Lost Something</span>
                <span className="text-xs text-slate-500">I misplaced an item and want help locating it</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setItemType('found')}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                itemType === 'found'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                  itemType === 'found' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                }`}
              >
                {itemType === 'found' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">I Found Something</span>
                <span className="text-xs text-slate-500">I discovered an item and want to return it</span>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Item Details */}
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Item Information
          </label>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Item Name / Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Apple AirPods Pro 2nd Gen in Sky Blue Case"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                validationErrors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {validationErrors.title && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{validationErrors.title}</span>
              </p>
            )}
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Campus Location *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as CampusLocation)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific Location detail & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Exact Spot / Room Detail (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 2nd Floor Quiet Study desk #14, near water cooler"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Date {itemType === 'lost' ? 'Lost' : 'Found'} *
              </label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              {validationErrors.date && (
                <p className="text-xs text-rose-600 mt-1">{validationErrors.date}</p>
              )}
            </div>
          </div>

          {itemType === 'found' && (
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Turned In / Custody Location (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Main Library Front Desk, or Keeping with me in dorm 204"
                value={turnInLocation}
                onChange={(e) => setTurnInLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          {itemType === 'lost' && (
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Optional Reward (e.g. "$25 Starbucks Gift Card")
              </label>
              <input
                type="text"
                placeholder="Offering a courtesy reward helps encourage fast returns"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-800">
                Detailed Description *
              </label>
              <span className="text-[11px] text-blue-600 font-medium">
                Include color, brand, stickers, scratches, case style
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Describe distinguishing features: colors, brand, serial fragments, stickers, contents, or damage. The AI engine uses these descriptors for accurate matching."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none ${
                validationErrors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {validationErrors.description && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{validationErrors.description}</span>
              </p>
            )}
          </div>

          {/* Photo Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Item Photo (Upload or Select Preset)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Drop / upload box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 flex flex-col items-center justify-center gap-2 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-blue-600">Click to upload photo</span> or drag & drop
                </div>
                <span className="text-[11px] text-slate-400">PNG, JPG, or WEBP up to 5MB</span>
              </div>

              {/* Photo Preview / Sample selector */}
              <div className="border border-slate-200 rounded-xl p-3 bg-white flex flex-col justify-between">
                {photoPreview ? (
                  <div className="relative rounded-lg overflow-hidden h-32 bg-slate-100 border border-slate-200">
                    <img
                      src={photoPreview}
                      alt="Uploaded item preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview('');
                        setPhotoFileName('');
                      }}
                      className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] rounded-md backdrop-blur-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-600 block">
                      Or pick a sample photo for demo:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {samplePhotoPresets.map((preset) => (
                        <button
                          type="button"
                          key={preset.label}
                          onClick={() => setPhotoPreview(preset.url)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-md border border-slate-200 truncate transition-colors text-center"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      If left empty, a clean category icon illustration will be generated automatically.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Contact & Privacy */}
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Reporter Contact Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Jordan Smith"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                  validationErrors.contactName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {validationErrors.contactName && (
                <p className="text-xs text-rose-600 mt-1">{validationErrors.contactName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Campus Email Address *
              </label>
              <input
                type="email"
                placeholder="j.smith@campus.edu"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                  validationErrors.contactEmail ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {validationErrors.contactEmail && (
                <p className="text-xs text-rose-600 mt-1">{validationErrors.contactEmail}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Preferred Contact Channel
              </label>
              <select
                value={preferredContact}
                onChange={(e) => setPreferredContact(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="safe_relay">Safe Relay (Shields email/phone until confirmed)</option>
                <option value="email">Direct Campus Email</option>
                <option value="phone">Direct Phone / Text</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Reports are publicly visible on campus to help reclaim items.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Publishing & Scanning...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Submit & Run AI Match Scan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
