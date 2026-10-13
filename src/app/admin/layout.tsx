import { redirect } from "next/navigation";
import { getOwnerSession } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getOwnerSession();

  if (!session.configured) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-serif text-4xl text-deep">Dashboard is not configured</h1>
        <p className="mt-4 leading-relaxed text-charcoal-soft">
          Connect a Supabase project (environment variables, auth and roles) to
          enable the owner dashboard. The public website works fine without it.
        </p>
      </div>
    );
  }

  if (session.forbidden || !session.user) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}