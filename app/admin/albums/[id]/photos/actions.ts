"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPhoto(formData: FormData) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    redirect("/admin/login");
  }

  const albumId = String(formData.get("album_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const thumbnailUrl = String(
    formData.get("thumbnail_url") ?? ""
  ).trim();
  const flickrPageUrl = String(
    formData.get("flickr_page_url") ?? ""
  ).trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
  const sortOrderValue = String(
    formData.get("sort_order") ?? "0"
  );
  const isPublished = formData.get("is_published") === "on";

  if (!albumId) {
    redirect("/admin/albums?error=album-khong-hop-le");
  }

  if (!imageUrl) {
    redirect(
      `/admin/albums/${albumId}/photos?error=chua-nhap-link-anh`
    );
  }

  const sortOrder = Number.parseInt(sortOrderValue, 10);

  const { error } = await supabase.from("photos").insert({
    album_id: albumId,
    title: title || null,
    description: description || null,
    image_url: imageUrl,
    thumbnail_url: thumbnailUrl || imageUrl,
    flickr_page_url: flickrPageUrl || null,
    sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
    is_published: isPublished,
  });

  if (error) {
    redirect(
      `/admin/albums/${albumId}/photos?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath(`/admin/albums/${albumId}/photos`);
  revalidatePath(`/albums`);

  redirect(`/admin/albums/${albumId}/photos?created=true`);
}

export async function deletePhoto(formData: FormData) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    redirect("/admin/login");
  }

  const photoId = String(formData.get("photo_id") ?? "");
  const albumId = String(formData.get("album_id") ?? "");

  if (!photoId || !albumId) {
    redirect("/admin/albums?error=du-lieu-anh-khong-hop-le");
  }

  const { error } = await supabase
    .from("photos")
    .delete()
    .eq("id", photoId)
    .eq("album_id", albumId);

  if (error) {
    redirect(
      `/admin/albums/${albumId}/photos?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath(`/admin/albums/${albumId}/photos`);

  redirect(`/admin/albums/${albumId}/photos?deleted=true`);
}

export async function updatePhoto(formData: FormData) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    redirect("/admin/login");
  }

  const albumId = String(formData.get("album_id") ?? "");
  const photoId = String(formData.get("photo_id") ?? "");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const imageUrl = String(
    formData.get("image_url") ?? ""
  ).trim();

  const thumbnailUrl = String(
    formData.get("thumbnail_url") ?? ""
  ).trim();

  const flickrPageUrl = String(
    formData.get("flickr_page_url") ?? ""
  ).trim();

  const sortOrderValue = String(
    formData.get("sort_order") ?? "0"
  );

  const isPublished =
    formData.get("is_published") === "on";

  if (!albumId || !photoId) {
    redirect("/admin/photos?error=du-lieu-anh-khong-hop-le");
  }

  if (!imageUrl) {
    redirect(
      `/admin/albums/${albumId}/photos/${photoId}/edit?error=chua-nhap-link-anh`
    );
  }

  const sortOrder = Number.parseInt(sortOrderValue, 10);

  const { error } = await supabase
    .from("photos")
    .update({
      title: title || null,
      description: description || null,
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl || imageUrl,
      flickr_page_url: flickrPageUrl || null,
      sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
      is_published: isPublished,
    })
    .eq("id", photoId)
    .eq("album_id", albumId);

  if (error) {
    redirect(
      `/admin/albums/${albumId}/photos/${photoId}/edit?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath(`/admin/albums/${albumId}/photos`);
  revalidatePath("/admin/photos");

  redirect(`/admin/albums/${albumId}/photos?updated=true`);
}



