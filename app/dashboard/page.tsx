import { ArrowRightCircle } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Dashboard() {
  const userCookie = (await cookies()).get("session_user");
  const user = userCookie ? JSON.parse(userCookie.value) : null;

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
      <p className="mt-4 text-gray-600">You are logged in as {user?.email}</p>
       <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
      >
        Go to Home <ArrowRightCircle className="h-5 w-5" />
      </Link>
      <form action="/api/logout" method="POST" className="mt-8">
     
    
        <button className="border px-4 py-2 rounded">Logout</button>
      </form>
    </div>
  );
}
