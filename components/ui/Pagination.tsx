"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-brand-gray-dark border border-brand-gray-medium/20 text-brand-white hover:border-brand-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      {getPageNumbers().map((page, index) =>
        typeof page === "string" ? (
          <span key={`dots-${index}`} className="px-2 text-brand-gray-light">
            {page}
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-orbitron text-sm font-semibold transition-all ${
              currentPage === page
                ? "bg-brand-orange text-brand-black"
                : "bg-brand-gray-dark border border-brand-gray-medium/20 text-brand-white hover:border-brand-orange"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-brand-gray-dark border border-brand-gray-medium/20 text-brand-white hover:border-brand-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
