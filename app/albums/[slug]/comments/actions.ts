"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function submitComment(formData: FormData) {
  const supabase = await createClient();

  const albumId = cleanText(formData.get("album_id"));
  const albumSlug = cleanText(formData.get("album_slug"));
  const name = cleanText(formData.get("name"));
  const email = cleanText(formData.get("email")).toLowerCase();
  const content = cleanText(formData.get("content"));

  if (!albumId || !albumSlug) {
    redirect("/");
  }

  if (name.length < 2 || name.length > 100) {
    redirect(
      `/albums/${albumSlug}?comment_error=${encodeURIComponent(
        "Tên phải có từ 2 đến 100 ký tự."
      )}#comments`
    );
  }

  if (!isValidEmail(email)) {
    redirect(
      `/albums/${albumSlug}?comment_error=${encodeURIComponent(
        "Email không hợp lệ."
      )}#comments`
    );
  }

  if (content.length < 5) {
    redirect(
      `/albums/${albumSlug}?comment_error=${encodeURIComponent(
        "Nội dung bình luận phải có ít nhất 5 ký tự."
      )}#comments`
    );
  }

  if (content.length > 2000) {
    redirect(
      `/albums/${albumSlug}?comment_error=${encodeURIComponent(
        "Nội dung bình luận không được vượt quá 2.000 ký tự."
      )}#comments`
    );
  }

  const { error } = await supabase.from("comments").insert({
    album_id: albumId,
    name,
    email,
    content,
    status: "pending",
  });

  if (error) {
    console.error("Lỗi gửi bình luận:", error);

    redirect(
      `/albums/${albumSlug}?comment_error=${encodeURIComponent(
        "Không thể gửi bình luận. Vui lòng thử lại."
      )}#comments`
    );
  }

  revalidatePath(`/albums/${albumSlug}`);

  redirect(`/albums/${albumSlug}?comment_success=1#comments`);
}