'use client';

import { Button } from "@heroui/react";
import NextLink from "next/link";
import { Wine } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <Wine size={64} className="text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Willkommen bei VinoFlow</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Ihre professionelle App für Weinberechnungen und Kellereimanagement.
      </p>
    </div>
  );
}