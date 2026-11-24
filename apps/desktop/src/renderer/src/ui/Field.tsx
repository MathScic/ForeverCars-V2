import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// Champs du formulaire de contact du site : fond transparent, filet, liseré orange au focus.
const control =
  "w-full min-h-[52px] rounded-sm border border-line-strong bg-transparent px-4 py-3 text-[15px] text-ivory transition-colors duration-300 placeholder:text-silver/60 hover:border-silver focus:border-orange focus:outline-none";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="grid gap-2.5">
      <span className="fc-label">{label}</span>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : hint ? <span className="text-xs text-silver">{hint}</span> : null}
    </label>
  );
}

export const Input = ({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`${control} ${className}`} {...props} />
);

export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={`${control} min-h-40 resize-y`} {...props} />
);

export const Select = ({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={`${control} [&>option]:bg-graphite`} {...props}>
    {children}
  </select>
);
