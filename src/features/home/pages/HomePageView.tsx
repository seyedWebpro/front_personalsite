import { getTranslations } from "next-intl/server";

export default async function HomePageView() {
  const t = await getTranslations("pages.home");

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      <p className="mt-3 text-sm text-zinc-500">{t("lead")}</p>
    </main>
  );
}
