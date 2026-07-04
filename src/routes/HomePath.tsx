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

  const allLessons = bundle.units.flatMap((unit) => unit.lessons);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <XPBar xp={progress.xp} />
        <StreakBadge count={progress.streak.count} />
        <HeartsBar hearts={progress.hearts.current} maxHearts={progress.hearts.max} />
      </div>
      <h2 className="mb-4 text-xl font-bold text-stone-800">{t("path.title")}</h2>
      {bundle.units.map((unit) => (
        <div key={unit.id} className="mb-6">
          <p className="mb-4 text-sm text-stone-500">{unit.title}</p>
          <div className="flex flex-col gap-3">
            {unit.lessons.map((lesson) => {
              const globalIndex = allLessons.findIndex((l) => l.id === lesson.id);
              const previousLesson = allLessons[globalIndex - 1];
              const locked = globalIndex > 0 && !progress.completedLessons[previousLesson.id];
              const completedEntry = progress.completedLessons[lesson.id];
              return (
                <SkillNode
                  key={lesson.id}
                  title={lesson.title}
                  order={lesson.order}
                  locked={locked}
                  completed={Boolean(completedEntry)}
                  stars={completedEntry?.stars}
                  lessonId={lesson.id}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
// scratch test comment 1783172865
