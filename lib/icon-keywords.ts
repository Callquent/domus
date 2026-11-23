// Mots-clés (français) associés à chaque pictogramme de components/Icon.tsx.
// Les accents, majuscules et tirets sont ignorés ; pluriels et saisie en cours sont gérés.
const RAW: Record<string, string[]> = {
  aspirateur: ["aspirateur", "aspirer", "aspi", "robot aspirateur", "poussière"],
  balai: ["balai", "balayer", "balayage", "brosse"],
  seau: ["seau", "serpillière", "vadrouille", "sol", "sols", "parquet", "carrelage"],
  "lave-linge": ["lave-linge", "machine à laver", "lessive"],
  "seche-linge": ["sèche-linge", "sèche", "séchoir"],
  "lave-vaisselle": ["lave-vaisselle", "vaisselle"],
  lit: ["lit", "couette", "matelas", "oreiller"],
  draps: ["drap", "draps", "literie", "housse de couette", "taie"],
  "panier-linge": ["panière", "panier", "linge sale", "corbeille"],
  repassage: ["repassage", "repasser", "fer à repasser", "planche à repasser", "table de repassage"],
  cintre: ["ranger", "vêtement", "vêtements", "habits", "armoire", "dressing", "cintre", "penderie"],
  frigo: ["frigo", "réfrigérateur", "frigidaire", "glacière"],
  congelateur: ["congélateur", "congel", "surgelé", "surgelés", "glace"],
  four: ["four", "fours"],
  "micro-onde": ["micro-onde", "micro-ondes", "microonde", "micro"],
  plaque: ["plaque", "plaques", "cuisson", "cuisinière", "hotte"],
  evier: ["évier", "éviers"],
  table: ["table", "mettre la table", "ranger la table", "débarrasser", "couvert", "couverts", "repas"],
  "sac-poubelle": ["sac poubelle", "poubelle", "poubelles", "déchets", "ordures", "tri", "recyclage"],
  douche: ["douche", "doucher", "shampoing"],
  baignoire: ["baignoire", "bain", "baigner"],
  lavabo: ["lavabo", "vasque", "robinet", "lave-mains"],
  toilettes: ["toilette", "toilettes", "wc", "cuvette"],
  canape: ["canapé", "sofa", "divan"],
  fauteuil: ["fauteuil", "chaise", "siège"],
  vitre: ["vitre", "vitres", "vitrage", "miroir"],
  fenetre: ["fenêtre", "fenêtres", "baie vitrée"],
  store: ["store", "stores", "volet", "volets", "rideau", "rideaux"],
  air: ["aérer", "aération", "air", "ventiler", "ventilation"],
  voiture: ["voiture", "auto", "automobile"],
  tondeuse: ["tondeuse", "tondre", "pelouse", "gazon"],
  plante: ["plante", "plantes", "arroser", "arrosage", "fleur", "fleurs", "jardin", "potager"],
  spray: ["spray", "désinfecter", "désinfectant", "produit", "nettoyant", "nettoyer", "dépoussiérer"],
  lunettes: ["lunette", "lunettes", "verres", "optique"],
  garage: ["garage", "cave", "box", "atelier", "abri"],
  ampoule: ["éclairage", "ampoule", "ampoules", "lampe", "lumière", "lumières", "luminaire", "spot", "plafonnier"],
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const KEYWORDS = Object.entries(RAW).flatMap(([icon, kws]) =>
  kws.map((kw) => ({ icon, kw: normalize(kw) }))
);

/** Propose le pictogramme le plus adapté au texte saisi, ou null si rien ne correspond. */
export function suggestIcon(input: string): string | null {
  const text = normalize(input);
  if (text.length < 3) return null;

  const words = text.split(" ");
  const padded = ` ${text}`;
  let best: { icon: string; score: number } | null = null;

  for (const { icon, kw } of KEYWORDS) {
    let score = 0;

    if (kw.includes(" ")) {
      // Expression complète (ex. « ranger la table ») : priorité maximale
      if (padded.includes(` ${kw}`)) score = 200 + kw.length;
    } else {
      for (const w of words) {
        let s = 0;
        if (w === kw) s = 100 + kw.length;
        else if (kw.length >= 5 && w.startsWith(kw)) s = 80 + kw.length; // pluriels, dérivés
        else if (w.length >= 3 && kw.length > w.length && kw.startsWith(w)) s = 20 + w.length; // saisie en cours
        score = Math.max(score, s);
      }
    }

    if (score > 0 && (!best || score > best.score)) best = { icon, score };
  }

  return best ? best.icon : null;
}
