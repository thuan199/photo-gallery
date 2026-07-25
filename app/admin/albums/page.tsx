import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ThemeToggle from "@/app/components/ThemeToggle";
import { deleteAlbum } from "./actions";

type Album = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

type AdminAlbumsPageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function AdminAlbumsPage({
  searchParams,
}: AdminAlbumsPageProps) {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("albums")
    .select(
      "id, title, slug, description, is_published, sort_order, created_at"
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const albums = (data ?? []) as Album[];

  const params = await searchParams;

  const createdSuccessfully = params.created === "true";
  const updatedSuccessfully = params.updated === "true";
  const deletedSuccessfully = params.deleted === "true";

  const errorMessage = params.error
    ? decodeURIComponent(params.error)
    : null;

  const publishedCount = albums.filter(
    (album) => album.is_published
  ).length;

  const draftCount = albums.length - publishedCount;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 transition-colors dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
              Moments Admin
            </p>

            <h1 className="mt-1 text-xl font-bold">
              Quản lý album
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <span aria-hidden="true">←</span>

              <span className="hidden sm:inline">
                Trang quản trị
              </span>
            </Link>

            <Link
              href="/"
              className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 sm:inline-flex dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Xem website
              <span aria-hidden="true">↗</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <section className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-[0_30px_80px_rgba(14,165,233,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none lg:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-500/10" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-pink-200/60 blur-3xl dark:bg-pink-500/10" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600 dark:text-sky-300">
                Bộ sưu tập
              </p>

              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
                Quản lý album ảnh
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 dark:text-white/60">
                Tạo album mới, chỉnh sửa thông tin, quản lý hình ảnh
                và kiểm soát trạng thái hiển thị trên website.
              </p>
            </div>

            <Link
              href="/admin/albums/new"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
            >
              <span className="text-xl" aria-hidden="true">
                ＋
              </span>
              Tạo album mới
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-sky-100 bg-white/85 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500 dark:text-white/45">
                Tổng album
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-xl dark:bg-sky-500/15">
                🗂️
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {albums.length}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-100 bg-white/85 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500 dark:text-white/45">
                Đang hiển thị
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
                Bản nháp
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl dark:bg-amber-500/15">
                ◷
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-amber-600 dark:text-amber-300">
              {draftCount}
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
                  Tạo album thành công
                </p>

                <p className="mt-1 text-sm opacity-80">
                  Album mới đã được thêm vào danh sách.
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
                  Cập nhật album thành công
                </p>

                <p className="mt-1 text-sm opacity-80">
                  Thông tin album đã được lưu.
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
                  Đã xóa album
                </p>

                <p className="mt-1 text-sm opacity-80">
                  Album đã được xóa khỏi hệ thống.
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

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            Không thể tải danh sách album: {error.message}
          </div>
        )}

        {!error && albums.length === 0 && (
          <section className="mt-10 rounded-[2rem] border border-dashed border-sky-200 bg-white/70 px-6 py-16 text-center shadow-sm dark:border-white/15 dark:bg-white/5">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 to-pink-100 text-4xl dark:from-sky-500/15 dark:to-pink-500/15">
              🗂️
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Chưa có album nào
            </h2>

            <p className="mx-auto mt-3 max-w-md text-neutral-600 dark:text-white/50">
              Hãy tạo album đầu tiên để bắt đầu xây dựng bộ sưu tập ảnh.
            </p>

            <Link
              href="/admin/albums/new"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-neutral-700 dark:bg-white dark:text-black"
            >
              <span aria-hidden="true">＋</span>
              Tạo album đầu tiên
            </Link>
          </section>
        )}

        {!error && albums.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-white/40">
                  Danh sách album
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Tất cả album
                </h2>
              </div>

              <p className="text-sm text-neutral-500 dark:text-white/40">
                Hiển thị {albums.length} album
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-neutral-900/90 dark:shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="border-b border-black/5 bg-neutral-50/80 text-sm text-neutral-500 dark:border-white/10 dark:bg-white/5 dark:text-white/45">
                    <tr>
                      <th className="px-6 py-5 font-semibold">
                        Album
                      </th>

                      <th className="px-6 py-5 font-semibold">
                        Đường dẫn
                      </th>

                      <th className="px-6 py-5 text-center font-semibold">
                        Thứ tự
                      </th>

                      <th className="px-6 py-5 font-semibold">
                        Trạng thái
                      </th>

                      <th className="px-6 py-5 text-right font-semibold">
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {albums.map((album) => (
                      <tr
                        key={album.id}
                        className="group transition hover:bg-sky-50/60 dark:hover:bg-white/5"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-pink-100 text-xl dark:from-sky-500/15 dark:to-pink-500/15">
                              🖼️
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-neutral-900 dark:text-white">
                                {album.title}
                              </p>

                              <p className="mt-1 max-w-sm truncate text-sm text-neutral-500 dark:text-white/40">
                                {album.description ||
                                  "Chưa có mô tả"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <code className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600 dark:bg-white/10 dark:text-white/60">
                            /albums/{album.slug}
                          </code>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-neutral-100 px-3 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-white/70">
                            {album.sort_order}
                          </span>
                        </td>

                        <td className="px-6 py-5">
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
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            {album.is_published && (
                              <Link
                                href={`/albums/${album.slug}`}
                                target="_blank"
                                className="inline-flex h-10 items-center rounded-xl border border-black/10 bg-white px-3 text-sm font-medium text-neutral-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                              >
                                Xem
                              </Link>
                            )}

                            <Link
                              href={`/admin/albums/${album.id}/photos`}
                              className="inline-flex h-10 items-center rounded-xl border border-black/10 bg-white px-3 text-sm font-medium text-neutral-600 transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                              Ảnh
                            </Link>

                            <Link
                              href={`/admin/albums/${album.id}/edit`}
                              className="inline-flex h-10 items-center rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
                            >
                              Chỉnh sửa
                            </Link>

                            <form action={deleteAlbum}>
                              <input
                                type="hidden"
                                name="id"
                                value={album.id}
                              />

                              <button
                                type="submit"
                                className="inline-flex h-10 items-center rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                              >
                                Xóa
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}