"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = ["pending", "approved", "rejected"] as const;

type CommentStatus = (typeof allowedStatuses)[number];

function isCommentStatus(value: string): value is CommentStatus {
  return allowedStatuses.includes(value as CommentStatus);
}

async function checkAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/admin/login");
  }

  return supabase;
}

export async function updateCommentStatus(formData: FormData) {
  const supabase = await checkAdmin();

  const commentId = String(formData.get("comment_id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!commentId || !isCommentStatus(status)) {
    return;
  }

  const { error } = await supabase
    .from("comments")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId);

  if (error) {
    console.error("Lỗi cập nhật trạng thái bình luận:", error);
    return;
  }

  revalidatePath("/admin/comments");
}

export async function deleteComment(formData: FormData) {
  const supabase = await checkAdmin();

  const commentId = String(formData.get("comment_id") ?? "").trim();

  if (!commentId) {
    return;
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Lỗi xóa bình luận:", error);
    return;
  }

  revalidatePath("/admin/comments");
}