import {ChevronLeft, ChevronRight} from 'lucide-react';
import React from 'react';

interface PaginationProps {
    page: number;
    total: number;
    perPage: number;
    onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({page, total, perPage, onChange}) => {
    const pageCount = Math.ceil(total / perPage);
    if (pageCount <= 1) return null;

    return (
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button
                onClick={() => {
                    onChange(page - 1);
                }}
                disabled={page === 1}
                className="w-8 h-8 rounded-premium-sm border border-white/8 flex items-center justify-center text-white/40 disabled:opacity-25 active:scale-90 transition-all"
            >
                <ChevronLeft className="w-4 h-4"/>
            </button>

            <div className="flex items-center gap-1.5">
                {Array.from({length: pageCount}, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => {
                            onChange(p);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                            p === page ? 'bg-white/60 scale-125' : 'bg-white/20 hover:bg-white/35'
                        }`}
                    />
                ))}
            </div>

            <button
                onClick={() => {
                    onChange(page + 1);
                }}
                disabled={page === pageCount}
                className="w-8 h-8 rounded-premium-sm border border-white/8 flex items-center justify-center text-white/40 disabled:opacity-25 active:scale-90 transition-all"
            >
                <ChevronRight className="w-4 h-4"/>
            </button>
        </div>
    );
};
