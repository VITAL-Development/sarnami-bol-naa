import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import { useContent } from "@/hooks/useContent";
import { useProgress } from "@/state/ProgressContext";
import { SkillNode } from "@/components/path/SkillNode";
import { HeartsBar } from "@/components/hud/HeartsBar";
import { XPBar } from "@/components/hud/XPBar";
import { StreakBadge } from "@/components/hud/StreakBadge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { t, useUiStrings } from "@/i18n/t";

export function HomePath() {
  useUiStrings(); // subscribes this component to UI-language changes; see t.ts
  const { bundle, isLoading } = useContent();
  const { progress } = useProgress();

  if (isLoading || !bundle) {
    return <p className="text-center text-stone-400">Laden...</p>;
  }

  const allLessons = bundle.units.flatMap((unit) => unit.lessons);

  if (bundle.units.length === 0) {
    return (
      <Card className="text-center">
        <Icon icon={faSeedling} className="text-3xl text-forest-600" aria-hidden />
        <h2 className="mt-3 text-xl font-bold text-stone-800">{t("path.title")}</h2>
        <p className="mt-2 text-stone-500">{t("path.noLessonsYet")}</p>
      </Card>
    );
  }

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
