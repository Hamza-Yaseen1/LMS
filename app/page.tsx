

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
        A simple Next.js + MySQL app to manage books, members, and issue records. Developed by Amir Aslam — because every library deserves clean code.
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


