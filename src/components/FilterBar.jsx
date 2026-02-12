import React, { useState } from 'react';

export const ICELAND_REGIONS = [
  'Reykjavík',
  'Akureyri',
  'Keflavík',
  'South Iceland',
  'North Iceland',
  'East Iceland',
  'West Iceland',
  'West Fjords',
];

// Label + control wrapper used in primary and secondary filter rows
export function FilterField({ label, children }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      {children}
    </div>
  );
}

// Single-select pill group.
// options: string[] | { label: string, value: string }[]
// Clicking the active option deselects it (toggles back to '').
export function PillSelect({ options, value, onChange, allLabel = 'All' }) {
  const opts = options.map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o,
  );
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange('')}
        className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
          !value
            ? 'bg-gray-800 text-white border-gray-800'
            : 'border-gray-300 text-gray-600 hover:border-gray-400'
        }`}
      >
        {allLabel}
      </button>
      {opts.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(value === opt.value ? '' : opt.value)}
          className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
            value === opt.value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 text-gray-600 hover:border-gray-400'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Compact travelers button that opens a popover with adult/children +/- controls.
// adults: number, children: number, onChangeAdults/onChangeChildren: (n: number) => void
export function TravelersPopover({ adults = 1, children = 0, onChangeAdults, onChangeChildren }) {
  const [open, setOpen] = useState(false);

  const label = (() => {
    const parts = [];
    if (adults > 0) parts.push(`${adults} adult${adults !== 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} child${children !== 1 ? 'ren' : ''}`);
    return parts.length ? parts.join(' · ') : '1 adult';
  })();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
      >
        <span className="text-gray-500">👤</span>
        <span className="text-gray-800">{label}</span>
        <span className="text-xs text-gray-400 ml-0.5">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20 w-52">
          <div className="space-y-4">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Adults</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeAdults(Math.max(1, adults - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-base leading-none"
                >
                  −
                </button>
                <span className="w-5 text-center font-medium text-gray-900">{adults}</span>
                <button
                  type="button"
                  onClick={() => onChangeAdults(Math.min(20, adults + 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-base leading-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">Children</span>
                <p className="text-xs text-gray-400">Under 18</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeChildren(Math.max(0, children - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-base leading-none"
                >
                  −
                </button>
                <span className="w-5 text-center font-medium text-gray-900">{children}</span>
                <button
                  type="button"
                  onClick={() => onChangeChildren(Math.min(20, children + 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-base leading-none"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-4 w-full py-1.5 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// Shared filter bar shell.
//
// Props:
//   resultCount           – number of results after filtering
//   label                 – product label, e.g. "tours", "hotels"
//   hasActiveFilters      – show Reset button when true
//   onReset               – clear-all callback
//   moreFilters           – JSX rendered in the collapsible secondary panel
//   moreFiltersActiveCount – badge count on the "More filters" button
//   children              – primary filter controls (FilterField elements)
export default function FilterBar({
  resultCount,
  label = 'results',
  hasActiveFilters = false,
  onReset,
  moreFilters,
  moreFiltersActiveCount = 0,
  children,
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      {/* Primary filter row */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        {children}

        {/* Right-side controls */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {moreFilters && (
            <button
              type="button"
              onClick={() => setShowMore((s) => !s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md transition-colors whitespace-nowrap ${
                showMore
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              More filters
              {moreFiltersActiveCount > 0 && !showMore && (
                <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {moreFiltersActiveCount}
                </span>
              )}
              <span className="text-xs opacity-60">{showMore ? '▲' : '▼'}</span>
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <p className="mt-2 text-sm text-gray-500">
        <span className="font-semibold text-gray-800">{resultCount}</span>{' '}
        {label} available
      </p>

      {/* Secondary (more) filters panel */}
      {showMore && moreFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100">{moreFilters}</div>
      )}
    </div>
  );
}
