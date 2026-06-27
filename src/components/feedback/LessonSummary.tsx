import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { t } from "@/i18n/t";

interface LessonSummaryProps {
  passed: boolean;
  xpEarned: number;
  onBackToPath: () => void;
  onRetry: () => void;
}

export function LessonSummary({ passed, xpEarned, onBackToPath, onRetry }: LessonSummaryProps) {
  return (
    <Card className="text-center">
      <p className="text-4xl">{passed ? "🎉" : "💔"}</p>
      <h2 className="mt-2 text-2xl font-bold">
        {passed ? t("lesson.lessonComplete") : t("lesson.lessonFailed")}
      </h2>
      {passed && (
        <p className="mt-2 text-lg font-semibold text-sarnami-600">
          +{xpEarned} {t("lesson.xpEarned")}
        </p>
      )}
      <div className="mt-6 flex justify-center gap-3">
        {!passed && <Button variant="secondary" onClick={onRetry}>{t("lesson.tryAgain")}</Button>}
        <Button onClick={onBackToPath}>{t("lesson.backToPath")}</Button>
      </div>
    </Card>
  );
}
