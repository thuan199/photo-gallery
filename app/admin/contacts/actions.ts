"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";

export async function markContactAsRead(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const { error } = await supabase
    .from("contacts")
    .update({
      is_read: true,
    })
    .eq("id", id);

  if (error) {
    console.error("Lỗi đánh dấu liên hệ đã đọc:", error);
    return;
  }

  revalidatePath("/admin/contacts");
}

export async function markContactAsUnread(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const { error } = await supabase
    .from("contacts")
    .update({
      is_read: false,
    })
    .eq("id", id);

  if (error) {
    console.error("Lỗi đánh dấu liên hệ chưa đọc:", error);
    return;
  }

  revalidatePath("/admin/contacts");
}

export async function deleteContact(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Lỗi xóa liên hệ:", error);
    return;
  }

  revalidatePath("/admin/contacts");
}