import { strings } from "./strings.nl";

type Strings = typeof strings;

type DotPaths<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`;
    }[keyof T & string]
  : never;

export type TranslationKey = DotPaths<Strings>;

/** Single-locale lookup helper today; swap implementation for i18next-style locale switching later without changing call sites. */
export function t(key: TranslationKey): string {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = strings;
  for (const part of parts) {
    value = value?.[part];
  }
  return typeof value === "string" ? value : key;
}
