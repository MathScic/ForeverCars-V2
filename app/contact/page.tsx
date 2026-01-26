"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

const sujets = [
  { value: "general", label: "Question générale" },
  { value: "achat", label: "Achat d'un véhicule" },
  { value: "vente", label: "Vendre mon véhicule" },
  { value: "autre", label: "Autre" },
];

export default function ContactPage() {
  const searchParams = useSearchParams();
  const vehicule = searchParams.get("vehicule");
  const sujetParam = searchParams.get("sujet");

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: sujetParam || "general",
    message: vehicule ? `Bonjour, je suis intéressé(e) par le véhicule : ${vehicule}` : "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "509829c9-ba11-4db1-99ff-d33626a16a4e", // Remplace par ta clé Web3Forms
          from_name: formData.nom,
          email: formData.email,
          phone: formData.telephone,
          subject: `ForeverCars - ${sujets.find((s) => s.value === formData.sujet)?.label}`,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ nom: "", email: "", telephone: "", sujet: "general", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSujetChange = (value: string) => {
    setFormData({ ...formData, sujet: value });
    setIsDropdownOpen(false);
  };

  const currentSujet = sujets.find((s) => s.value === formData.sujet);

  const inputClass =
    "w-full bg-brand-black border border-brand-gray-medium/40 rounded-lg px-4 py-3 font-inter text-sm text-brand-white focus:border-brand-orange focus:outline-none transition-colors";

  return (
    <section className="py-12 px-4 bg-brand-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-brand-white mb-4">
              Contactez-nous
            </h1>
            <p className="font-inter text-brand-gray-light">
              Une question ? Un projet ? N&apos;hésitez pas à nous écrire.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire */}
          <FadeIn delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-inter text-sm text-brand-gray-light mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block font-inter text-sm text-brand-gray-light mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block font-inter text-sm text-brand-gray-light mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="06 XX XX XX XX"
                />
              </div>

              {/* Custom Dropdown Sujet */}
              <div>
                <label className="block font-inter text-sm text-brand-gray-light mb-2">Sujet</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between bg-brand-black border border-brand-gray-medium/40 rounded-lg px-4 py-3 font-inter text-sm text-brand-white focus:border-brand-orange focus:outline-none cursor-pointer"
                  >
                    {currentSujet?.label || "Sélectionner"}
                    <ChevronDown
                      className={`w-4 h-4 text-brand-gray-light transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 top-full left-0 right-0 mt-2 bg-brand-black border border-brand-gray-medium/40 rounded-lg overflow-hidden origin-top"
                      >
                        {sujets.map((sujet) => (
                          <li
                            key={sujet.value}
                            onClick={() => handleSujetChange(sujet.value)}
                            className={`px-4 py-3 font-inter text-sm cursor-pointer transition-colors duration-200 ${
                              formData.sujet === sujet.value
                                ? "bg-brand-orange/20 text-brand-orange"
                                : "text-brand-white hover:bg-brand-gray-dark"
                            }`}
                          >
                            {sujet.label}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label className="block font-inter text-sm text-brand-gray-light mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={inputClass}
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-orbitron text-sm font-semibold px-8 py-4 bg-brand-orange text-brand-black rounded-full hover:bg-brand-orange/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </button>

              {submitStatus === "success" && (
                <p className="text-green-500 font-inter text-sm text-center">
                  Message envoyé avec succès ! Nous vous répondrons rapidement.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-500 font-inter text-sm text-center">
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}
            </form>
          </FadeIn>

          {/* Infos de contact */}
          <FadeIn delay={0.2}>
            <div className="space-y-8">
              <div className="bg-brand-gray-dark p-6 rounded-lg border border-brand-gray-medium/20">
                <h3 className="font-orbitron text-lg font-semibold text-brand-orange mb-4">
                  Informations
                </h3>
                <ul className="space-y-4 font-inter text-sm text-brand-gray-light">
                  <li>
                    <span className="text-brand-white block">Téléphone</span>
                    06 XX XX XX XX
                  </li>
                  <li>
                    <span className="text-brand-white block">Email</span>
                    contact@forevercars.fr
                  </li>
                  <li>
                    <span className="text-brand-white block">Zone d&apos;intervention</span>
                    Loiret (45) et alentours
                  </li>
                </ul>
              </div>

              <div className="bg-brand-gray-dark p-6 rounded-lg border border-brand-gray-medium/20">
                <h3 className="font-orbitron text-lg font-semibold text-brand-orange mb-4">
                  Horaires
                </h3>
                <ul className="space-y-2 font-inter text-sm text-brand-gray-light">
                  <li className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span className="text-brand-white">9h - 19h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Samedi</span>
                    <span className="text-brand-white">10h - 17h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="text-brand-white">Fermé</span>
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
