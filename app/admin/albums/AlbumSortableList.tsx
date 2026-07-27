"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteAlbum, updateAlbumOrder } from "./actions";

export type SortableAlbum = { id: string; title: string; slug: string; description: string | null; is_published: boolean; sort_order: number; created_at: string };
export default function AlbumSortableList({ albums }: { albums: SortableAlbum[] }) {
  const [items, setItems] = useState(albums);
  const [dragId, setDragId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function drop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...items];
    const from = next.findIndex((x) => x.id === dragId), to = next.findIndex((x) => x.id === targetId);
    const [moved] = next.splice(from, 1); next.splice(to, 0, moved); setItems(next); setDragId(null);
    startTransition(async () => { try { await updateAlbumOrder(next.map((x) => x.id)); setMessage("Đã lưu thứ tự album."); } catch (e) { setItems(items); setMessage(e instanceof Error ? e.message : "Lỗi lưu thứ tự"); } });
  }
  return <div><div className="mb-4 flex justify-between text-sm text-neutral-500"><span>Kéo album để đổi thứ tự ngoài trang chủ.</span><span className="text-emerald-600">{pending ? "Đang lưu..." : message}</span></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((album, index) => <article key={album.id} draggable onDragStart={() => setDragId(album.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(album.id)} className={`rounded-3xl border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 ${dragId === album.id ? "opacity-40" : ""}`}><div className="flex justify-between"><span className="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-white/10">↕ {index + 1}</span><span className="text-xs">{album.is_published ? "Công khai" : "Bản nháp"}</span></div><h3 className="mt-4 text-2xl font-bold">{album.title}</h3><p className="mt-2 truncate text-sm text-neutral-500">/albums/{album.slug}</p><div className="mt-6 grid grid-cols-2 gap-2"><Link href={`/admin/albums/${album.id}/edit`} className="rounded-xl bg-neutral-900 px-3 py-2 text-center text-sm font-semibold text-white dark:bg-white dark:text-black">Chỉnh sửa</Link><Link href={`/admin/albums/${album.id}/photos`} className="rounded-xl border px-3 py-2 text-center text-sm font-semibold dark:border-white/15">Quản lý ảnh</Link></div><form action={deleteAlbum} className="mt-2"><input type="hidden" name="id" value={album.id}/><button className="w-full rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 dark:border-red-500/30">Xóa album</button></form></article>)}</div></div>;
}
