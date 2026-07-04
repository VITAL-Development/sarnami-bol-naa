import { faSeedling, faTrophy, faFire, faMedal } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useProgress } from "@/state/ProgressContext";
import { getAllBadgeDefinitions } from "@/data/badges";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { t, useUiStrings } from "@/i18n/t";

const badgeIconMap: Record<string, IconProp> = {
  seedling: faSeedling,
  trophy: faTrophy,
  fire: faFire,
  medal: faMedal,
};

export function Profile() {
  useUiStrings(); // subscribes this component to UI-language changes; see t.ts
  const { progress } = useProgress();
  const badges = getAllBadgeDefinitions();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{t("profile.title")}</h2>
      <Card className="flex justify-around text-center">
        <div>
          <p className="text-2xl font-bold text-forest-600">{progress.xp}</p>
          <p className="text-sm text-stone-500">{t("profile.xp")}</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gold-600">{progress.streak.count}</p>
          <p className="text-sm text-stone-500">{t("profile.streak")}</p>
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-semibold">{t("profile.badges")}</h3>
        {progress.earnedBadges.length === 0 ? (
          <p className="text-sm text-stone-500">{t("profile.noBadgesYet")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {badges
              .filter((b) => progress.earnedBadges.includes(b.id))
              .map((badge) => (
                <div key={badge.id} className="rounded-2xl border border-cream-100 p-3 text-center">
                  <Icon
                    icon={badgeIconMap[badge.icon] ?? faMedal}
                    className="text-2xl text-forest-600"
                  />
                  <p className="mt-1 text-sm font-semibold">{badge.title}</p>
                  <p className="text-xs text-stone-500">{badge.description}</p>
                </div>
              ))}
          </div>
        )}
      </Card>
    </div>
  );
}
