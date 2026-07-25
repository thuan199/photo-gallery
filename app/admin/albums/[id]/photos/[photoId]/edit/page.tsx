import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ThemeToggle from "@/app/components/ThemeToggle";
import { updatePhoto } from "../../actions";
import { requireAdmin } from "@/lib/auth/admin";

type EditPhotoPageProps = {
  params: Promise<{
    id: string;
    photoId: string;
  }>;

  searchParams: Promise<{
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

export default async function EditPhotoPage({
  params,
  searchParams,
}: EditPhotoPageProps) {
  const { supabase } = await requireAdmin();

  const { id: albumId, photoId } = await params;
  const query = await searchParams;

  const { data: photo, error } = await supabase
    .from("photos")
    .select(`
      id,
      album_id,
      title,
      description,
      image_url,
      thumbnail_url,
      flickr_page_url,
      sort_order,
      is_published
    `)
    .eq("id", photoId)
    .eq("album_id", albumId)
    .single();

  if (error || !photo) {
    notFound();
  }

  const errorMessage = getErrorMessage(query.error);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 transition-colors dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">
              Moments Admin
            </p>

            <h1 className="mt-1 truncate text-xl font-bold">
              Chỉnh sửa hình ảnh
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/admin/albums/${albumId}/photos`}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <span aria-hidden="true">←</span>

              <span className="hidden sm:inline">
                Danh sách ảnh
              </span>
            </Link>

            <a
              href={photo.image_url}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 sm:inline-flex dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Xem ảnh
              <span aria-hidden="true">↗</span>
            </a>

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
                Cập nhật hình ảnh
              </p>

              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
                {photo.title || "Chưa có tiêu đề"}
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span
                  className={
                    photo.is_published
                      ? "inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
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
                    ? "Đang công khai"
                    : "Đang ẩn"}
                </span>

                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:bg-white/10 dark:text-white/60">
                  Thứ tự {photo.sort_order}
                </span>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 dark:text-white/55">
                Chỉnh sửa tiêu đề, mô tả, đường dẫn Flickr, ảnh thu nhỏ
                và trạng thái hiển thị của hình ảnh.
              </p>
            </div>

            {photo.flickr_page_url && (
              <a
                href={photo.flickr_page_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
              >
                Xem trên Flickr
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </section>

        {errorMessage && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold dark:bg-red-500/20">
              !
            </span>

            <div>
              <p className="font-semibold">
                Không thể cập nhật hình ảnh
              </p>

              <p className="mt-1 text-sm opacity-80">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          <form
            action={updatePhoto}
            className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-neutral-900/90 dark:shadow-none"
          >
            <input
              type="hidden"
              name="album_id"
              value={albumId}
            />

            <input
              type="hidden"
              name="photo_id"
              value={photoId}
            />

            <div className="border-b border-black/5 bg-gradient-to-r from-sky-50 to-pink-50 px-7 py-6 dark:border-white/10 dark:from-sky-500/10 dark:to-pink-500/10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600 dark:text-pink-300">
                Thông tin ảnh
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Nội dung và đường dẫn
              </h3>

              <p className="mt-2 text-sm text-neutral-600 dark:text-white/50">
                Link ảnh chính là thông tin bắt buộc.
              </p>
            </div>

            <div className="grid gap-6 p-7 md:grid-cols-2">
              <div className="md:col-span-2">
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
                  defaultValue={photo.title ?? ""}
                  placeholder="Ví dụ: Hoàng hôn trên biển"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
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
                  defaultValue={photo.image_url}
                  placeholder="https://live.staticflickr.com/..."
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
                />

                <p className="mt-2 text-xs text-neutral-500 dark:text-white/35">
                  Đường dẫn này được dùng để hiển thị ảnh kích thước đầy đủ.
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
                  defaultValue={photo.thumbnail_url ?? ""}
                  placeholder="Bỏ trống để dùng link ảnh chính"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
                />

                <p className="mt-2 text-xs text-neutral-500 dark:text-white/35">
                  Ảnh thu nhỏ giúp danh sách ảnh tải nhanh hơn.
                </p>
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
                  defaultValue={photo.flickr_page_url ?? ""}
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
                  rows={5}
                  defaultValue={photo.description ?? ""}
                  placeholder="Viết một vài dòng mô tả về bức ảnh..."
                  className="mt-2 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
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
                  defaultValue={photo.sort_order}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
                />

                <p className="mt-2 text-xs text-neutral-500 dark:text-white/35">
                  Số nhỏ hơn sẽ hiển thị trước.
                </p>
              </div>

              <div className="flex items-end">
                <label className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <div>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                      Công khai ảnh
                    </p>

                    <p className="mt-1 text-sm text-emerald-700/70 dark:text-emerald-300/60">
                      Hiển thị ảnh ngoài website.
                    </p>
                  </div>

                  <input
                    name="is_published"
                    type="checkbox"
                    defaultChecked={photo.is_published}
                    className="h-5 w-5 accent-emerald-600"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-black/5 bg-neutral-50/70 px-7 py-5 sm:flex-row sm:items-center sm:justify-end dark:border-white/10 dark:bg-white/[0.02]">
              <Link
                href={`/admin/albums/${albumId}/photos`}
                className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Hủy
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
              >
                <span aria-hidden="true">✓</span>
                Lưu thay đổi
              </button>
            </div>
          </form>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <section className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white/90 shadow-[0_20px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-neutral-900/90 dark:shadow-none">
              <div className="border-b border-black/5 px-6 py-5 dark:border-white/10">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-white/40">
                  Ảnh hiện tại
                </p>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                <img
                  src={photo.thumbnail_url || photo.image_url}
                  alt={photo.title || "Ảnh album"}
                  className="h-full w-full object-contain"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="truncate font-semibold text-white">
                    {photo.title || "Chưa có tiêu đề"}
                  </p>

                  <p className="mt-1 text-xs text-white/65">
                    Ảnh xem trước hiện tại
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-6">
                <a
                  href={photo.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  Ảnh gốc
                  <span aria-hidden="true">↗</span>
                </a>

                {photo.thumbnail_url ? (
                  <a
                    href={photo.thumbnail_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    Ảnh nhỏ
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center justify-center rounded-xl border border-dashed border-black/10 px-4 py-3 text-sm text-neutral-400 dark:border-white/10 dark:text-white/30">
                    Không có ảnh nhỏ
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-sky-100 bg-sky-50/80 p-6 dark:border-sky-500/20 dark:bg-sky-500/10">
              <p className="font-semibold text-sky-800 dark:text-sky-300">
                Gợi ý đường dẫn ảnh
              </p>

              <p className="mt-3 text-sm leading-6 text-sky-700/75 dark:text-sky-300/60">
                Link ảnh chính nên trỏ trực tiếp tới file ảnh và thường kết
                thúc bằng đuôi JPG, JPEG, PNG hoặc WEBP.
              </p>
            </section>

            <section className="rounded-[1.75rem] border border-pink-100 bg-pink-50/80 p-6 dark:border-pink-500/20 dark:bg-pink-500/10">
              <p className="font-semibold text-pink-800 dark:text-pink-300">
                Lưu ý khi thay đổi link
              </p>

              <p className="mt-3 text-sm leading-6 text-pink-700/75 dark:text-pink-300/60">
                Phần xem trước bên trên vẫn sử dụng đường dẫn đã lưu. Ảnh mới
                sẽ được hiển thị sau khi bạn lưu thay đổi.
              </p>
            </section>

            {photo.flickr_page_url && (
              <a
                href={photo.flickr_page_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-5 py-3 font-semibold text-pink-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-100 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-300 dark:hover:bg-pink-500/20"
              >
                Xem trang Flickr
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}