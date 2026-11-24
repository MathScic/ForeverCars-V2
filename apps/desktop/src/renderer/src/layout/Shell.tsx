import { useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Shell() {
  // Un fichier lâché hors d'une zone de dépôt est ignoré (sinon Chromium tenterait de l'ouvrir).
  useEffect(() => {
    const block = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", block);
    window.addEventListener("drop", block);
    return () => {
      window.removeEventListener("dragover", block);
      window.removeEventListener("drop", block);
    };
  }, []);

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-10 pb-24 pt-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
