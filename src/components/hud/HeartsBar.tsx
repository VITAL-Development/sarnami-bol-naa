import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/ui/Icon";

interface HeartsBarProps {
  hearts: number;
  maxHearts: number;
}

export function HeartsBar({ hearts, maxHearts }: HeartsBarProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${hearts} levens over`}>
      {Array.from({ length: maxHearts }, (_, i) => (
        <Icon
          key={i}
          icon={faHeart}
          className={i < hearts ? "text-flame-600" : "text-stone-200"}
        />
      ))}
    </div>
  );
}
