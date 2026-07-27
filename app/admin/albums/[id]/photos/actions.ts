"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";

function refreshAlbum(albumId: string) {
  revalidatePath(`/admin/albums/${albumId}/photos`);
  revalidatePath("/admin/photos");
  revalidatePath("/");
  revalidatePath("/albums", "layout");
}

function cleanLines(value: string) {
  return Array.from(new Set(value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)));
}

function normalizeFlickrUrl(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/["'<>),;]+$/g, "")
    .trim();
}

function isFlickrImageUrl(value: string) {
  return /^https:\/\/live\.staticflickr\.com\/.+\.(?:jpe?g|png|webp)(?:\?.*)?$/i.test(value);
}

function flickrVariant(url: string, size: "thumbnail" | "large") {
  const clean = url.split("?")[0];
  const suffix = size === "thumbnail" ? "_n" : "_b";
  return clean.replace(/(?:_[sqtmnzwcbhko])?(\.(?:jpe?g|png|webp))$/i, `${suffix}$1`);
}

function extractFlickrUrls(value: string) {
  const decoded = value.replace(/\\\//g, "/");
  const matches = decoded.match(/https:\/\/live\.staticflickr\.com\/[A-Za-z0-9_\-/.?=&%]+/gi) ?? [];
  const normalized = matches.map(normalizeFlickrUrl).filter(isFlickrImageUrl);

  // Cùng một ảnh có thể xuất hiện nhiều kích thước trong HTML Flickr.
  // Quy về ảnh lớn trước khi loại trùng.
  return Array.from(new Set(normalized.map((url) => flickrVariant(url, "large"))));
}

export async function createPhoto(formData: FormData) {
  const { supabase } = await requireAdmin();
  const albumId = String(formData.get("album_id") ?? "");
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  if (!albumId || !imageUrl) redirect(`/admin/albums/${albumId}/photos?error=chua-nhap-link-anh`);

  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);
  const { error } = await supabase.from("photos").insert({
    album_id: albumId,
    title: String(formData.get("title") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    image_url: imageUrl,
    thumbnail_url: String(formData.get("thumbnail_url") ?? "").trim() || imageUrl,
    flickr_page_url: String(formData.get("flickr_page_url") ?? "").trim() || null,
    sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
    is_published: formData.get("is_published") === "on",
  });
  if (error) redirect(`/admin/albums/${albumId}/photos?error=${encodeURIComponent(error.message)}`);
  refreshAlbum(albumId);
  redirect(`/admin/albums/${albumId}/photos?created=true`);
}

export async function createPhotosBulk(formData: FormData) {
  const { supabase } = await requireAdmin();
  const albumId = String(formData.get("album_id") ?? "");
  const urls = cleanLines(String(formData.get("urls") ?? ""));
  if (!albumId || urls.length === 0) redirect(`/admin/albums/${albumId}/photos?error=chua-nhap-link-anh`);

  const { data: last } = await supabase.from("photos").select("sort_order").eq("album_id", albumId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const start = (last?.sort_order ?? -1) + 1;
  const rows = urls.map((url, index) => ({
    album_id: albumId,
    title: `Ảnh ${start + index + 1}`,
    image_url: isFlickrImageUrl(url) ? flickrVariant(url, "large") : url,
    thumbnail_url: isFlickrImageUrl(url) ? flickrVariant(url, "thumbnail") : url,
    sort_order: start + index,
    is_published: true,
  }));
  const { error } = await supabase.from("photos").insert(rows);
  if (error) redirect(`/admin/albums/${albumId}/photos?error=${encodeURIComponent(error.message)}`);
  refreshAlbum(albumId);
  redirect(`/admin/albums/${albumId}/photos?bulk=${rows.length}`);
}

export async function importFlickrHtml(formData: FormData) {
  const { supabase } = await requireAdmin();
  const albumId = String(formData.get("album_id") ?? "");
  const html = String(formData.get("flickr_html") ?? "");
  const urls = extractFlickrUrls(html);

  if (!albumId || urls.length === 0) {
    redirect(`/admin/albums/${albumId}/photos?error=khong-tim-thay-link-flickr`);
  }

  const { data: last } = await supabase
    .from("photos")
    .select("sort_order")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const start = (last?.sort_order ?? -1) + 1;
  const rows = urls.map((imageUrl, index) => ({
    album_id: albumId,
    title: `Ảnh ${start + index + 1}`,
    image_url: imageUrl,
    thumbnail_url: flickrVariant(imageUrl, "thumbnail"),
    sort_order: start + index,
    is_published: true,
  }));

  const { error } = await supabase.from("photos").insert(rows);
  if (error) redirect(`/admin/albums/${albumId}/photos?error=${encodeURIComponent(error.message)}`);

  refreshAlbum(albumId);
  redirect(`/admin/albums/${albumId}/photos?flickrHtml=${rows.length}`);
}

export async function updatePhotoOrder(albumId: string, orderedIds: string[]) {
  const { supabase } = await requireAdmin();
  for (let index = 0; index < orderedIds.length; index += 1) {
    const { error } = await supabase.from("photos").update({ sort_order: index }).eq("id", orderedIds[index]).eq("album_id", albumId);
    if (error) throw new Error(error.message);
  }
  refreshAlbum(albumId);
  return { ok: true };
}

export async function setAlbumCover(albumId: string, photoId: string) {
  const { supabase } = await requireAdmin();
  const { data: photo, error: photoError } = await supabase.from("photos").select("image_url, thumbnail_url").eq("id", photoId).eq("album_id", albumId).single();
  if (photoError || !photo) throw new Error(photoError?.message ?? "Không tìm thấy ảnh");
  const { error } = await supabase.from("albums").update({ cover_url: photo.thumbnail_url || photo.image_url }).eq("id", albumId);
  if (error) throw new Error(error.message);
  refreshAlbum(albumId);
  return { ok: true };
}

export async function deletePhoto(formData: FormData) {
  const { supabase } = await requireAdmin();
  const photoId = String(formData.get("photo_id") ?? "");
  const albumId = String(formData.get("album_id") ?? "");
  const { error } = await supabase.from("photos").delete().eq("id", photoId).eq("album_id", albumId);
  if (error) redirect(`/admin/albums/${albumId}/photos?error=${encodeURIComponent(error.message)}`);
  refreshAlbum(albumId);
  redirect(`/admin/albums/${albumId}/photos?deleted=true`);
}

export async function updatePhoto(formData: FormData) {
  const { supabase } = await requireAdmin();
  const albumId = String(formData.get("album_id") ?? "");
  const photoId = String(formData.get("photo_id") ?? "");
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  if (!imageUrl) redirect(`/admin/albums/${albumId}/photos/${photoId}/edit?error=chua-nhap-link-anh`);
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);
  const { error } = await supabase.from("photos").update({
    title: String(formData.get("title") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    image_url: imageUrl,
    thumbnail_url: String(formData.get("thumbnail_url") ?? "").trim() || imageUrl,
    flickr_page_url: String(formData.get("flickr_page_url") ?? "").trim() || null,
    sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
    is_published: formData.get("is_published") === "on",
  }).eq("id", photoId).eq("album_id", albumId);
  if (error) redirect(`/admin/albums/${albumId}/photos/${photoId}/edit?error=${encodeURIComponent(error.message)}`);
  refreshAlbum(albumId);
  redirect(`/admin/albums/${albumId}/photos?updated=true`);
}
