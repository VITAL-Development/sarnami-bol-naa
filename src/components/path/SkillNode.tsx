import { Link } from "react-router-dom";

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
      className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition ${
        locked
          ? "border-stone-200 bg-stone-50 text-stone-400"
          : completed
            ? "border-green-400 bg-green-50 text-green-700"
            : "border-sarnami-400 bg-white text-sarnami-700 shadow-sm hover:bg-sarnami-50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
          locked ? "bg-stone-200" : completed ? "bg-green-400 text-white" : "bg-sarnami-500 text-white"
        }`}
      >
        {locked ? "🔒" : order}
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {completed && stars !== undefined && (
          <p className="text-sm">{"★".repeat(stars)}{"☆".repeat(3 - stars)}</p>
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
