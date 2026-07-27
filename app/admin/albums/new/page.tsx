import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import { requireAdmin } from "@/lib/auth/admin";
import { createAlbum } from "../actions";

type NewAlbumPageProps = {
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
      return "Slug này đã được sử dụng. Hãy nhập slug khác.";

    default:
      return error ? decodeURIComponent(error) : null;
  }
}

export default async function NewAlbumPage({
  searchParams,
}: NewAlbumPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 transition-colors dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-500/10" />

      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-pink-200/60 blur-3xl dark:bg-pink-500/10" />

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/albums"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg text-neutral-700 shadow-sm transition hover:-translate-x-1 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Quay lại danh sách album"
            >
              ←
            </Link>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-300">
                Quản lý album
              </p>

              <p className="mt-1 text-sm font-semibold text-neutral-700 dark:text-white/70">
                Tạo nội dung mới
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 sm:inline-flex dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Bảng điều khiển
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/75 shadow-[0_30px_100px_rgba(14,165,233,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
          <div className="border-b border-black/5 bg-gradient-to-r from-sky-50 to-pink-50 px-7 py-8 dark:border-white/10 dark:from-sky-500/10 dark:to-pink-500/10 sm:px-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">
                  Album mới
                </p>

                <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                  Tạo album mới
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 dark:text-white/50">
                  Nhập thông tin cơ bản, ảnh bìa và trạng thái hiển thị
                  cho album của bạn.
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-900 text-3xl text-white shadow-lg dark:bg-white dark:text-black">
                🗂️
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-5">
              <div className="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl dark:bg-sky-500/15">
                  ✨
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  Tạo bộ sưu tập mới
                </h2>

                <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-white/40">
                  Album giúp nhóm các hình ảnh cùng chủ đề và hiển thị chúng
                  thành một bộ sưu tập riêng trên trang chủ.
                </p>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold text-neutral-800 dark:text-white/80">
                  Gợi ý nhập liệu
                </p>

                <div className="mt-4 space-y-4 text-sm text-neutral-500 dark:text-white/40">
                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                      1
                    </span>

                    <p className="leading-6">
                      Đặt tên album ngắn gọn và dễ nhận biết.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-700 dark:bg-pink-500/15 dark:text-pink-300">
                      2
                    </span>

                    <p className="leading-6">
                      Có thể để trống slug để hệ thống tự tạo.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                      3
                    </span>

                    <p className="leading-6">
                      Chỉ bật công khai khi album đã sẵn sàng hiển thị.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/admin/albums"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 font-semibold text-neutral-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                ← Quay lại danh sách album
              </Link>
            </aside>

            <section>
              {errorMessage && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold dark:bg-red-500/20">
                    !
                  </span>

                  <div>
                    <p className="font-semibold">
                      Không thể tạo album
                    </p>

                    <p className="mt-1 text-sm opacity-80">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}

              <form action={createAlbum} className="space-y-7">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
                  >
                    Tên album <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    minLength={2}
                    maxLength={200}
                    placeholder="Ví dụ: Đà Lạt 2026"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
                  />

                  <p className="mt-2 text-xs text-neutral-400 dark:text-white/30">
                    Tối thiểu 2 ký tự, tối đa 200 ký tự.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
                  >
                    Slug
                  </label>

                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    maxLength={200}
                    placeholder="Để trống sẽ tự tạo từ tên album"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
                  />

                  <p className="mt-2 text-xs text-neutral-400 dark:text-white/30">
                    Ví dụ: da-lat-2026
                  </p>
                </div>

                <div>
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
                    placeholder="Mô tả ngắn về album..."
                    className="mt-2 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3.5 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
                  />
                </div>

                <div>
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
                    placeholder="https://live.staticflickr.com/..."
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
                  />

                  <p className="mt-2 text-xs leading-5 text-neutral-400 dark:text-white/30">
                    Có thể để trống và cập nhật ảnh bìa sau.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
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
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-neutral-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
                    />

                    <p className="mt-2 text-xs text-neutral-400 dark:text-white/30">
                      Số nhỏ hơn sẽ được ưu tiên hiển thị trước.
                    </p>
                  </div>

                  <div>
                    <p className="block text-sm font-semibold text-neutral-700 dark:text-white/75">
                      Trạng thái
                    </p>

                    <label className="mt-2 flex cursor-pointer items-start gap-4 rounded-2xl border border-black/10 bg-white p-4 transition hover:border-sky-300 hover:bg-sky-50/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                      <input
                        name="is_published"
                        type="checkbox"
                        defaultChecked
                        className="mt-1 h-5 w-5 accent-sky-500"
                      />

                      <span>
                        <span className="block font-semibold">
                          Công khai album
                        </span>

                        <span className="mt-1 block text-sm leading-5 text-neutral-500 dark:text-white/40">
                          Album sẽ xuất hiện trên trang chủ.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-black/5 pt-7 sm:flex-row sm:justify-end dark:border-white/10">
                  <Link
                    href="/admin/albums"
                    className="rounded-xl border border-black/10 bg-white px-6 py-3 text-center font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    Hủy
                  </Link>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
                  >
                    <span aria-hidden="true">＋</span>
                    Lưu album
                  </button>
                </div>
              </form>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}