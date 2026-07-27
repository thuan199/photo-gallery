"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";


function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createAlbum(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const customSlug = String(formData.get("slug") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const sortOrderValue = String(
    formData.get("sort_order") ?? "0"
  );
  const isPublished = formData.get("is_published") === "on";

  if (title.length < 2) {
    redirect(
      "/admin/albums/new?error=ten-album-phai-co-it-nhat-2-ky-tu"
    );
  }

  const slug = createSlug(customSlug || title);
  const sortOrder = Number.parseInt(sortOrderValue, 10);

  if (!slug) {
    redirect("/admin/albums/new?error=slug-khong-hop-le");
  }

  const { error } = await supabase.from("albums").insert({
    title,
    slug,
    description: description || null,
    cover_url: coverUrl || null,
    sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
    is_published: isPublished,
  });

  if (error) {
    if (error.code === "23505") {
      redirect("/admin/albums/new?error=slug-da-ton-tai");
    }

    redirect(
      `/admin/albums/new?error=${encodeURIComponent(error.message)}`
    );
  }

  

  revalidatePath("/");
  revalidatePath("/admin/albums");

  redirect("/admin/albums?created=true");
}

export async function updateAlbum(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const customSlug = String(formData.get("slug") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const sortOrderValue = String(
    formData.get("sort_order") ?? "0"
  );
  const isPublished = formData.get("is_published") === "on";

  if (!id) {
    redirect("/admin/albums?error=album-khong-hop-le");
  }

  if (title.length < 2) {
    redirect(
      `/admin/albums/${id}/edit?error=ten-album-phai-co-it-nhat-2-ky-tu`
    );
  }

  const slug = createSlug(customSlug || title);
  const sortOrder = Number.parseInt(sortOrderValue, 10);

  if (!slug) {
    redirect(`/admin/albums/${id}/edit?error=slug-khong-hop-le`);
  }

  const { error } = await supabase
    .from("albums")
    .update({
      title,
      slug,
      description: description || null,
      cover_url: coverUrl || null,
      sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      redirect(`/admin/albums/${id}/edit?error=slug-da-ton-tai`);
    }

    redirect(
      `/admin/albums/${id}/edit?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/albums");
  revalidatePath(`/admin/albums/${id}/edit`);

  redirect("/admin/albums?updated=true");
}

export async function deleteAlbum(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/albums?error=album-khong-hop-le");
  }

  const { error } = await supabase
    .from("albums")
    .delete()
    .eq("id", id);

  if (error) {
    redirect(
      `/admin/albums?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/albums");

  redirect("/admin/albums?deleted=true");
}
export async function updateAlbumOrder(orderedIds: string[]) {
  const { supabase } = await requireAdmin();
  for (let index = 0; index < orderedIds.length; index += 1) {
    const { error } = await supabase.from("albums").update({ sort_order: index }).eq("id", orderedIds[index]);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/");
  revalidatePath("/admin/albums");
  return { ok: true };
}
