import { Item, MatchResult, MatchScoreBreakdown } from '../types';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
  'but', 'by', 'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does',
  'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s',
  'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its',
  'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so',
  'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s',
  'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve',
  'your', 'yours', 'yourself', 'yourselves', 'lost', 'found', 'please', 'someone', 'left', 'turned'
]);

// Normalizes and extracts meaningful tokens
export function extractKeywords(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ');

  const tokens = normalized.split(' ');
  const keywords: string[] = [];

  for (const token of tokens) {
    const trimmed = token.trim();
    if (trimmed.length > 2 && !STOP_WORDS.has(trimmed)) {
      keywords.push(trimmed);
    }
  }

  return Array.from(new Set(keywords));
}

// Calculates days between two date strings (YYYY-MM-DD)
function calculateDateDifferenceDays(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  if (isNaN(d1) || isNaN(d2)) return 5;
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Compare two items and calculate match metrics
export function compareItems(source: Item, target: Item): MatchResult {
  // 1. Category similarity (25%)
  let categoryScore = 0;
  if (source.category === target.category) {
    categoryScore = 100;
  } else if (
    (source.category === 'Electronics' && target.category === 'Other') ||
    (source.category === 'Bags & Backpacks' && target.category === 'Clothing & Accessories')
  ) {
    categoryScore = 40;
  } else {
    categoryScore = 10;
  }

  // 2. Location proximity (20%)
  let locationScore = 0;
  if (source.location === target.location) {
    locationScore = 100;
  } else if (
    (source.location.includes('Dining') && target.location.includes('Dining')) ||
    (source.location.includes('Residence') && target.location.includes('Residence'))
  ) {
    locationScore = 65;
  } else {
    locationScore = 20;
  }

  // 3. Time proximity (15%)
  const daysDiff = calculateDateDifferenceDays(source.date, target.date);
  let timeScore = 0;
  if (daysDiff === 0) timeScore = 100;
  else if (daysDiff <= 1) timeScore = 90;
  else if (daysDiff <= 3) timeScore = 75;
  else if (daysDiff <= 7) timeScore = 55;
  else if (daysDiff <= 14) timeScore = 35;
  else timeScore = 15;

  // 4. Content / Keyword similarity (40%)
  const sourceText = `${source.title} ${source.description} ${source.locationDetail || ''}`;
  const targetText = `${target.title} ${target.description} ${target.locationDetail || ''}`;

  const sourceKeywords = extractKeywords(sourceText);
  const targetKeywords = extractKeywords(targetText);

  const matchedKeywords: string[] = [];
  for (const kw of sourceKeywords) {
    if (targetKeywords.some(t => t === kw || (kw.length > 4 && t.includes(kw)) || (t.length > 4 && kw.includes(t)))) {
      matchedKeywords.push(kw);
    }
  }

  const unionSize = new Set([...sourceKeywords, ...targetKeywords]).size || 1;
  const jaccard = matchedKeywords.length / unionSize;

  // Keyword score boosted if high-value terms match
  let contentScore = Math.min(100, Math.round(jaccard * 220 + matchedKeywords.length * 12));
  if (matchedKeywords.length === 0) {
    contentScore = Math.min(contentScore, 15);
  }

  const breakdown: MatchScoreBreakdown = {
    category: categoryScore,
    location: locationScore,
    time: timeScore,
    keywords: contentScore,
  };

  // Weighted overall calculation
  let rawScore = (categoryScore * 0.25) + (locationScore * 0.20) + (timeScore * 0.15) + (contentScore * 0.40);
  
  // Cap between 10% and 97% to reflect heuristic AI-assisted suggestions
  let overallScore = Math.min(97, Math.max(10, Math.round(rawScore)));

  // Determine confidence tier
  let confidence: 'High' | 'Medium' | 'Low' = 'Low';
  if (overallScore >= 70) confidence = 'High';
  else if (overallScore >= 45) confidence = 'Medium';

  // Construct natural, transparent explanation
  const reasons: string[] = [];

  if (categoryScore === 100) {
    reasons.push(`Exact category alignment (${source.category})`);
  }
  if (locationScore === 100) {
    reasons.push(`Reported at the exact same campus hub (${source.location})`);
  } else if (locationScore >= 60) {
    reasons.push(`Nearby campus sector`);
  }

  if (daysDiff === 0) {
    reasons.push(`Reported on the same calendar day (${source.date})`);
  } else if (daysDiff <= 2) {
    reasons.push(`Timeline overlap within ${daysDiff} day${daysDiff > 1 ? 's' : ''}`);
  }

  if (matchedKeywords.length > 0) {
    const previewKeywords = matchedKeywords.slice(0, 4).map(k => `"${k}"`).join(', ');
    reasons.push(`Shared descriptors: ${previewKeywords}`);
  } else {
    reasons.push('Low direct keyword overlap');
  }

  const explanation = reasons.join(' · ');

  return {
    sourceItem: source,
    matchedItem: target,
    overallScore,
    breakdown,
    matchedKeywords,
    explanation,
    confidence,
  };
}

// Finds the best matching candidates across the database for a given item
export function findMatchesForItem(targetItem: Item, allItems: Item[], minScore: number = 30): MatchResult[] {
  // Prefer items of opposite type (Lost matches against Found, Found matches against Lost)
  const candidatePool = allItems.filter(item => item.id !== targetItem.id);

  const results: MatchResult[] = candidatePool
    .filter(item => item.type !== targetItem.type) // Opposite status is prime match
    .map(candidate => compareItems(targetItem, candidate))
    .filter(res => res.overallScore >= minScore)
    .sort((a, b) => b.overallScore - a.overallScore);

  return results;
}

// Global scan across all items to surface top overall potential pairs on campus
export function findGlobalCampusMatches(allItems: Item[], minScore: number = 50): MatchResult[] {
  const lostItems = allItems.filter(i => i.type === 'lost' && i.status === 'active');
  const foundItems = allItems.filter(i => i.type === 'found' && i.status === 'active');

  const matches: MatchResult[] = [];
  const seenPairKeys = new Set<string>();

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const pairKey = [lost.id, found.id].sort().join(':::');
      if (!seenPairKeys.has(pairKey)) {
        seenPairKeys.add(pairKey);
        const match = compareItems(lost, found);
        if (match.overallScore >= minScore) {
          matches.push(match);
        }
      }
    }
  }

  return matches.sort((a, b) => b.overallScore - a.overallScore);
}
