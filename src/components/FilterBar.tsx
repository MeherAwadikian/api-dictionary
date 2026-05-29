import type { Filters } from '../types';

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  authTypes: string[];
  resultCount: number;
  totalCount: number;
};

export function FilterBar({ filters, onChange, authTypes, resultCount, totalCount }: Props) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...filters, [k]: v });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filters.auth}
        onChange={e => set('auth', e.target.value)}
        className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Auth Types</option>
        {authTypes.map(a => <option key={a} value={a}>{a === 'No' ? 'No Auth' : a}</option>)}
      </select>

      <select
        value={filters.corsSupport}
        onChange={e => set('corsSupport', e.target.value)}
        className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All CORS</option>
        <option value="Yes">CORS: Yes</option>
        <option value="No">CORS: No</option>
        <option value="Unknown">CORS: Unknown</option>
      </select>

      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.httpsOnly}
          onChange={e => set('httpsOnly', e.target.checked)}
          className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
        />
        HTTPS only
      </label>

      <span className="ml-auto text-sm text-gray-500 dark:text-gray-500">
        {resultCount} of {totalCount} APIs
      </span>
    </div>
  );
}
