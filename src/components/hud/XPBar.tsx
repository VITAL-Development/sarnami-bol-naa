import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/ui/Icon";

interface XPBarProps {
  xp: number;
}

export function XPBar({ xp }: XPBarProps) {
  return (
    <div className="flex items-center gap-1 font-semibold text-forest-700">
      <Icon icon={faStar} className="text-gold-400" aria-hidden />
      <span>{xp} XP</span>
    </div>
  );
}
