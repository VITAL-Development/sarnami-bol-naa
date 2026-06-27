import { t } from "@/i18n/t";

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-1 font-semibold text-orange-600">
      <span aria-hidden>🔥</span>
      <span>
        {count} {t("profile.streak")}
      </span>
    </div>
  );
}
