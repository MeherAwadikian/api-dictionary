import { useState, useMemo } from 'react';
import type { ApiEntry, Filters } from './types';
import rawApis from './data/apis.json';
import { SearchBar } from './components/SearchBar';
import { CategorySidebar } from './components/CategorySidebar';
import { FilterBar } from './components/FilterBar';
import { ApiCard } from './components/ApiCard';
import { ApiModal } from './components/ApiModal';
import { useFavorites } from './hooks/useFavorites';
import { useDarkMode } from './hooks/useDarkMode';

const apis = rawApis as ApiEntry[];

const DEFAULT_FILTERS: Filters = { category: '', auth: '', httpsOnly: false, corsSupport: '' };

function favKey(api: ApiEntry) {
  return `${api.category}::${api.name}`;
}

export default function App() {
  const { dark, toggle: toggleDark } = useDarkMode();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedApi, setSelectedApi] = useState<ApiEntry | null>(null);

  const categories = useMemo(() => {
    const map: Record<string, number> = {};
    for (const api of apis) map[api.category] = (map[api.category] ?? 0) + 1;
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({ name, count }));
  }, []);

  const authTypes = useMemo(() => {
    return [...new Set(apis.map(a => a.auth))].sort();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return apis.filter(api => {
      if (showFavorites && !isFavorite(favKey(api))) return false;
      if (selectedCategory && api.category !== selectedCategory) return false;
      if (filters.auth && api.auth !== filters.auth) return false;
      if (filters.httpsOnly && String(api.https) !== 'Yes') return false;
      if (filters.corsSupport && api.cors !== filters.corsSupport) return false;
      if (q) {
        const hay = [api.name, api.category, api.description, api.auth, api.cors].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, filters, selectedCategory, showFavorites, isFavorite]);

  const favCount = useMemo(() => apis.filter(a => isFavorite(favKey(a))).length, [isFavorite]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setShowFavorites(false);
  };

  const handleToggleFavorites = () => {
    setShowFavorites(f => !f);
    if (!showFavorites) setSelectedCategory('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">📚</span>
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100 hidden sm:block">API Dictionary</span>
          </div>
          <SearchBar value={search} onChange={setSearch} />
          <button
            onClick={toggleDark}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="shrink-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar — hidden on mobile */}
        <div className="hidden lg:block">
          <CategorySidebar
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategorySelect}
            favCount={favCount}
            showFavorites={showFavorites}
            onToggleFavorites={handleToggleFavorites}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Mobile category strip */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setShowFavorites(f => !f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                showFavorites ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              ⭐ Favorites ({favCount})
            </button>
            <button
              onClick={() => handleCategorySelect('')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                !selectedCategory && !showFavorites ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selectedCategory === cat.name && !showFavorites ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Section heading */}
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {showFavorites ? 'Favorites' : selectedCategory || 'All APIs'}
            </h1>
          </div>

          {/* Filters */}
          <FilterBar
            filters={filters}
            onChange={setFilters}
            authTypes={authTypes}
            resultCount={filtered.length}
            totalCount={apis.length}
          />

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400 dark:text-gray-600">
              <span className="text-5xl">🔍</span>
              <p className="text-lg font-medium">No APIs found</p>
              <p className="text-sm">Try a different search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(api => (
                <ApiCard
                  key={favKey(api)}
                  api={api}
                  isFavorite={isFavorite(favKey(api))}
                  onToggleFavorite={() => toggleFavorite(favKey(api))}
                  onClick={() => setSelectedApi(api)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedApi && (
        <ApiModal
          api={selectedApi}
          isFavorite={isFavorite(favKey(selectedApi))}
          onToggleFavorite={() => toggleFavorite(favKey(selectedApi))}
          onClose={() => setSelectedApi(null)}
        />
      )}
    </div>
  );
}
