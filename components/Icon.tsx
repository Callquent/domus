import type { ReactNode } from "react";

const SHAPES: Record<string, ReactNode> = {
  aspirateur: (
    <>
      <path d="M9 3h6" />
      <path d="M12 3v11" />
      <rect x="8" y="14" width="8" height="4" rx="1" />
      <rect x="4" y="18" width="16" height="3" rx="1.5" />
    </>
  ),
  "lave-linge": (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="14" r="4.5" />
      <path d="M9.5 14.5a2.5 2.5 0 0 0 5 0" />
      <path d="M8 6h.01" />
      <path d="M12 6h5" />
    </>
  ),
  "lave-vaisselle": (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M4 7h16" />
      <path d="M8 4.5h.01" />
      <path d="M12 4.5h4" />
      <path d="M8 12v6" />
      <path d="M12 12v6" />
      <path d="M16 12v6" />
    </>
  ),
  "seche-linge": (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="14" r="5" />
      <path d="M9.5 14c.8-.9 1.7.9 2.5 0s1.7.9 2.5 0" />
      <path d="M8 6h.01" />
      <path d="M11 6h.01" />
    </>
  ),
  lit: (
    <>
      <path d="M3 5v15" />
      <path d="M3 15h18v5" />
      <path d="M21 15v-2a3 3 0 0 0-3-3h-7v5" />
      <circle cx="7" cy="11.5" r="1.8" />
    </>
  ),
  balai: (
    <>
      <path d="M12 2v11" />
      <path d="M8 13h8" />
      <path d="M8 13l-3 9h14l-3-9" />
      <path d="M10 17l-.7 5" />
      <path d="M14 17l.7 5" />
    </>
  ),
  seau: (
    <>
      <ellipse cx="12" cy="8" rx="7.5" ry="2" />
      <path d="M4.5 8l1.6 11.5A2 2 0 0 0 8.1 21h7.8a2 2 0 0 0 2-1.5L19.5 8" />
      <path d="M6.5 7C7 2.5 17 2.5 17.5 7" />
    </>
  ),
  frigo: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M6 10h12" />
      <path d="M9 5.5v2" />
      <path d="M9 13v3" />
    </>
  ),
  "sac-poubelle": (
    <>
      <path d="M8.5 9L9.5 5 12 6.5 14.5 5l1 4" />
      <path d="M8.5 9C5 12 4 16 6 19.5A2.5 2.5 0 0 0 8.2 21h7.6a2.5 2.5 0 0 0 2.2-1.5c2-3.5 1-7.5-2.5-10.5" />
      <path d="M8.5 9h7" />
    </>
  ),
  douche: (
    <>
      <path d="M5 10a7 7 0 0 1 14 0z" />
      <path d="M12 3V2" />
      <path d="M8 14v2" />
      <path d="M12 14v3" />
      <path d="M16 14v2" />
    </>
  ),
  toilettes: (
    <>
      <rect x="7" y="3" width="10" height="5" rx="1" />
      <path d="M5 11h14c0 5-2.5 8-7 8s-7-3-7-8z" />
      <path d="M10 19v2h4v-2" />
    </>
  ),
  fenetre: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 3v18" />
      <path d="M4 12h16" />
    </>
  ),
  plante: (
    <>
      <path d="M8 14h8l-1 7H9z" />
      <path d="M12 14V9" />
      <path d="M12 12c-4 0-6-2-6-6 4 0 6 2 6 6z" />
      <path d="M12 10c0-3 2-5 6-5 0 4-2 6-6 5z" />
    </>
  ),
  spray: (
    <>
      <rect x="8" y="11" width="8" height="10" rx="2" />
      <path d="M10 11V7h6v4" />
      <path d="M16 8h3" />
      <path d="M21.5 7.5h.01" />
      <path d="M21.5 10.5h.01" />
    </>
  ),
  four: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 8h18" />
      <path d="M7 5.5h.01" />
      <path d="M11 5.5h.01" />
      <rect x="6" y="11" width="12" height="7" rx="1" />
    </>
  ),
  "micro-onde": (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <rect x="5" y="8" width="10" height="8" rx="1" />
      <path d="M17.5 5v14" />
      <path d="M19.8 9h.01" />
      <path d="M19.8 12h.01" />
    </>
  ),
  table: (
    <>
      <path d="M3 3v4a2 2 0 0 0 4 0V3" />
      <path d="M5 3v18" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.8" />
      <path d="M21 21V3c-2.5 1.5-3.5 4-3.5 8H21" />
    </>
  ),
  evier: (
    <>
      <rect x="3" y="12" width="18" height="8" rx="2" />
      <path d="M12 12V6a2 2 0 0 1 2-2h3v2" />
    </>
  ),
  plaque: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="8" r="2.5" />
      <circle cx="8" cy="16" r="2.5" />
      <circle cx="16" cy="16" r="2.5" />
    </>
  ),
  congelateur: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 7v10" />
      <path d="M7.7 9.5l8.6 5" />
      <path d="M16.3 9.5l-8.6 5" />
    </>
  ),
  baignoire: (
    <>
      <path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" />
      <path d="M6 12V6a2 2 0 0 1 2-2h2" />
      <path d="M8 20v2" />
      <path d="M16 20v2" />
    </>
  ),
  lavabo: (
    <>
      <path d="M4 10h16c0 5-3.5 8-8 8s-8-3-8-8z" />
      <path d="M12 10V6" />
      <path d="M9.5 6h5" />
      <path d="M10 18v3h4v-3" />
    </>
  ),
  canape: (
    <>
      <path d="M6 11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
      <path d="M3 12a1.5 1.5 0 0 1 3 0v3h12v-3a1.5 1.5 0 0 1 3 0v6H3z" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
    </>
  ),
  fauteuil: (
    <>
      <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
      <path d="M4 12a1.5 1.5 0 0 1 3 0v3h10v-3a1.5 1.5 0 0 1 3 0v6H4z" />
      <path d="M6 18v2" />
      <path d="M18 18v2" />
    </>
  ),
  draps: (
    <>
      <rect x="4" y="3.5" width="16" height="4.5" rx="1" />
      <rect x="3" y="9.75" width="18" height="4.5" rx="1" />
      <rect x="4" y="16" width="16" height="4.5" rx="1" />
    </>
  ),
  "panier-linge": (
    <>
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 8h18" />
      <path d="M4.5 8l1.2 11a2 2 0 0 0 2 1.8h8.6a2 2 0 0 0 2-1.8L19.5 8" />
      <path d="M9 11v6" />
      <path d="M12 11v6" />
      <path d="M15 11v6" />
    </>
  ),
  repassage: (
    <>
      <path d="M2 10.5L4 9h11.5c2.7 0 4.7 1 5.5 3H4z" />
      <path d="M7 12l8 9" />
      <path d="M15 12l-8 9" />
    </>
  ),
  cintre: (
    <>
      <path d="M12 8V7a2 2 0 1 0-2-2" />
      <path d="M12 8l9 6.5a1 1 0 0 1-.6 1.8H3.6A1 1 0 0 1 3 14.5z" />
    </>
  ),
  voiture: (
    <>
      <path d="M3 16v-4l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 5v4" />
      <path d="M3 12h18" />
      <circle cx="7" cy="16" r="2" />
      <circle cx="17" cy="16" r="2" />
      <path d="M9 16h6" />
    </>
  ),
  tondeuse: (
    <>
      <rect x="4" y="11" width="11" height="5" rx="1" />
      <circle cx="7" cy="18.5" r="2" />
      <circle cx="13" cy="18.5" r="2" />
      <path d="M18.5 3L14.5 11" />
      <path d="M17 3h3" />
    </>
  ),
  air: (
    <>
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 12h16a3 3 0 1 1-3 3" />
      <path d="M3 16h6a2.5 2.5 0 1 1-2.5 2.5" />
    </>
  ),
  vitre: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 15l6-6" />
      <path d="M11 18l7-7" />
    </>
  ),
  store: (
    <>
      <rect x="3" y="3" width="18" height="3" rx="1" />
      <path d="M5 6v14h14V6" />
      <path d="M5 10h14" />
      <path d="M5 14h14" />
      <path d="M12 20v2" />
    </>
  ),
  lunettes: (
    <>
      <circle cx="6.5" cy="14" r="3.5" />
      <circle cx="17.5" cy="14" r="3.5" />
      <path d="M10 13.5c1.3-1 2.7-1 4 0" />
      <path d="M3.2 12.5L2 9" />
      <path d="M20.8 12.5L22 9" />
    </>
  ),
  garage: (
    <>
      <path d="M3 21V9l9-6 9 6v12z" />
      <rect x="7" y="12" width="10" height="9" />
      <path d="M7 15h10" />
      <path d="M7 18h10" />
    </>
  ),
  ampoule: (
    <>
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V18h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
      <path d="M10 21h4" />
    </>
  ),
  etoile: (
    <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" />
  ),
};

export const ICON_NAMES = Object.keys(SHAPES);

interface Props {
  name: string;
  size?: number;
}

export default function Icon({ name, size = 28 }: Props) {
  const shape = SHAPES[name];

  // Anciennes tâches enregistrées avec un emoji : on l'affiche tel quel
  if (!shape) {
    return (
      <span style={{ fontSize: size * 0.9, lineHeight: 1 }} aria-hidden>
        {name}
      </span>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {shape}
    </svg>
  );
}
