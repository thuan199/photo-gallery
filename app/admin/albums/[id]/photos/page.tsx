import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ThemeToggle from "@/app/components/ThemeToggle";
import { createPhoto, deletePhoto } from "./actions";

type Photo = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  flickr_page_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

type AlbumPhotosPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "chua-nhap-link-anh":
      return "Bạn chưa nhập link ảnh.";

    default:
      return error ? decodeURIComponent(error) : null;
  }
}

export default async function AlbumPhotosPage({
  params,
  searchParams,
}: AlbumPhotosPageProps) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    redirect("/admin/login");
  }

  const { id: albumId } = await params;
  const query = await searchParams;

  const { data: album, error: albumError } = await supabase
    .from("albums")
    .select("id, title, slug")
    .eq("id", albumId)
    .single();

  if (albumError || !album) {
    notFound();
  }

  const { data, error: photosError } = await supabase
    .from("photos")
    .select(`
      id,
      title,
      description,
      image_url,
      thumbnail_url,
      flickr_page_url,
      sort_order,
      is_published,
      created_at
    `)
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const photos = (data ?? []) as Photo[];

  const createdSuccessfully = query.created === "true";
  const updatedSuccessfully = query.updated === "true";
  const deletedSuccessfully = query.deleted === "true";

  const errorMessage =
    getErrorMessage(query.error) ??
    (photosError ? photosError.message : null);

  const publishedCount = photos.filter(
    (photo) => photo.is_published
  ).length;

  const hiddenCount = photos.length - publishedCount;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 transition-colors dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">
              Moments Admin
            </p>

            <h1 className="mt-1 truncate text-xl font-bold">
              Ảnh trong album
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/photos"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <span aria-hidden="true">←</span>

              <span className="hidden sm:inline">
                Quản lý hình ảnh
              </span>
            </Link>

            <Link
              href={`/albums/${album.slug}`}
              target="_blank"
              className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 sm:inline-flex dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Xem album
              <span aria-hidden="true">↗</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <section className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-[0_30px_80px_rgba(236,72,153,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none lg:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-200/60 blur-3xl dark:bg-pink-500/10" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-500/10" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600 dark:text-pink-300">
                Quản lý ảnh
              </p>

              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
                {album.title}
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <code className="rounded-xl bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600 dark:bg-white/10 dark:text-white/60">
                  /albums/{album.slug}
                </code>

                <span className="text-sm text-neutral-500 dark:text-white/45">
                  Thêm, chỉnh sửa và sắp xếp hình ảnh trong album.
                </span>
              </div>
            </div>

            <a
              href="#add-photo"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
            >
              <span className="text-xl" aria-hidden="true">
                ＋
              </span>
              Thêm ảnh mới
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-sky-100 bg-white/85 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500 dark:text-white/45">
                Tổng hình ảnh
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-xl dark:bg-sky-500/15">
                🖼️
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {photos.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-100 bg-white/85 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500 dark:text-white/45">
                Đang công khai
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl dark:bg-emerald-500/15">
                ✓
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-emerald-600 dark:text-emerald-300">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-amber-100 bg-white/85 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500 dark:text-white/45">
                Đang ẩn
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl dark:bg-amber-500/15">
                ◷
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-amber-600 dark:text-amber-300">
              {hiddenCount}
            </p>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          {createdSuccessfully && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold dark:bg-emerald-500/20">
                ✓
              </span>

              <div>
                <p className="font-semibold">
                  Thêm ảnh thành công
                </p>

                <p className="mt-1 text-sm opacity-80">
                  Ảnh mới đã được thêm vào album.
                </p>
              </div>
            </div>
          )}

          {updatedSuccessfully && (
            <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-800 shadow-sm dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold dark:bg-sky-500/20">
                ✓
              </span>

              <div>
                <p className="font-semibold">
                  Cập nhật ảnh thành công
                </p>

                <p className="mt-1 text-sm opacity-80">
                  Thông tin hình ảnh đã được lưu.
                </p>
              </div>
            </div>
          )}

          {deletedSuccessfully && (
            <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-neutral-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 font-bold dark:bg-white/10">
                ✓
              </span>

              <div>
                <p className="font-semibold">
                  Đã xóa ảnh
                </p>

                <p className="mt-1 text-sm opacity-80">
                  Ảnh đã được xóa khỏi album.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold dark:bg-red-500/20">
                !
              </span>

              <div>
                <p className="font-semibold">
                  Không thể thực hiện thao tác
                </p>

                <p className="mt-1 text-sm opacity-80">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}
        </section>

        <section
          id="add-photo"
          className="mt-10 overflow-hidden rounded-[2rem] border border-black/5 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-neutral-900/90 dark:shadow-none"
        >
          <div className="border-b border-black/5 bg-gradient-to-r from-sky-50 to-pink-50 px-7 py-6 dark:border-white/10 dark:from-sky-500/10 dark:to-pink-500/10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600 dark:text-pink-300">
              Hình ảnh mới
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Thêm ảnh vào album
            </h2>

            <p className="mt-2 text-sm text-neutral-600 dark:text-white/50">
              Dán đường dẫn ảnh từ Flickr và bổ sung thông tin cần thiết.
            </p>
          </div>

          <form
            action={createPhoto}
            className="grid gap-6 p-7 md:grid-cols-2"
          >
            <input
              type="hidden"
              name="album_id"
              value={albumId}
            />

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Tiêu đề ảnh
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Ví dụ: Hoàng hôn bên bờ biển"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="sort_order"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Thứ tự hiển thị
              </label>

              <input
                id="sort_order"
                name="sort_order"
                type="number"
                min={0}
                defaultValue={0}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="image_url"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Link ảnh chính
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="image_url"
                name="image_url"
                type="url"
                required
                placeholder="https://live.staticflickr.com/..."
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
              />

              <p className="mt-2 text-xs text-neutral-500 dark:text-white/35">
                Đây là đường dẫn dùng để hiển thị ảnh kích thước đầy đủ.
              </p>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="thumbnail_url"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Link ảnh thu nhỏ
              </label>

              <input
                id="thumbnail_url"
                name="thumbnail_url"
                type="url"
                placeholder="Bỏ trống để dùng link ảnh chính"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="flickr_page_url"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Link trang Flickr
              </label>

              <input
                id="flickr_page_url"
                name="flickr_page_url"
                type="url"
                placeholder="https://www.flickr.com/photos/..."
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-violet-400 dark:focus:ring-violet-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Mô tả
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Viết một vài dòng mô tả về bức ảnh..."
                className="mt-2 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Công khai ảnh
                  </p>

                  <p className="mt-1 text-sm text-emerald-700/70 dark:text-emerald-300/60">
                    Ảnh sẽ xuất hiện trong album ngoài website.
                  </p>
                </div>

                <input
                  name="is_published"
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-emerald-600"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-black/5 pt-6 md:col-span-2 dark:border-white/10">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
              >
                <span aria-hidden="true">＋</span>
                Thêm ảnh
              </button>

              <a
                href="#photo-list"
                className="rounded-xl border border-black/10 bg-white px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
              >
                Xem danh sách ảnh
              </a>
            </div>
          </form>
        </section>

        <section
          id="photo-list"
          className="mt-12"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-white/40">
                Thư viện
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Danh sách ảnh
              </h2>
            </div>

            <p className="text-sm text-neutral-500 dark:text-white/40">
              Có {photos.length} ảnh trong album
            </p>
          </div>

          {photos.length === 0 ? (
            <div className="mt-6 rounded-[2rem] border border-dashed border-pink-200 bg-white/70 px-6 py-16 text-center shadow-sm dark:border-white/15 dark:bg-white/5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-100 to-sky-100 text-4xl dark:from-pink-500/15 dark:to-sky-500/15">
                🖼️
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Album chưa có ảnh
              </h3>

              <p className="mx-auto mt-3 max-w-md text-neutral-600 dark:text-white/50">
                Thêm bức ảnh đầu tiên để bắt đầu xây dựng bộ sưu tập.
              </p>

              <a
                href="#add-photo"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-neutral-700 dark:bg-white dark:text-black"
              >
                <span aria-hidden="true">＋</span>
                Thêm ảnh đầu tiên
              </a>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {photos.map((photo) => (
                <article
                  key={photo.id}
                  className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(236,72,153,0.16)] dark:border-white/10 dark:bg-neutral-900/90 dark:shadow-none dark:hover:border-pink-400/40"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                    <img
                      src={
                        photo.thumbnail_url ||
                        photo.image_url
                      }
                      alt={photo.title || "Ảnh album"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80" />

                    <div className="absolute left-4 top-4">
                      <span
                        className={
                          photo.is_published
                            ? "inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-md dark:bg-black/60 dark:text-emerald-300"
                            : "inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm backdrop-blur-md dark:bg-black/60 dark:text-amber-300"
                        }
                      >
                        <span
                          className={
                            photo.is_published
                              ? "h-2 w-2 rounded-full bg-emerald-500"
                              : "h-2 w-2 rounded-full bg-amber-500"
                          }
                        />

                        {photo.is_published
                          ? "Công khai"
                          : "Đang ẩn"}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <span className="rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                        Thứ tự {photo.sort_order}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="truncate text-xl font-bold text-neutral-900 dark:text-white">
                      {photo.title || "Chưa có tiêu đề"}
                    </h3>

                    {photo.description ? (
                      <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-neutral-600 dark:text-white/50">
                        {photo.description}
                      </p>
                    ) : (
                      <p className="mt-3 min-h-12 text-sm italic leading-6 text-neutral-400 dark:text-white/30">
                        Ảnh chưa có mô tả.
                      </p>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Link
                        href={`/admin/albums/${albumId}/photos/${photo.id}/edit`}
                        className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
                      >
                        Chỉnh sửa
                      </Link>

                      <a
                        href={photo.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        Xem ảnh
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>

                    {photo.flickr_page_url && (
                      <a
                        href={photo.flickr_page_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-700 transition hover:border-pink-300 hover:bg-pink-100 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-300 dark:hover:bg-pink-500/20"
                      >
                        Xem trên Flickr
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}

                    <form
                      action={deletePhoto}
                      className="mt-3"
                    >
                      <input
                        type="hidden"
                        name="photo_id"
                        value={photo.id}
                      />

                      <input
                        type="hidden"
                        name="album_id"
                        value={albumId}
                      />

                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                      >
                        Xóa ảnh
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}