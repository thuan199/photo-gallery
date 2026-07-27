"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const allowedReactionTypes = [
  "like",
  "love",
  "laugh",
  "wow",
  "sad",
] as const;

type ReactionType = (typeof allowedReactionTypes)[number];

function isReactionType(value: string): value is ReactionType {
  return allowedReactionTypes.includes(value as ReactionType);
}

export async function toggleCommentReaction(formData: FormData) {
  const commentId = String(formData.get("comment_id") ?? "").trim();
  const albumSlug = String(formData.get("album_slug") ?? "").trim();
  const reactionType = String(
    formData.get("reaction_type") ?? ""
  ).trim();

  if (!commentId || !albumSlug || !isReactionType(reactionType)) {
    return;
  }

  const cookieStore = await cookies();

  let visitorId = cookieStore.get("comment_visitor_id")?.value;

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    cookieStore.set("comment_visitor_id", visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const supabase = await createClient();

  const { data: existingReaction, error: findError } = await supabase
    .from("comment_reactions")
    .select("id")
    .eq("comment_id", commentId)
    .eq("reaction_type", reactionType)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (findError) {
    console.error("Lỗi kiểm tra cảm xúc:", findError);
    return;
  }

  if (existingReaction) {
    const { error: deleteError } = await supabase
      .from("comment_reactions")
      .delete()
      .eq("id", existingReaction.id)
      .eq("visitor_id", visitorId);

    if (deleteError) {
      console.error("Lỗi xóa cảm xúc:", deleteError);
      return;
    }
  } else {
    const { error: insertError } = await supabase
      .from("comment_reactions")
      .insert({
        comment_id: commentId,
        reaction_type: reactionType,
        visitor_id: visitorId,
      });

    if (insertError) {
      console.error("Lỗi thêm cảm xúc:", insertError);
      return;
    }
  }

  revalidatePath(`/albums/${albumSlug}`);
}