import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/admin/login");
  }

  const email =
    typeof data.claims.email === "string"
      ? data.claims.email.toLowerCase()
      : "";

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    console.error("Chưa cấu hình biến môi trường ADMIN_EMAIL.");
    redirect("/");
  }

  if (email !== adminEmail) {
    redirect("/");
  }

  return {
    supabase,
    claims: data.claims,
    email,
  };
}