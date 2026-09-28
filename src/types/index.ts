export type ItemType = 'lost' | 'found';

export type ItemCategory =
  | 'Electronics'
  | 'Campus IDs & Cards'
  | 'Keys & Access'
  | 'Bags & Backpacks'
  | 'Water Bottles'
  | 'Books & Study Supplies'
  | 'Clothing & Accessories'
  | 'Eyewear & Watches'
  | 'Jewelry'
  | 'Sports & Gym'
  | 'Other';

export type CampusLocation =
  | 'Main Library'
  | 'Student Union'
  | 'Science Quad'
  | 'Engineering Hall'
  | 'Campus Rec & Gym'
  | 'North Dining Commons'
  | 'South Dining Hall'
  | 'Arts & Humanities Center'
  | 'Residence Halls (East)'
  | 'Residence Halls (West)'
  | 'Campus Shuttle & Bus Stop'
  | 'University Bookstore'
  | 'Campus Green / Quad'
  | 'Other Campus Location';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: ItemCategory;
  location: CampusLocation;
  locationDetail?: string;
  date: string; // ISO date string YYYY-MM-DD
  imageUrl?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  preferredContact: 'email' | 'phone' | 'safe_relay';
  reward?: string;
  status: 'active' | 'resolved';
  createdAt: string;
  turnInLocation?: string; // e.g., "Left at Library Front Desk"
}

export interface MatchScoreBreakdown {
  category: number; // 0-100
  location: number; // 0-100
  time: number; // 0-100
  keywords: number; // 0-100
}

export interface MatchResult {
  sourceItem: Item;
  matchedItem: Item;
  overallScore: number; // 0-100
  breakdown: MatchScoreBreakdown;
  matchedKeywords: string[];
  explanation: string;
  confidence: 'High' | 'Medium' | 'Low';
}
