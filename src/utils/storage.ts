import { Item } from '../types';
import { INITIAL_ITEMS } from '../data/sampleData';

const STORAGE_KEY = 'lost_found_ai_campus_items_v1';

export function getStoredItems(): Item[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    return parsed;
  } catch (err) {
    console.warn('Failed reading from localStorage, using initial sample items', err);
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: Item[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed saving to localStorage', err);
  }
}

export function addStoredItem(newItem: Item): Item[] {
  const current = getStoredItems();
  const updated = [newItem, ...current];
  saveStoredItems(updated);
  return updated;
}

export function resetStoredItems(): Item[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
  } catch (err) {
    console.error('Failed resetting localStorage', err);
  }
  return INITIAL_ITEMS;
}
