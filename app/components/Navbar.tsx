// // components/Navbar.tsx
// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { BookOpen, Home, Users,LogOut  } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();

//   const navItems = [
//     { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
//     { href: "/books", label: "Books", icon: <BookOpen className="h-4 w-4" /> },
//     { href: "/members", label: "Members", icon: <Users className="h-4 w-4" /> },
//     { href: "/logout", label: "Logout", icon: <LogOut  className="h-4 w-4" /> },
//   ];

//   return (
//     <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
//         <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
//           <BookOpen className="h-5 w-5 text-blue-600" /> Library
//         </Link>
//         <div className="flex gap-2">
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-slate-100 ${
//                 pathname === item.href ? "bg-slate-100 text-blue-600" : "text-slate-700"
//               }`}
//             >
//               {item.icon}
//               {item.label}
//             </Link>
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// }
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Home, Users, LogOut,LayoutDashboard  } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/"); // redirect to home after logout
  };

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "/books", label: "Books", icon: <BookOpen className="h-4 w-4" /> },
    { href: "/members", label: "Members", icon: <Users className="h-4 w-4" /> },   
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard  className="h-4 w-4" /> },   
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <BookOpen className="h-5 w-5 text-blue-600" /> Library
        </Link>

        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-slate-100 ${
                pathname === item.href ? "bg-slate-100 text-blue-600" : "text-slate-700"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {/* 🔹 Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
