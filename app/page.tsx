'use client';
import { Button } from "@/components/ui/button";
import { ArrowUpNarrowWide } from "lucide-react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error');
 useEffect(() => {
    if (error === 'unauthorized') {
      toast.error('You must be logged in.')
      const timeout = setTimeout(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        current.delete('error')
        const cleanUrl = window.location.pathname + (current.toString() ? '?' + current.toString() : '')
        router.replace(cleanUrl)
      }, 1000);

      return () => clearTimeout(timeout)
    }
  }, [error, searchParams, router])


  return (
    <div className="h-screen bg-gray-50 text-gray-900">

      <section className="flex flex-col justify-center h-[80vh] items-center text-center">
        <h1 className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent leading-tight text-8xl font-extrabold mb-4 max-w-3xl">Engage. Analyze. Scale.</h1>
        <p className="text-xl max-w-2xl mb-8 text-gradient-to-r from-emerald-500 to-emerald-700">
          Empower your business with customer segmentation, personalized campaigns, and actionable insights — all in one place.
        </p>

        <div className="flex gap-4">
          {!session ? (
            <Button onClick={() => signIn("google")} className="bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer px-6 py-5 rounded-xl shadow-md transition">
              Get Started
              <ArrowUpNarrowWide className=" h-5 w-5 inline-block" />
            </Button>
          ) : (
            <Button onClick={() => router.push('/dashboard')} className="bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer px-6 py-5 rounded-xl shadow-md transition">
              Go to DashBoard<ArrowUpNarrowWide className=" h-5 w-5 inline-block" />
            </Button>
          )}
        </div>
      </section>

    </div>
  );
}
