"use client";
import { SignInForm } from "@/auth/components/sign-in-form";
import Header from "@/components/ui/header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      <Header>
        <div className="flex flex-row items-center gap-5">
           <Image
             src="/images/ku_logo.png"
             width={90}
             height={90}
             alt="Kingston University Logo"
             className="object-contain"
           />
           <h1 className="text-[20px] font-medium tracking-wide text-white">
             Welcome to the Library App
           </h1>
        </div>
      </Header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-24">
        <SignInForm />
      </main>
    </div>
  );
}
