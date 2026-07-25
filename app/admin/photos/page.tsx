import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ThemeToggle from "@/app/components/ThemeToggle";

type AlbumPhotoSummary = {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  is_published: boolean;
  sort_order: number;
  photos: {
    id: string;
  }[];
};

export default async function AdminPhotosPage() {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("albums")
    .select(`
      id,
      title,
      slug,
      cover_url,
      is_published,
      sort_order,
      photos (
        id
      )
    `)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const albums = (data ?? []) as AlbumPhotoSummary[];

  const totalPhotos = albums.reduce(
    (total, album) => total + (album.photos?.length ?? 0),
    0
  );

  const publishedAlbums = albums.filter(
    (album) => album.is_published
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 transition-colors dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">
              Moments Admin
            </p>

            <h1 className="mt-1 text-xl font-bold">
              Quản lý hình ảnh
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
        <section className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-[0_30px_80px_rgba(236,72,153,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none lg:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-200/60 blur-3xl dark:bg-pink-500/10" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-500/10" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600 dark:text-pink-300">
                Thư viện ảnh
              </p>

              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
                Quản lý hình ảnh theo album
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 dark:text-white/60">
                Chọn một album để thêm ảnh mới, chỉnh sửa nội dung,
                sắp xếp thứ tự hoặc xóa hình ảnh khỏi bộ sưu tập.
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

          <div className="rounded-[1.5rem] border border-pink-100 bg-white/85 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500 dark:text-white/45">
                Tổng hình ảnh
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-xl dark:bg-pink-500/15">
                🖼️
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-pink-600 dark:text-pink-300">
              {totalPhotos}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-100 bg-white/85 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500 dark:text-white/45">
                Album công khai
              </p>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl dark:bg-emerald-500/15">
                ✓
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold text-emerald-600 dark:text-emerald-300">
              {publishedAlbums}
            </p>
          </div>
        </section>

        {error && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold dark:bg-red-500/20">
              !
            </span>

            <div>
              <p className="font-semibold">
                Không thể tải danh sách album
              </p>

              <p className="mt-1 text-sm opacity-80">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {!error && albums.length === 0 && (
          <section className="mt-10 rounded-[2rem] border border-dashed border-pink-200 bg-white/70 px-6 py-16 text-center shadow-sm dark:border-white/15 dark:bg-white/5">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-100 to-sky-100 text-4xl dark:from-pink-500/15 dark:to-sky-500/15">
              🖼️
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Chưa có album nào
            </h2>

            <p className="mx-auto mt-3 max-w-md text-neutral-600 dark:text-white/50">
              Hãy tạo album đầu tiên trước khi thêm hình ảnh vào thư viện.
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
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-white/40">
                  Danh sách album
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Chọn album để quản lý ảnh
                </h2>
              </div>

              <p className="text-sm text-neutral-500 dark:text-white/40">
                Có {albums.length} album
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {albums.map((album) => {
                const photoCount = album.photos?.length ?? 0;

                return (
                  <article
                    key={album.id}
                    className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(236,72,153,0.16)] dark:border-white/10 dark:bg-neutral-900/90 dark:shadow-none dark:hover:border-pink-400/40"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                      {album.cover_url ? (
                        <img
                          src={album.cover_url}
                          alt={album.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400 dark:text-white/30">
                          <span className="text-4xl">🖼️</span>
                          <span className="text-sm font-medium">
                            Chưa có ảnh bìa
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80" />

                      <div className="absolute left-4 top-4">
                        <span
                          className={
                            album.is_published
                              ? "inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-md dark:bg-black/60 dark:text-emerald-300"
                              : "inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm backdrop-blur-md dark:bg-black/60 dark:text-amber-300"
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
                            ? "Công khai"
                            : "Đang ẩn"}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-sm text-white/70">
                          Số lượng ảnh
                        </p>

                        <p className="mt-1 text-3xl font-bold text-white">
                          {photoCount}
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div>
                        <h3 className="truncate text-xl font-bold text-neutral-900 dark:text-white">
                          {album.title}
                        </h3>

                        <code className="mt-2 inline-block rounded-lg bg-neutral-100 px-3 py-1.5 text-xs text-neutral-500 dark:bg-white/10 dark:text-white/50">
                          /albums/{album.slug}
                        </code>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Link
                          href={`/admin/albums/${album.id}/photos`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
                        >
                          <span aria-hidden="true">🖼️</span>
                          Quản lý ảnh
                        </Link>

                        <Link
                          href={`/admin/albums/${album.id}/edit`}
                          className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          Sửa album
                        </Link>
                      </div>

                      {album.is_published && (
                        <Link
                          href={`/albums/${album.slug}`}
                          target="_blank"
                          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-700 transition hover:border-pink-300 hover:bg-pink-100 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-300 dark:hover:bg-pink-500/20"
                        >
                          Xem album trên website
                          <span aria-hidden="true">↗</span>
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}