import { useEffect } from 'react';
import type { ApiEntry } from '../types';
import { CopyButton } from './CopyButton';
import { copyApiInfo, copyAsPrompt } from '../utils/copyUtils';

type Props = {
  api: ApiEntry;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
};

function Row({ label, value, chip }: { label: string; value: string; chip?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium w-28 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 dark:text-gray-100 text-right">{chip ?? value}</span>
    </div>
  );
}

function AuthChip({ auth }: { auth: string }) {
  if (auth === 'No') return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">No Auth Required</span>;
  if (auth === 'apiKey') return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">API Key</span>;
  if (auth === 'OAuth') return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">OAuth</span>;
  return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{auth}</span>;
}

function BoolChip({ value }: { value: string }) {
  if (value === 'Yes') return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Yes</span>;
  if (value === 'No') return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">No</span>;
  return <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">Unknown</span>;
}

export function ApiModal({ api, isFavorite, onToggleFavorite, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{api.name}</h2>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{api.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                className={`text-2xl transition-transform hover:scale-125 ${isFavorite ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'}`}
              >
                ⭐
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
              >
                ×
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{api.description}</p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wide mb-1">Use Case</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">{api.useCase}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <Row label="Auth" value={api.auth} chip={<AuthChip auth={api.auth} />} />
            <Row label="HTTPS" value={String(api.https)} chip={<BoolChip value={String(api.https)} />} />
            <Row label="CORS" value={api.cors} chip={<BoolChip value={api.cors} />} />
            <Row label="API URL" value={api.link} chip={
              <a href={api.link} target="_blank" rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] block text-right">
                {api.link.replace(/^https?:\/\//, '')}
              </a>
            } />
          </div>

          <div className="flex flex-wrap gap-2">
            <CopyButton getText={() => copyApiInfo(api)} label="Copy API Info" />
            <CopyButton getText={() => copyAsPrompt(api)} label="Copy as Prompt" />
            <a
              href={api.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors ml-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Open API Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
