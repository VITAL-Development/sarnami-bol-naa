import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { faRoute, faRotate, faUser } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "@/components/ui/Icon";
import { t } from "@/i18n/t";
import { strings } from "@/i18n/strings.nl";

const navItems: { to: string; label: string; icon: IconProp }[] = [
  { to: "/", label: t("nav.path"), icon: faRoute },
  { to: "/review", label: t("nav.review"), icon: faRotate },
  { to: "/profile", label: t("nav.profile"), icon: faUser },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-cream-100 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-forest-700">{strings.appName}</h1>
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
