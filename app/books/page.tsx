// app/books/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  LibraryBig,
  Search,
  Filter as FilterIcon,
  ArrowUpDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Quick notes
 * - Requires: `npm i lucide-react framer-motion`
 * - Tailwind recommended for styles.
 * - Uses your existing /api/books (GET, POST) from Phase 2.
 */

type Book = {
  id: number;
  title: string | null;
  author: string | null;
  isbn: string | null;
};

type SortKey = "title" | "author" | "isbn";
type SortDir = "asc" | "desc";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // UI state
  const [query, setQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  // Fetch books
  async function fetchBooks() {
    try {
      setLoading(true);
      const res = await fetch("/api/books", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load books");
      const data: unknown = await res.json();
      setBooks(Array.isArray(data) ? (data as Book[]) : []);
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived data: search + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? books.filter((b) =>
          [b.title, b.author, b.isbn]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        )
      : books;

    const sorted = [...base].sort((a, b) => {
      const av = (a[sortKey] ?? "").toString().toLowerCase();
      const bv = (b[sortKey] ?? "").toString().toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [books, query, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // Helpers
  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LibraryBig className="h-8 w-8" />
            <h1 className="text-2xl font-bold tracking-tight">Library Books</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-100"
            >
              <FilterIcon className="h-4 w-4" /> Filters
            </button>
            <button
              onClick={fetchBooks}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" /> Reload
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-lg">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <input
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                placeholder="Search by title, author, or ISBN"
                className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-0 focus:border-slate-400"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <div className="flex overflow-hidden rounded-2xl border border-slate-300">
                {[
                  { key: "title" as const, label: "Title" },
                  { key: "author" as const, label: "Author" },
                  { key: "isbn" as const, label: "ISBN" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => toggleSort(opt.key)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm hover:bg-slate-100 ${
                      sortKey === opt.key ? "bg-slate-100" : "bg-white"
                    }`}
                    title={`Sort by ${opt.label}`}
                  >
                    {opt.label}
                    {sortKey === opt.key && (
                      <ArrowUpDown className={`h-3.5 w-3.5 ${sortDir === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter panel (animated) */}
          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="mt-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* Example quick filters – adjust to your schema later */}
                  <QuickFilter
                    label="Only with ISBN"
                    activeFn={(b) => !!b.isbn}
                    books={books}
                    apply={(subset) => setBooks(subset)}
                  />
                  <QuickFilter
                    label="Author starts A–M"
                    activeFn={(b) => {
                      const ch = (b.author ?? "").trim().charAt(0).toUpperCase();
                      return ch >= "A" && ch <= "M";
                    }}
                    books={books}
                    apply={(subset) => setBooks(subset)}
                  />
                  <QuickFilter
                    label="Author starts N–Z"
                    activeFn={(b) => {
                      const ch = (b.author ?? "").trim().charAt(0).toUpperCase();
                      return ch >= "N" && ch <= "Z";
                    }}
                    books={books}
                    apply={(subset) => setBooks(subset)}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Tip: Quick filters mutate the current list. Click <b>Reload</b> above to reset.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <CardsSkeleton />
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState onReset={fetchBooks} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginated.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Showing <b>{(page - 1) * pageSize + 1}</b>–
                  <b>{Math.min(page * pageSize, filtered.length)}</b> of
                  <b> {filtered.length}</b>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm enabled:hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>
                  <span className="text-sm">
                    Page <b>{page}</b>/<b>{totalPages}</b>
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm enabled:hover:bg-slate-100 disabled:opacity-50"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const { title, author, isbn } = book;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold" title={title ?? undefined}>
            {title || "Untitled"}
          </h3>
          <p className="truncate text-sm text-slate-600" title={author ?? undefined}>
            {author || "Unknown Author"}
          </p>
        </div>
      </div>
      <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span className="opacity-70">ISBN</span>
          <span className="font-medium">{isbn || "—"}</span>
        </div>
      </div>
    </motion.div>
  );
}

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
          <div className="mt-3 h-8 rounded-2xl bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <LibraryBig className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold">No books found</h3>
      <p className="mt-1 text-sm text-slate-600">Try clearing filters or reloading.</p>
      <button
        onClick={onReset}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-100"
      >
        <RefreshCw className="h-4 w-4" /> Reload
      </button>
    </div>
  );
}

function QuickFilter({
  label,
  activeFn,
  books,
  apply,
}: {
  label: string;
  activeFn: (b: Book) => boolean;
  books: Book[];
  apply: (subset: Book[]) => void;
}) {
  return (
    <button
      onClick={() => apply(books.filter(activeFn))}
      className="inline-flex items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-100"
    >
      <span>{label}</span>
      <FilterIcon className="h-4 w-4 opacity-60" />
    </button>
  );
}
