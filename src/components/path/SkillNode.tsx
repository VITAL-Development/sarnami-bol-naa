import { Link } from "react-router-dom";
import { faLock, faStar } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@/components/ui/Icon";

interface SkillNodeProps {
  title: string;
  order: number;
  locked: boolean;
  completed: boolean;
  stars?: number;
  lessonId: string;
}

export function SkillNode({ title, order, locked, completed, stars, lessonId }: SkillNodeProps) {
  const content = (
    <div
      className={`flex min-h-[44px] w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition ${
        locked
          ? "border-stone-200 bg-stone-50 text-stone-400"
          : completed
            ? "border-forest-400 bg-forest-50 text-forest-700"
            : "border-forest-400 bg-white text-forest-700 shadow-sm hover:bg-forest-50 active:bg-forest-50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
          locked ? "bg-stone-200 text-stone-400" : completed ? "bg-forest-500 text-white" : "bg-forest-600 text-white"
        }`}
      >
        {locked ? <Icon icon={faLock} /> : order}
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {completed && stars !== undefined && (
          <p className="flex gap-0.5 text-sm">
            {Array.from({ length: 3 }, (_, i) => (
              <Icon
                key={i}
                icon={faStar}
                className={i < stars ? "text-gold-400" : "text-stone-200"}
              />
            ))}
          </p>
        )}
      </div>
    </div>
  );

  if (locked) return content;

  return (
    <Link to={`/lesson/${lessonId}`} className="block">
      {content}
    </Link>
  );
}
