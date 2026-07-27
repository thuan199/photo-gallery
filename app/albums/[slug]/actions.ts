"use server";
import { createClient } from "@/lib/supabase/server";
export async function loadMorePhotos(albumId: string, offset: number, limit = 30) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("photos").select("id,title,description,image_url,thumbnail_url,sort_order").eq("album_id", albumId).eq("is_published", true).order("sort_order", { ascending: true }).range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return data ?? [];
}
