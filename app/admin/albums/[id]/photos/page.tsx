import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeToggle from "@/app/components/ThemeToggle";
import { requireAdmin } from "@/lib/auth/admin";
import { createPhoto, createPhotosBulk, importFlickrHtml } from "./actions";
import PhotoManager, { AdminPhoto } from "./PhotoManager";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> };

const messages: Record<string, string> = {
  "chua-nhap-link-anh": "Bạn chưa nhập link ảnh.",
  "khong-tim-thay-link-flickr": "Không tìm thấy URL ảnh Flickr hợp lệ trong nội dung đã dán.",
};

export default async function AlbumPhotosPage({ params, searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const { id: albumId } = await params;
  const query = await searchParams;
 const { data: album, error: albumError } = await supabase
  .from("albums")
  .select("id,title,slug,cover_url")
  .eq("id", albumId)
  .single();
  if (albumError || !album) notFound();
  const { data, error } = await supabase.from("photos").select("id,title,description,image_url,thumbnail_url,flickr_page_url,sort_order,is_published").eq("album_id", albumId).order("created_at", { ascending: true });
  const photos = (data ?? []) as AdminPhoto[];
  const notice = query.error ? (messages[query.error] ?? decodeURIComponent(query.error)) : query.bulk ? `Đã thêm ${query.bulk} ảnh.` : query.flickrHtml ? `Đã nhập ${query.flickrHtml} ảnh từ nội dung Flickr.` : query.created ? "Đã thêm ảnh." : query.updated ? "Đã cập nhật ảnh." : query.deleted ? "Đã xóa ảnh." : null;

  return <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 px-6 pb-16 text-neutral-900 dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
    <header className="sticky top-0 z-40 -mx-6 border-b bg-white/80 px-6 backdrop-blur dark:border-white/10 dark:bg-black/70">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.3em] text-pink-600">Moments Admin</p><h1 className="text-xl font-bold">Ảnh · {album.title}</h1></div>
        <div className="flex items-center gap-3"><Link href="/admin/photos" className="rounded-full border px-4 py-2 text-sm dark:border-white/15">← Quản lý ảnh</Link><Link href={`/albums/${album.slug}`} target="_blank" className="hidden rounded-full border px-4 py-2 text-sm sm:block dark:border-white/15">Xem album ↗</Link><ThemeToggle /></div>
      </div>
    </header>

    <div className="mx-auto max-w-7xl py-10">
      {notice && <div className={`mb-6 rounded-2xl border p-4 ${query.error ? "border-red-200 bg-red-50 text-red-700 dark:bg-red-500/10" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10"}`}>{notice}</div>}
      {error && <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-700">{error.message}</div>}

      <section className="grid gap-6 lg:grid-cols-2">
        <form action={createPhotosBulk} className="rounded-3xl border bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <input type="hidden" name="album_id" value={albumId} />
          <h2 className="text-2xl font-bold">Nhập nhiều URL</h2>
          <p className="mt-2 text-sm text-neutral-500">Mỗi dòng là một URL ảnh trực tiếp.</p>
          <textarea name="urls" required rows={8} placeholder={'https://live.staticflickr.com/.../photo1.jpg\nhttps://live.staticflickr.com/.../photo2.jpg'} className="mt-5 w-full rounded-2xl border bg-transparent p-4 font-mono text-sm dark:border-white/15" />
          <button className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-sky-700 hover:shadow-lg hover:scale-[1.03] active:scale-95 cursor-pointer">Thêm tất cả URL</button>
        </form>

        <form action={importFlickrHtml} className="rounded-3xl border bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <input type="hidden" name="album_id" value={albumId} />
          <h2 className="text-2xl font-bold">Nhập từ nội dung Flickr</h2>
          <p className="mt-2 text-sm text-neutral-500">Dán HTML hoặc đoạn mã có chứa các URL <code>live.staticflickr.com</code>.</p>
          <textarea name="flickr_html" required rows={8} placeholder={'Dán HTML hoặc nội dung đã sao chép từ trang Flickr vào đây...'} className="mt-5 w-full rounded-2xl border bg-transparent p-4 font-mono text-sm dark:border-white/15" />
          <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm text-sky-800 dark:bg-sky-500/10 dark:text-sky-200">Hệ thống tự tìm URL ảnh, loại trùng, tạo ảnh lớn và thumbnail.</div>
          <button className="mt-4 rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white">Nhập ảnh Flickr</button>
        </form>
      </section>

      <details className="mt-6 rounded-3xl border bg-white/90 p-6 dark:border-white/10 dark:bg-white/5">
        <summary className="cursor-pointer text-lg font-bold">Thêm một ảnh thủ công</summary>
        <form action={createPhoto} className="mt-5 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="album_id" value={albumId} />
          <input name="title" placeholder="Tiêu đề" className="rounded-xl border bg-transparent px-4 py-3 dark:border-white/15" />
          <input name="sort_order" type="number" defaultValue={photos.length} className="rounded-xl border bg-transparent px-4 py-3 dark:border-white/15" />
          <input name="image_url" type="url" required placeholder="Link ảnh chính" className="rounded-xl border bg-transparent px-4 py-3 md:col-span-2 dark:border-white/15" />
          <input name="thumbnail_url" type="url" placeholder="Link thumbnail (có thể bỏ trống)" className="rounded-xl border bg-transparent px-4 py-3 md:col-span-2 dark:border-white/15" />
          <input name="flickr_page_url" type="url" placeholder="Link trang Flickr" className="rounded-xl border bg-transparent px-4 py-3 md:col-span-2 dark:border-white/15" />
          <textarea name="description" placeholder="Mô tả" className="rounded-xl border bg-transparent px-4 py-3 md:col-span-2 dark:border-white/15" />
          <label className="flex items-center gap-2"><input name="is_published" type="checkbox" defaultChecked /> Công khai</label>
          <button className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white dark:bg-white dark:text-black">Thêm ảnh</button>
        </form>
      </details>

      <section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-sm uppercase tracking-[.25em] text-neutral-500">Thư viện</p><h2 className="text-3xl font-bold">{photos.length} ảnh</h2></div></div><PhotoManager albumId={albumId} photos={photos} coverUrl={album.cover_url} /></section>
    </div>
  </main>;
}
