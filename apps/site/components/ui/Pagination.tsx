"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const cell =
  "grid h-[46px] w-[46px] place-items-center rounded-sm border font-display text-[13px] font-semibold [font-stretch:112%] transition-colors duration-300";

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-16 flex flex-wrap justify-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className={`${cell} border-line-strong hover:border-ivory disabled:cursor-not-allowed disabled:opacity-35`}
      >
        ←
      </button>
      {pageNumbers(currentPage, totalPages).map((page, i) =>
        page === "…" ? (
          <span key={`dots-${i}`} aria-hidden className="w-7 self-center text-center text-silver">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`${cell} ${page === currentPage ? "border-orange bg-orange text-carbon" : "border-line-strong hover:border-ivory"}`}
          >
            {page}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className={`${cell} border-line-strong hover:border-ivory disabled:cursor-not-allowed disabled:opacity-35`}
      >
        →
      </button>
    </nav>
  );
}
