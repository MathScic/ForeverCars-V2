import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// Style des champs repris du formulaire de contact du site.
const control =
  "w-full min-h-11 bg-brand-black border border-brand-gray-medium/40 rounded-lg px-4 py-2.5 text-sm text-brand-white placeholder:text-brand-gray-light/40 focus:border-brand-orange focus:outline-none transition-colors";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-brand-gray-light mb-2">{label}</span>
      {children}
      {error ? (
        <span className="block text-xs text-brand-danger mt-1.5">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-brand-gray-light/60 mt-1.5">{hint}</span>
      ) : null}
    </label>
  );
}

export const Input = ({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`${control} ${className}`} {...props} />
);

export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={`${control} resize-y`} {...props} />
);

export const Select = ({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={control} {...props}>
    {children}
  </select>
);
