import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BrowseItemsPage } from './pages/BrowseItemsPage';
import { ReportItemPage } from './pages/ReportItemPage';
import { AIMatchingPage } from './pages/AIMatchingPage';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { SafeContactModal } from './components/SafeContactModal';
import { Item, ItemCategory, ItemType } from './types';
import { getStoredItems, addStoredItem, resetStoredItems } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'report' | 'ai-matches'>('home');
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<Item | null>(null);
  const [selectedItemForContact, setSelectedItemForContact] = useState<Item | null>(null);
  const [selectedItemForMatch, setSelectedItemForMatch] = useState<Item | null>(null);
  const [reportInitialType, setReportInitialType] = useState<ItemType>('lost');
  
  // Search and filter pass-throughs
  const [browseSearchQuery, setBrowseSearchQuery] = useState('');
  const [browseCategoryFilter, setBrowseCategoryFilter] = useState<ItemCategory | 'All'>('All');

  // Load items from localStorage on mount
  useEffect(() => {
    const loadedItems = getStoredItems();
    setItems(loadedItems);
  }, []);

  const handleItemCreated = (newItem: Item) => {
    const updated = addStoredItem(newItem);
    setItems(updated);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all items back to initial campus demo data? Any custom reports will be reset.')) {
      const reset = resetStoredItems();
      setItems(reset);
      setSelectedItemForDetail(null);
      setSelectedItemForMatch(null);
    }
  };

  const handleOpenReport = (type: ItemType = 'lost') => {
    setReportInitialType(type);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckMatches = (item: Item) => {
    setSelectedItemForMatch(item);
    setActiveTab('ai-matches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryShortcut = (category: ItemCategory) => {
    setBrowseCategoryFilter(category);
    setActiveTab('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchQueryShortcut = (query: string) => {
    setBrowseSearchQuery(query);
    setActiveTab('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={handleOpenReport}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            items={items}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            onOpenReportModal={handleOpenReport}
            onSelectCategoryFilter={handleCategoryShortcut}
            onSearchQuery={handleSearchQueryShortcut}
          />
        )}

        {activeTab === 'browse' && (
          <BrowseItemsPage
            items={items}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            onCheckMatches={handleCheckMatches}
            onOpenReport={() => handleOpenReport('lost')}
            initialSearchQuery={browseSearchQuery}
            initialCategory={browseCategoryFilter}
          />
        )}

        {activeTab === 'report' && (
          <ReportItemPage
            initialType={reportInitialType}
            allItems={items}
            onItemCreated={handleItemCreated}
            onNavigateToMatches={(item) => {
              setSelectedItemForMatch(item);
              setActiveTab('ai-matches');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToBrowse={() => {
              setActiveTab('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'ai-matches' && (
          <AIMatchingPage
            items={items}
            selectedItemForMatch={selectedItemForMatch}
            onSelectItemForMatch={setSelectedItemForMatch}
            onViewItemDetails={(item) => setSelectedItemForDetail(item)}
            onOpenSafeContact={(item) => setSelectedItemForContact(item)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetData={handleResetData}
      />

      {/* Item Details Modal */}
      {selectedItemForDetail && (
        <ItemDetailsModal
          item={selectedItemForDetail}
          allItems={items}
          onClose={() => setSelectedItemForDetail(null)}
          onOpenContact={(item) => setSelectedItemForContact(item)}
          onViewMatchItem={(matchedItem) => {
            setSelectedItemForDetail(matchedItem);
          }}
        />
      )}

      {/* Safe Contact Modal */}
      {selectedItemForContact && (
        <SafeContactModal
          item={selectedItemForContact}
          onClose={() => setSelectedItemForContact(null)}
        />
      )}
    </div>
  );
}
