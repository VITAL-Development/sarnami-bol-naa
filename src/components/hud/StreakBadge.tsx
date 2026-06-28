import { faFire } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/i18n/t";

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-1 font-semibold text-gold-600">
      <Icon icon={faFire} className="text-gold-400" aria-hidden />
      <span>
        {count} {t("profile.streak")}
      </span>
    </div>
  );
}
