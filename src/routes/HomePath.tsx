import { useContent } from "@/hooks/useContent";
import { useProgress } from "@/state/ProgressContext";
import { SkillNode } from "@/components/path/SkillNode";
import { HeartsBar } from "@/components/hud/HeartsBar";
import { XPBar } from "@/components/hud/XPBar";
import { StreakBadge } from "@/components/hud/StreakBadge";
import { t } from "@/i18n/t";

export function HomePath() {
  const { bundle, isLoading } = useContent();
  const { progress } = useProgress();

  if (isLoading || !bundle) {
    return <p className="text-center text-stone-400">Laden...</p>;
  }

  const unit = bundle.units[0];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <XPBar xp={progress.xp} />
        <StreakBadge count={progress.streak.count} />
        <HeartsBar hearts={progress.hearts.current} maxHearts={progress.hearts.max} />
      </div>
      <h2 className="mb-4 text-xl font-bold text-stone-800">{t("path.title")}</h2>
      <p className="mb-4 text-sm text-stone-500">{unit.title}</p>
      <div className="flex flex-col gap-3">
        {unit.lessons.map((lesson, index) => {
          const previousLesson = unit.lessons[index - 1];
          const locked = index > 0 && !progress.completedLessons[previousLesson.id];
          const completedEntry = progress.completedLessons[lesson.id];
          return (
            <SkillNode
              key={lesson.id}
              title={lesson.title}
              order={index + 1}
              locked={locked}
              completed={Boolean(completedEntry)}
              stars={completedEntry?.stars}
              lessonId={lesson.id}
            />
          );
        })}
      </div>
    </div>
  );
}
