import { AuthFrame } from "@/components/auth/auth-frame";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "FrS Finance · Criar conta",
};

export default function RegisterPage() {
  return (
    <AuthFrame>
      <RegisterForm />
    </AuthFrame>
  );
}
