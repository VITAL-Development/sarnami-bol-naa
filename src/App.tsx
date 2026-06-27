import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProgressProvider } from "@/state/ProgressContext";
import { AppShell } from "@/components/layout/AppShell";
import { HomePath } from "@/routes/HomePath";
import { Lesson } from "@/routes/Lesson";
import { Review } from "@/routes/Review";
import { Profile } from "@/routes/Profile";
import { NotFound } from "@/routes/NotFound";

export function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePath />} />
            <Route path="/lesson/:lessonId" element={<Lesson />} />
            <Route path="/review" element={<Review />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ProgressProvider>
  );
}
