interface HeartsBarProps {
  hearts: number;
  maxHearts: number;
}

export function HeartsBar({ hearts, maxHearts }: HeartsBarProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${hearts} levens over`}>
      {Array.from({ length: maxHearts }, (_, i) => (
        <span key={i} className={i < hearts ? "text-red-500" : "text-stone-200"}>
          ♥
        </span>
      ))}
    </div>
  );
}
