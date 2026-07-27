import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import { requireAdmin } from "@/lib/auth/admin";
import AlbumSortableList, { SortableAlbum } from "./AlbumSortableList";

type Props = { searchParams: Promise<Record<string, string | undefined>> };
export default async function AdminAlbumsPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("albums").select("id,title,slug,description,is_published,sort_order,created_at").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  const albums = (data ?? []) as SortableAlbum[];
  const query = await searchParams;
  const notice = query.error ? decodeURIComponent(query.error) : query.created ? "Đã tạo album." : query.updated ? "Đã cập nhật album." : query.deleted ? "Đã xóa album." : null;
  return <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 px-6 pb-16 text-neutral-900 dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white"><header className="sticky top-0 z-40 -mx-6 border-b bg-white/80 px-6 backdrop-blur dark:border-white/10 dark:bg-black/70"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.3em] text-sky-600">Moments Admin</p><h1 className="text-xl font-bold">Quản lý album</h1></div><div className="flex items-center gap-3"><Link href="/admin" className="rounded-full border px-4 py-2 text-sm dark:border-white/15">← Trang quản trị</Link><ThemeToggle/></div></div></header><div className="mx-auto max-w-7xl py-10"><section className="flex flex-col justify-between gap-6 rounded-3xl border bg-white/80 p-8 shadow-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-end"><div><p className="text-sm uppercase tracking-[.25em] text-sky-600">Bộ sưu tập</p><h2 className="mt-3 text-4xl font-bold">{albums.length} album</h2><p className="mt-3 text-neutral-500">Kéo thả để sắp xếp album ngoài trang chủ.</p></div><Link href="/admin/albums/new" className="rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-black">＋ Tạo album mới</Link></section>{notice && <div className={`my-6 rounded-2xl border p-4 ${query.error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{notice}</div>}{error && <div className="my-6 rounded-2xl bg-red-50 p-4 text-red-700">{error.message}</div>}<section className="mt-10"><AlbumSortableList albums={albums}/></section></div></main>;
}
