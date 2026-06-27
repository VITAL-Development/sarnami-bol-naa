import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { t } from "@/i18n/t";
import { strings } from "@/i18n/strings.nl";

const navItems = [
  { to: "/", label: t("nav.path"), icon: "🧭" },
  { to: "/review", label: t("nav.review"), icon: "🔁" },
  { to: "/profile", label: t("nav.profile"), icon: "👤" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-sarnami-100 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-sarnami-700">{strings.appName}</h1>
      </header>
      <main className="flex-1 px-4 py-6 pb-24">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 flex border-t border-sarnami-100 bg-white">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2 text-sm ${
                isActive ? "text-sarnami-600" : "text-stone-400"
              }`
            }
          >
            <span className="text-xl" aria-hidden>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
