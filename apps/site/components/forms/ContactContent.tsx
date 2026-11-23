"use client";

import { useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { Arrow, buttonClasses } from "@/components/ui/Button";
import ContactInfo from "./ContactInfo";

const sujets = [
  { value: "general", label: "Question générale" },
  { value: "achat", label: "Achat d'un véhicule" },
  { value: "vente", label: "Vendre mon véhicule" },
  { value: "autre", label: "Autre" },
];

const field = "grid gap-2.5";
const label = "font-display text-[10px] font-medium uppercase tracking-[0.24em] text-silver [font-stretch:112%]";
const control = "min-h-[52px] w-full rounded-sm border border-line-strong bg-transparent px-4 py-3.5 text-[15px] text-ivory transition-colors placeholder:text-silver/60 hover:border-silver focus:border-orange focus:outline-none";
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function ContactContent() {
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
          access_key: "509829c9-ba11-4db1-99ff-d33626a16a4e",
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

  return (
    <div className="mx-auto w-[min(100%-32px,1320px)] md:w-[min(100%-48px,1320px)]">
      <section className="border-b border-line pb-12 pt-12 md:pb-16 md:pt-24">
        <span className="fc-eyebrow rise-in">Contact</span>
        <h1 className="fc-display focus-in mt-6" style={delay(100)}>Contactez-nous</h1>
        <p className="rise-in mt-6 text-base text-silver md:text-lg" style={delay(200)}>Une question ? Un projet ? N&apos;hésitez pas à nous écrire.</p>
      </section>

      <div className="grid items-start gap-16 pt-14 lg:grid-cols-[7fr_5fr] lg:gap-20 lg:pt-[72px]">
        <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
          <label className={field}><span className={label}>Nom complet</span><input type="text" name="nom" required value={formData.nom} onChange={handleChange} placeholder="Votre nom" autoComplete="name" className={control} /></label>
          <label className={field}><span className={label}>Email</span><input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="votre@email.com" autoComplete="email" className={control} /></label>
          <label className={field}><span className={label}>Téléphone</span><input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="06 XX XX XX XX" autoComplete="tel" className={control} /></label>
          <fieldset className={`${field} sm:col-span-2`}>
            <legend className={`${label} mb-2.5`}>Sujet</legend>
            <div className="flex flex-wrap gap-2">
              {sujets.map((s) => (
                <label key={s.value} className="relative">
                  <input type="radio" name="sujet" value={s.value} checked={formData.sujet === s.value} onChange={() => setFormData({ ...formData, sujet: s.value })} className="peer sr-only" />
                  <span className="inline-flex h-11 items-center rounded-sm border border-line-strong px-4 text-sm text-silver transition-colors hover:border-ivory hover:text-ivory peer-checked:border-ivory peer-checked:bg-ivory peer-checked:text-carbon peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange">
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className={`${field} sm:col-span-2`}><span className={label}>Message</span><textarea name="message" required rows={6} value={formData.message} onChange={handleChange} placeholder="Votre message..." className={`${control} min-h-40 resize-y`} /></label>
          <div className="grid gap-4 sm:col-span-2">
            <button type="submit" disabled={isSubmitting} className={buttonClasses("primary", "w-full justify-between")}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"} <Arrow />
            </button>
            {submitStatus === "success" && <p role="status" className="rounded-sm border border-success/35 px-5 py-4 text-sm text-success">Message envoyé avec succès ! Nous vous répondrons rapidement.</p>}
            {submitStatus === "error" && <p role="alert" className="rounded-sm border border-danger/40 px-5 py-4 text-sm text-danger">Une erreur est survenue. Veuillez réessayer.</p>}
          </div>
        </form>
        <ContactInfo />
      </div>
    </div>
  );
}
