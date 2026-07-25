import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ThemeToggle from "./components/ThemeToggle";

type Album = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
};

export default async function Home() {
  const supabase = await createClient();

  const { data: albums, error } = await supabase
    .from("albums")
    .select(`
      id,
      title,
      slug,
      description,
      cover_url
    `)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-rose-50 text-neutral-900 transition-colors duration-300 dark:from-black dark:via-neutral-950 dark:to-black dark:text-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Không thể tải album
          </h1>

          <p className="mt-3 text-red-400">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  const albumList = (albums ?? []) as Album[];
  const featuredAlbum = albumList[0];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="fixed left-0 top-0 z-50 w-full border-b border-black/5 bg-white/70 shadow-sm backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-black/40 dark:shadow-none">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-xl font-bold tracking-[0.2em] text-transparent dark:from-sky-300 dark:to-pink-300"
          >
            Vui thôi mà (fake)
          </Link>

          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-7 text-sm text-neutral-600 md:flex dark:text-white/70">
              <Link
                href="/"
                className="transition hover:text-sky-500 dark:hover:text-white"
              >
                Trang chủ
              </Link>

              <a
                href="#albums"
                className="transition hover:text-pink-500 dark:hover:text-white"
              >
                Album
              </a>

              <Link
                href="/admin"
                className="rounded-full border border-black/10 bg-white/70 px-5 py-2 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white dark:hover:text-black"
              >
                Quản trị
              </Link>
            </nav>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen items-end overflow-hidden">
        {featuredAlbum?.cover_url ? (
          <img
            src={featuredAlbum.cover_url}
            alt={featuredAlbum.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-950 to-black" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent dark:from-black dark:via-black/30 dark:to-black/20" />

        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/10 to-transparent dark:from-black/70 dark:via-transparent dark:to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40">
          <p className="mb-5 text-sm uppercase tracking-[0.4em] text-sky-600 dark:text-white/60">
            Photography portfolio
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-neutral-900 sm:text-7xl lg:text-8xl dark:text-white">
            Lưu giữ những
            <br />
            khoảnh khắc đẹp
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg dark:text-white/70">
            Những câu chuyện, con người và cảm xúc được lưu giữ
            qua từng khung hình.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#albums"
              className="rounded-full bg-neutral-900 px-7 py-3 font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              Khám phá album
            </a>

            {featuredAlbum && (
              <Link
                href={`/albums/${featuredAlbum.slug}`}
                className="rounded-full border border-black/15 bg-white/50 px-7 py-3 font-medium text-neutral-900 backdrop-blur-md transition hover:bg-white dark:border-white/30 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Xem album nổi bật
              </Link>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-xs uppercase tracking-[0.3em] text-neutral-500 md:flex dark:text-white/50">
          <span className="h-px w-12 bg-neutral-400 dark:bg-white/40" />
          Cuộn xuống
        </div>
      </section>

      <section
        id="albums"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600 dark:text-white/40">
              Bộ sưu tập
            </p>

            <h2 className="mt-4 text-4xl font-semibold text-neutral-900 sm:text-5xl dark:text-white">
              Album mới nhất
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-neutral-500 dark:text-white/50">
            Chọn một album để xem toàn bộ hình ảnh và trình chiếu
            ở chế độ toàn màn hình.
          </p>
        </div>

        {albumList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 py-24 text-center text-white/40">
            Chưa có album công khai nào.
          </div>
        ) : (
          <div className="grid auto-rows-[260px] gap-5 md:grid-cols-2 lg:grid-cols-3">
            {albumList.map((album, index) => (
              <Link
                key={album.id}
                href={`/albums/${album.slug}`}
                className={`group relative overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(14,165,233,0.12)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(236,72,153,0.18)] dark:bg-neutral-900 dark:shadow-none dark:ring-white/10 ${index === 0
                  ? "md:row-span-2"
                  : index === 3
                    ? "lg:col-span-2"
                    : ""
                  }`}
              >
                {album.cover_url ? (
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-neutral-700 to-neutral-950" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 transition duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">
                        Album {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="text-2xl font-semibold">
                        {album.title}
                      </h3>

                      {album.description && (
                        <p className="mt-3 max-w-md translate-y-3 text-sm leading-6 text-white/60 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          {album.description}
                        </p>
                      )}
                    </div>

                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20 text-xl text-white backdrop-blur-md transition group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-black/5 bg-white/50 dark:border-white/10 dark:bg-black">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-10 text-sm text-neutral-500 sm:flex-row dark:text-white/40">
          <p>© 2026 Phạm Ngọc Thuần</p>

          <p className="bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text font-medium text-transparent">
            Designed for memories.
          </p>
        </div>
      </footer>
    </main>
  );
}