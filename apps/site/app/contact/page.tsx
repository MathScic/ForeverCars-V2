"use client";

import { Suspense } from "react";
import ContactContent from "@/components/forms/ContactContent";

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-silver">Chargement...</p>
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
