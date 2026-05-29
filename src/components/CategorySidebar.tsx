type Props = {
  categories: { name: string; count: number }[];
  selected: string;
  onSelect: (cat: string) => void;
  favCount: number;
  showFavorites: boolean;
  onToggleFavorites: () => void;
};

export function CategorySidebar({ categories, selected, onSelect, favCount, showFavorites, onToggleFavorites }: Props) {
  return (
    <aside className="w-56 shrink-0 flex flex-col gap-1">
      <button
        onClick={onToggleFavorites}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          showFavorites
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <span className="flex items-center gap-2">
          <span>⭐</span> Favorites
        </span>
        <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full px-2 py-0.5">
          {favCount}
        </span>
      </button>

      <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

      <button
        onClick={() => { onSelect(''); }}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          !selected && !showFavorites
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <span>All APIs</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {categories.reduce((s, c) => s + c.count, 0)}
        </span>
      </button>

      {categories.map(cat => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
            selected === cat.name && !showFavorites
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <span className="truncate text-left">{cat.name}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 shrink-0">{cat.count}</span>
        </button>
      ))}
    </aside>
  );
}
