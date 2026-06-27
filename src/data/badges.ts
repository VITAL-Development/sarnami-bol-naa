import type { Badge, UserProgress } from "@/domain/types";

interface BadgeDefinition extends Badge {
  predicate: (progress: UserProgress) => boolean;
}

const badgeDefinitions: BadgeDefinition[] = [
  {
    id: "first-lesson",
    title: "Eerste stap",
    description: "Je hebt je eerste les voltooid.",
    icon: "🌱",
    predicate: (p) => Object.keys(p.completedLessons).length >= 1,
  },
  {
    id: "unit-1-complete",
    title: "Basis gelegd",
    description: "Je hebt alle lessen van Eenheid 1 voltooid.",
    icon: "🏆",
    predicate: (p) => Object.keys(p.completedLessons).length >= 5,
  },
  {
    id: "streak-3",
    title: "Volhouder",
    description: "3 dagen op rij geoefend.",
    icon: "🔥",
    predicate: (p) => p.streak.count >= 3,
  },
  {
    id: "perfect-lesson",
    title: "Foutloos",
    description: "Een les voltooid zonder fouten.",
    icon: "✨",
    predicate: (p) => Object.values(p.completedLessons).some((l) => l.stars === 3),
  },
];

export function evaluateBadges(progress: UserProgress): string[] {
  return badgeDefinitions.filter((b) => b.predicate(progress)).map((b) => b.id);
}

export function getAllBadgeDefinitions(): Badge[] {
  return badgeDefinitions.map(({ id, title, description, icon }) => ({ id, title, description, icon }));
}
