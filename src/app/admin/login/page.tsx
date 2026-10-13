import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = { title: "Owner Sign In | Dashboard" };

export default function AdminLoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Owner sign in"
        description="A private area for managing event enquiries and portfolio content."
      />
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-md rounded-3xl border border-bronze/20 bg-white p-8 shadow-soft sm:p-10">
          <LoginForm />
        </div>
      </Container>
    </>
  );
}