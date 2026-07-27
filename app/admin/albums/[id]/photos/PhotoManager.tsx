"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deletePhoto, setAlbumCover, updatePhotoOrder } from "./actions";

export type AdminPhoto = {
  id: string; title: string | null; description: string | null; image_url: string;
  thumbnail_url: string | null; flickr_page_url: string | null; sort_order: number; is_published: boolean;
};

export default function PhotoManager({ albumId, photos }: { albumId: string; photos: AdminPhoto[] }) {
  const [items, setItems] = useState(photos);
  const [dragId, setDragId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function dropOn(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...items];
    const from = next.findIndex((item) => item.id === dragId);
    const to = next.findIndex((item) => item.id === targetId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDragId(null);
    startTransition(async () => {
      try { await updatePhotoOrder(albumId, next.map((item) => item.id)); setMessage("Đã lưu thứ tự ảnh."); }
      catch (error) { setItems(items); setMessage(error instanceof Error ? error.message : "Không thể lưu thứ tự."); }
    });
  }

  function chooseCover(photoId: string) {
    startTransition(async () => {
      try { await setAlbumCover(albumId, photoId); setMessage("Đã đặt làm ảnh bìa."); }
      catch (error) { setMessage(error instanceof Error ? error.message : "Không thể đặt ảnh bìa."); }
    });
  }

  if (items.length === 0) return <div className="rounded-3xl border border-dashed p-12 text-center">Album chưa có ảnh.</div>;

  return <div>
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="text-sm text-neutral-500">Kéo thẻ ảnh để sắp xếp. Thứ tự được lưu tự động.</p>
      <span className="text-sm text-emerald-600">{pending ? "Đang lưu..." : message}</span>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((photo, index) => <article key={photo.id} draggable onDragStart={() => setDragId(photo.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => dropOn(photo.id)} className={`overflow-hidden rounded-3xl border bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900 ${dragId === photo.id ? "opacity-40" : ""}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
          <img src={photo.thumbnail_url || photo.image_url} alt={photo.title || "Ảnh album"} loading="lazy" draggable={false} className="h-full w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">↕ {index + 1}</span>
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">{photo.is_published ? "Công khai" : "Ẩn"}</span>
        </div>
        <div className="p-5">
          <h3 className="truncate text-lg font-bold">{photo.title || "Chưa có tiêu đề"}</h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href={`/admin/albums/${albumId}/photos/${photo.id}/edit`} className="rounded-xl bg-neutral-900 px-3 py-2 text-center text-sm font-semibold text-white dark:bg-white dark:text-black">Chỉnh sửa</Link>
            <button type="button" onClick={() => chooseCover(photo.id)} className="rounded-xl border px-3 py-2 text-sm font-semibold dark:border-white/15">Đặt ảnh bìa</button>
          </div>
          <form action={deletePhoto} className="mt-2">
            <input type="hidden" name="photo_id" value={photo.id}/><input type="hidden" name="album_id" value={albumId}/>
            <button className="w-full rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 dark:border-red-500/30">Xóa ảnh</button>
          </form>
        </div>
      </article>)}
    </div>
  </div>;
}
