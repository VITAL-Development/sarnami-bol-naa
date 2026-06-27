interface XPBarProps {
  xp: number;
}

export function XPBar({ xp }: XPBarProps) {
  return (
    <div className="flex items-center gap-1 font-semibold text-sarnami-700">
      <span aria-hidden>⭐</span>
      <span>{xp} XP</span>
    </div>
  );
}
