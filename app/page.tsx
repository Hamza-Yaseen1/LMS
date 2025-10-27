// 'use client';
// import { useEffect, useState } from "react";


// interface Book {
//   id: number;
//   title: string;
//   author: string;
//   available: boolean;
// }

// export default function Home() {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const res = await fetch("/api/books");
//         if (!res.ok) throw new Error("Failed to fetch books");

//         const data: Book[] = await res.json();
//         setBooks(data);
//       } catch (err) {
//         console.error("Error fetching books:", err);
//         setError("Failed to load books. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   return (
//     <main className="p-6">
//       <h1 className="text-3xl font-bold mb-4">📚 Library Management System</h1>
//       <h2 className="text-xl mb-2">Available Books</h2>

//       {loading && <p className="text-gray-500">Loading books...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && !error && books.length === 0 && (
//         <p className="text-gray-600">No books available.</p>
//       )}

//       <ul className="list-disc pl-5 space-y-1">
//         {books.map((book) => (
//           <li key={book.id}>
//             <span className="font-medium">{book.title}</span> —{" "}
//             <span className="text-sm text-gray-600">{book.author}</span>{" "}
//             {book.available ? (
//               <span className="text-green-600">(Available)</span>
//             ) : (
//               <span className="text-red-600">(Checked out)</span>
//             )}
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }

// app/page.tsx
import Link from "next/link";
import { LibraryBig, ArrowRightCircle } from "lucide-react";

export default function Home() {
  return (
    <>
    
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="flex items-center gap-3 mb-4">
        <LibraryBig className="h-10 w-10 text-blue-600" />
        <h1 className="text-3xl font-bold tracking-tight">Library Management System</h1>
      </div>
      <p className="max-w-xl text-slate-600 mb-8">
        A simple Next.js + MySQL app to manage books, members, and issue records. Learn full-stack
        development by building it step by step.
      </p>
      <Link
        href="/books"
        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
      >
        Go to Books <ArrowRightCircle className="h-5 w-5" />
      </Link>
    </div>
    </>
  );
}


