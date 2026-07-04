import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { faRoute, faRotate, faUser, faGear } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "@/components/ui/Icon";
import { LanguagePicker } from "@/components/layout/LanguagePicker";
import { useContent } from "@/hooks/useContent";
import { useBranding } from "@/hooks/useBranding";
import { t, useUiStrings } from "@/i18n/t";

export function AppShell({ children }: { children: ReactNode }) {
  useUiStrings(); // subscribes this component to UI-language changes; see t.ts

  // Only used here to drive the LanguagePicker's loading spinner while a
  // newly-selected learning language's content is (re)fetched — the actual
  // content bundle used to render each route is fetched independently by
  // that route's own `useContent()` call (no shared cache layer yet).
  const { isLoading } = useContent();

  // Fetches the active learning language's `branding` (colors/app name/
  // favicon, issue #62) and applies it to `document` as a side effect — see
  // src/hooks/useBranding.ts for why this is a separate hook/effect from
  // useContent above. Renders nothing; called here purely for its effect,
  // high enough in the tree to run once per learning-language change
  // regardless of which route is active.
  useBranding();

  // Built inside the component (not at module scope, as it was before #36) so
  // the labels re-render when the active UI language changes.
  const navItems: { to: string; label: string; icon: IconProp }[] = [
    { to: "/", label: t("nav.path"), icon: faRoute },
    { to: "/review", label: t("nav.review"), icon: faRotate },
    { to: "/profile", label: t("nav.profile"), icon: faUser },
    { to: "/settings", label: t("nav.settings"), icon: faGear },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-cream-100 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-forest-700">{t("appName")}</h1>
        <LanguagePicker isLoading={isLoading} />
      </header>
      <main className="flex-1 px-4 py-6 pb-24">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 flex border-t border-cream-100 bg-white">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-sm active:opacity-75 ${
                isActive ? "text-forest-600" : "text-stone-400"
              }`
            }
          >
            <Icon icon={item.icon} className="text-xl" aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
