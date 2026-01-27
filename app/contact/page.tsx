"use client";

import { Suspense } from "react";
import ContactContent from "@/components/forms/ContactContent";

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-black flex items-center justify-center">
          <p className="font-inter text-brand-gray-light">Chargement...</p>
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
