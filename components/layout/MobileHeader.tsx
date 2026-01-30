"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/stock", label: "Notre Stock" },
  { href: "/vendu", label: "Vendu" },
  { href: "/a-propos", label: "À Propos" },
];

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-brand-black/95 backdrop-blur-sm border-b border-brand-gray-medium/20 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMenu}>
            <span className="font-orbitron text-xl font-bold text-brand-white">
              FOREVER<span className="text-brand-orange">CARS</span>
            </span>
          </Link>

          {/* Burger Button */}
          <button
            onClick={toggleMenu}
            className="p-2 text-brand-white hover:text-brand-orange transition-colors duration-300"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-brand-black border-l border-brand-gray-medium/20 shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-brand-gray-medium/20">
                <span className="font-orbitron text-lg font-bold text-brand-white">
                  Menu
                </span>
                <button
                  onClick={closeMenu}
                  className="p-2 text-brand-white hover:text-brand-orange transition-colors duration-300"
                  aria-label="Fermer le menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="block px-6 py-4 font-inter text-base font-medium text-brand-gray-light hover:text-brand-white hover:bg-brand-gray-dark/50 transition-all duration-300 border-l-2 border-transparent hover:border-brand-orange"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="absolute bottom-8 left-4 right-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className="block w-full text-center font-orbitron text-sm font-semibold px-6 py-3 bg-brand-orange text-brand-black rounded-full hover:bg-brand-orange/90 transition-all duration-300"
                  >
                    Nous Contacter
                  </Link>
                </motion.div>

                {/* Tagline */}
                <p className="text-center text-brand-gray-medium text-xs mt-4 font-inter italic">
                  &ldquo;Acheter ou vendre autrement&rdquo;
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
