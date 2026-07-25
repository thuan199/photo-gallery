import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ThemeToggle from "@/app/components/ThemeToggle";
import { updateAlbum } from "../../actions";
import { requireAdmin } from "@/lib/auth/admin";

type EditAlbumPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "ten-album-phai-co-it-nhat-2-ky-tu":
      return "Tên album phải có ít nhất 2 ký tự.";

    case "slug-khong-hop-le":
      return "Slug không hợp lệ.";

    case "slug-da-ton-tai":
      return "Slug này đã được sử dụng.";

    default:
      return error ? decodeURIComponent(error) : null;
  }
}

export default async function EditAlbumPage({
  params,
  searchParams,
}: EditAlbumPageProps) {
  const { supabase } = await requireAdmin();

  const { id } = await params;
  const query = await searchParams;

  const { data: album, error } = await supabase
    .from("albums")
    .select(
      "id, title, slug, description, cover_url, sort_order, is_published"
    )
    .eq("id", id)
    .single();

  if (error || !album) {
    notFound();
  }

  const errorMessage = getErrorMessage(query.error);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 transition-colors dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
              Moments Admin
            </p>

            <h1 className="mt-1 truncate text-xl font-bold">
              Chỉnh sửa album
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/albums"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <span aria-hidden="true">←</span>

              <span className="hidden sm:inline">
                Danh sách album
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
        <section className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-[0_30px_80px_rgba(14,165,233,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none lg:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-500/10" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-pink-200/60 blur-3xl dark:bg-pink-500/10" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600 dark:text-sky-300">
                Cập nhật nội dung
              </p>

              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
                {album.title}
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <code className="rounded-xl bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600 dark:bg-white/10 dark:text-white/60">
                  /albums/{album.slug}
                </code>

                <span
                  className={
                    album.is_published
                      ? "inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                  }
                >
                  <span
                    className={
                      album.is_published
                        ? "h-2 w-2 rounded-full bg-emerald-500"
                        : "h-2 w-2 rounded-full bg-amber-500"
                    }
                  />

                  {album.is_published
                    ? "Đang hiển thị"
                    : "Bản nháp"}
                </span>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 dark:text-white/55">
                Chỉnh sửa tên album, đường dẫn, ảnh bìa, mô tả và trạng
                thái hiển thị trên website.
              </p>
            </div>

            <Link
              href={`/admin/albums/${album.id}/photos`}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
            >
              <span aria-hidden="true">🖼️</span>
              Quản lý ảnh
            </Link>
          </div>
        </section>

        {errorMessage && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold dark:bg-red-500/20">
              !
            </span>

            <div>
              <p className="font-semibold">
                Không thể cập nhật album
              </p>

              <p className="mt-1 text-sm opacity-80">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form
            action={updateAlbum}
            className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-neutral-900/90 dark:shadow-none"
          >
            <input
              type="hidden"
              name="id"
              value={album.id}
            />

            <div className="border-b border-black/5 bg-gradient-to-r from-sky-50 to-pink-50 px-7 py-6 dark:border-white/10 dark:from-sky-500/10 dark:to-pink-500/10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600 dark:text-sky-300">
                Thông tin album
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Nội dung và hiển thị
              </h3>

              <p className="mt-2 text-sm text-neutral-600 dark:text-white/50">
                Những trường có dấu sao là thông tin bắt buộc.
              </p>
            </div>

            <div className="grid gap-6 p-7 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
                >
                  Tên album
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  minLength={2}
                  defaultValue={album.title}
                  placeholder="Ví dụ: Hành trình Đà Lạt"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
                />

                <p className="mt-2 text-xs text-neutral-500 dark:text-white/35">
                  Tên này sẽ xuất hiện ở trang chủ và trang chi tiết album.
                </p>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="slug"
                  className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
                >
                  Slug
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="mt-2 flex overflow-hidden rounded-xl border border-black/10 bg-white transition focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-pink-400 dark:focus-within:ring-pink-500/10">
                  <span className="flex items-center border-r border-black/5 bg-neutral-50 px-4 text-sm text-neutral-500 dark:border-white/10 dark:bg-white/5 dark:text-white/35">
                    /albums/
                  </span>

                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    defaultValue={album.slug}
                    placeholder="hanh-trinh-da-lat"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-white/25"
                  />
                </div>

                <p className="mt-2 text-xs text-neutral-500 dark:text-white/35">
                  Chỉ nên dùng chữ thường, số và dấu gạch ngang.
                </p>
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
                  defaultValue={album.description ?? ""}
                  placeholder="Viết một vài dòng giới thiệu về album..."
                  className="mt-2 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="cover_url"
                  className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
                >
                  Link ảnh bìa
                </label>

                <input
                  id="cover_url"
                  name="cover_url"
                  type="url"
                  defaultValue={album.cover_url ?? ""}
                  placeholder="https://live.staticflickr.com/..."
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-violet-400 dark:focus:ring-violet-500/10"
                />

                <p className="mt-2 text-xs text-neutral-500 dark:text-white/35">
                  Nên dùng ảnh ngang để hiển thị đẹp hơn trên trang chủ.
                </p>
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
                  defaultValue={album.sort_order}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
                />

                <p className="mt-2 text-xs text-neutral-500 dark:text-white/35">
                  Số nhỏ hơn sẽ được hiển thị trước.
                </p>
              </div>

              <div className="flex items-end">
                <label className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <div>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                      Công khai album
                    </p>

                    <p className="mt-1 text-sm text-emerald-700/70 dark:text-emerald-300/60">
                      Cho phép khách truy cập xem album.
                    </p>
                  </div>

                  <input
                    name="is_published"
                    type="checkbox"
                    defaultChecked={album.is_published}
                    className="h-5 w-5 accent-emerald-600"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-black/5 bg-neutral-50/70 px-7 py-5 sm:flex-row sm:items-center sm:justify-end dark:border-white/10 dark:bg-white/[0.02]">
              <Link
                href="/admin/albums"
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
                  Ảnh bìa hiện tại
                </p>
              </div>

              {album.cover_url ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={album.cover_url}
                    alt={`Ảnh bìa ${album.title}`}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="truncate font-semibold text-white">
                      {album.title}
                    </p>

                    <p className="mt-1 text-xs text-white/65">
                      Ảnh xem trước hiện tại
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-gradient-to-br from-sky-50 to-pink-50 text-neutral-400 dark:from-sky-500/10 dark:to-pink-500/10 dark:text-white/30">
                  <span className="text-4xl">🖼️</span>

                  <p className="text-sm font-medium">
                    Chưa có ảnh bìa
                  </p>
                </div>
              )}

              <div className="p-6">
                <p className="text-sm leading-6 text-neutral-600 dark:text-white/50">
                  Phần xem trước này sử dụng đường dẫn ảnh bìa đã lưu hiện tại.
                  Ảnh mới chỉ xuất hiện sau khi bạn lưu thay đổi.
                </p>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-sky-100 bg-sky-50/80 p-6 dark:border-sky-500/20 dark:bg-sky-500/10">
              <p className="font-semibold text-sky-800 dark:text-sky-300">
                Gợi ý ảnh bìa
              </p>

              <p className="mt-3 text-sm leading-6 text-sky-700/75 dark:text-sky-300/60">
                Nên chọn ảnh ngang, rõ nét và có vùng trống vừa đủ để tiêu đề
                trên trang chủ không che mất chủ thể chính.
              </p>
            </section>

            <section className="rounded-[1.75rem] border border-pink-100 bg-pink-50/80 p-6 dark:border-pink-500/20 dark:bg-pink-500/10">
              <p className="font-semibold text-pink-800 dark:text-pink-300">
                Lưu ý khi đổi slug
              </p>

              <p className="mt-3 text-sm leading-6 text-pink-700/75 dark:text-pink-300/60">
                Khi thay đổi slug, đường dẫn album cũ sẽ không còn hoạt động.
                Hãy cập nhật lại các liên kết đã chia sẻ trước đó.
              </p>
            </section>

            <Link
              href={`/admin/albums/${album.id}/photos`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <span aria-hidden="true">🖼️</span>
              Mở quản lý hình ảnh
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}