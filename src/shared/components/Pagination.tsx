import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, total, perPage, onChange }) => {
  const pageCount = Math.ceil(total / perPage);
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-3">
      <button
        onClick={() => {
          onChange(page - 1);
        }}
        disabled={page === 1}
        className="rounded-premium-sm flex h-8 w-8 items-center justify-center border border-white/8 text-white/40 transition-all active:scale-90 disabled:opacity-25"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => {
              onChange(p);
            }}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              p === page ? 'scale-125 bg-white/60' : 'bg-white/20 hover:bg-white/35'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => {
          onChange(page + 1);
        }}
        disabled={page === pageCount}
        className="rounded-premium-sm flex h-8 w-8 items-center justify-center border border-white/8 text-white/40 transition-all active:scale-90 disabled:opacity-25"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
