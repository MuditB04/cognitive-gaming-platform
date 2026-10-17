import React from "react";

interface ObjectIconProps {
  name: string;
  className?: string;
}

export const ObjectIcon: React.FC<ObjectIconProps> = ({ name, className = "w-20 h-20" }) => {
  const norm = name.toLowerCase().trim();

  switch (norm) {
    case "apple":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Apple">
          <circle cx="50" cy="58" r="34" fill="#dc2626" stroke="#991b1b" strokeWidth="4" />
          <path d="M50 24 C 52 14, 62 10, 68 12" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="64" cy="18" rx="8" ry="4" fill="#22c55e" transform="rotate(-25 64 18)" />
          <path d="M48 24 C44 32, 40 40, 50 44 C60 40, 56 32, 52 24" fill="#78350f" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Book">
          <rect x="22" y="18" width="56" height="66" rx="6" fill="#2563eb" stroke="#1e40af" strokeWidth="4" />
          <rect x="28" y="24" width="44" height="54" rx="2" fill="#f8fafc" />
          <line x1="36" y1="36" x2="64" y2="36" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
          <line x1="36" y1="48" x2="64" y2="48" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
          <line x1="36" y1="60" x2="56" y2="60" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "key":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Key">
          <circle cx="34" cy="40" r="18" fill="#eab308" stroke="#ca8a04" strokeWidth="4" />
          <circle cx="34" cy="40" r="8" fill="#ffffff" stroke="#ca8a04" strokeWidth="3" />
          <rect x="48" y="37" width="38" height="6" fill="#eab308" stroke="#ca8a04" strokeWidth="3" />
          <rect x="74" y="43" width="6" height="12" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          <rect x="62" y="43" width="6" height="8" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
        </svg>
      );
    case "cup":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Cup">
          <path d="M25 32 L32 75 C33 80, 40 84, 50 84 C60 84, 67 80, 68 75 L75 32 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="4" />
          <path d="M72 40 C84 42, 84 62, 70 65" stroke="#0369a1" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="50" cy="32" rx="25" ry="7" fill="#38bdf8" stroke="#0369a1" strokeWidth="4" />
        </svg>
      );
    case "ball":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Ball">
          <circle cx="50" cy="50" r="38" fill="#ea580c" stroke="#c2410c" strokeWidth="4" />
          <path d="M22 36 C 45 42, 55 58, 78 64" stroke="#ffffff" strokeWidth="4" />
          <path d="M22 64 C 45 58, 55 42, 78 36" stroke="#ffffff" strokeWidth="4" />
          <line x1="50" y1="12" x2="50" y2="88" stroke="#ffffff" strokeWidth="4" />
        </svg>
      );
    case "spoon":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Spoon">
          <ellipse cx="32" cy="30" rx="16" ry="20" fill="#94a3b8" stroke="#64748b" strokeWidth="4" transform="rotate(-30 32 30)" />
          <path d="M42 42 L80 82" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Clock">
          <circle cx="50" cy="50" r="38" fill="#f8fafc" stroke="#334155" strokeWidth="5" />
          <circle cx="50" cy="50" r="4" fill="#334155" />
          <line x1="50" y1="50" x2="50" y2="24" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          <line x1="50" y1="50" x2="70" y2="50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="18" x2="50" y2="22" stroke="#64748b" strokeWidth="3" />
          <line x1="82" y1="50" x2="78" y2="50" stroke="#64748b" strokeWidth="3" />
        </svg>
      );
    case "shoe":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Shoe">
          <path d="M18 55 C22 45, 35 45, 42 55 L58 55 C65 40, 82 52, 85 70 L15 70 Z" fill="#6366f1" stroke="#4f46e5" strokeWidth="4" />
          <rect x="15" y="70" width="70" height="10" rx="4" fill="#1e1b4b" />
        </svg>
      );
    case "flower":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Flower">
          <circle cx="50" cy="30" r="14" fill="#ec4899" />
          <circle cx="70" cy="50" r="14" fill="#ec4899" />
          <circle cx="50" cy="70" r="14" fill="#ec4899" />
          <circle cx="30" cy="50" r="14" fill="#ec4899" />
          <circle cx="50" cy="50" r="12" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
        </svg>
      );
    case "comb":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-label="Comb">
          <rect x="15" y="36" width="70" height="14" rx="3" fill="#0f766e" stroke="#115e59" strokeWidth="3" />
          <line x1="22" y1="50" x2="22" y2="72" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="50" x2="30" y2="72" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          <line x1="38" y1="50" x2="38" y2="72" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          <line x1="46" y1="50" x2="46" y2="72" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          <line x1="54" y1="50" x2="54" y2="72" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          <line x1="62" y1="50" x2="62" y2="72" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          <line x1="70" y1="50" x2="70" y2="72" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          <line x1="78" y1="50" x2="78" y2="72" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-slate-700">
          {name}
        </div>
      );
  }
};
