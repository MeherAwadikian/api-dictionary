import type { ApiEntry } from '../types';
import { CopyButton } from './CopyButton';
import { copyApiInfo, copyAsPrompt } from '../utils/copyUtils';

type Props = {
  api: ApiEntry;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
};

function Badge({ value, trueColor, falseColor }: { value: string; trueColor: string; falseColor: string }) {
  const isPositive = value === 'Yes';
  const isUnknown = value === 'Unknown' || value === 'No' && falseColor === '';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPositive ? trueColor : isUnknown ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : falseColor}`}>
      {value}
    </span>
  );
}

function AuthBadge({ auth }: { auth: string }) {
  if (auth === 'No') return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">No Auth</span>;
  if (auth === 'apiKey') return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">API Key</span>;
  if (auth === 'OAuth') return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">OAuth</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{auth}</span>;
}

export function ApiCard({ api, isFavorite, onToggleFavorite, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {api.name}
          </h3>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{api.category}</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`text-lg shrink-0 transition-transform hover:scale-125 ${isFavorite ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'}`}
        >
          ⭐
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{api.description}</p>

      <div className="flex flex-wrap gap-1.5">
        <AuthBadge auth={api.auth} />
        <Badge value={String(api.https)} trueColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" falseColor="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" />
        <Badge value={api.cors} trueColor="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" falseColor="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-500 italic line-clamp-2">
        Use case: {api.useCase}
      </p>

      <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
        <CopyButton getText={() => copyApiInfo(api)} label="Copy Info" title="Copy API info" />
        <CopyButton getText={() => copyAsPrompt(api)} label="As Prompt" title="Copy as AI prompt" />
        <a
          href={api.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15,3 21,3 21,9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Open
        </a>
      </div>
    </div>
  );
}
